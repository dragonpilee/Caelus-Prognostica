import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { WeatherData, ApiKeyError, WeatherIconType } from '../types';

const API_KEY = process.env.API_KEY;

export const isApiKeyConfigured = (): boolean => {
  return !!API_KEY;
};

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

const model = 'gemini-2.5-flash-preview-04-17';

const validIconTypes: WeatherIconType[] = [
  'sunny', 'cloudy', 'partly-cloudy-day', 'partly-cloudy-night', 'rain', 'light-rain', 'heavy-rain', 
  'snow', 'light-snow', 'heavy-snow', 'thunderstorm', 'fog', 'windy', 'mist', 'drizzle', 'unknown'
];

// Helper to determine if it's day or night based on current time and sunrise/sunset
const isDayTime = (sunriseStr: string, sunsetStr: string): boolean => {
  const now = new Date();
  
  const [sunriseHours, sunriseMinutesPeriod] = sunriseStr.split(':');
  const [sunriseMinutes, sunrisePeriod] = sunriseMinutesPeriod.split(' ');
  let riseHours = parseInt(sunriseHours);
  if (sunrisePeriod?.toLowerCase() === 'pm' && riseHours < 12) riseHours += 12;
  if (sunrisePeriod?.toLowerCase() === 'am' && riseHours === 12) riseHours = 0; // Midnight case

  const [sunsetHours, sunsetMinutesPeriod] = sunsetStr.split(':');
  const [sunsetMinutes, sunsetPeriod] = sunsetMinutesPeriod.split(' ');
  let setHours = parseInt(sunsetHours);
  if (sunsetPeriod?.toLowerCase() === 'pm' && setHours < 12) setHours += 12;
  if (sunsetPeriod?.toLowerCase() === 'am' && setHours === 12) setHours = 0;

  const sunriseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), riseHours, parseInt(sunriseMinutes));
  const sunsetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), setHours, parseInt(sunsetMinutes));

  return now >= sunriseDate && now < sunsetDate;
};


export const predictWeather = async (latitude: number, longitude: number): Promise<WeatherData> => {
  if (!ai) {
    const error: ApiKeyError = new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
    error.isApiKeyError = true;
    throw error;
  }

  const prompt = `
    You are a helpful weather forecasting assistant.
    Based on the coordinates latitude ${latitude.toFixed(4)} and longitude ${longitude.toFixed(4)}, provide a detailed weather forecast.
    Identify the city or general area name if possible.
    Include:
    - Current temperature in Celsius (integer)
    - Feels like temperature in Celsius (integer)
    - Humidity percentage (integer, 0-100)
    - Wind speed in km/h (integer)
    - Atmospheric pressure in hPa (integer)
    - Visibility in km (integer)
    - UV Index (integer, 0-11+)
    - Chance of precipitation (integer, 0-100)
    - Sunrise time (e.g., "06:30 AM")
    - Sunset time (e.g., "07:45 PM")
    - Air Quality Index (AQI) as an integer value (e.g., based on US EPA scale 0-500+)
    - A brief qualitative description of the AQI (e.g., "Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous")
    - A concise general weather description (e.g., "Clear sky", "Scattered clouds", "Light rain")
    - A suggested weather icon. The icon choice should consider if it's day or night for "partly-cloudy". For example, use "partly-cloudy-day" or "partly-cloudy-night". For "sunny", it implies daytime.

    Respond ONLY with a valid JSON object matching the following structure. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
    The "icon" value MUST be one of these exact strings: ${validIconTypes.join(', ')}.
    Sunrise and sunset times should be in a common, human-readable format like "06:30 AM" or "18:30".

    JSON structure:
    {
      "temperature": number,
      "feelsLike": number,
      "humidity": number,
      "windSpeed": number,
      "pressure": number,
      "visibility": number,
      "uvIndex": number,
      "precipitationChance": number,
      "sunrise": string,
      "sunset": string,
      "aqi": number, // AQI numeric value
      "aqiDescription": string, // AQI qualitative description
      "description": string,
      "icon": "${validIconTypes.join('" | "')}", 
      "city": string | null
    }

    Example:
    {
      "temperature": 25,
      "feelsLike": 27,
      "humidity": 60,
      "windSpeed": 10,
      "pressure": 1012,
      "visibility": 10,
      "uvIndex": 7,
      "precipitationChance": 10,
      "sunrise": "06:15 AM",
      "sunset": "07:30 PM",
      "aqi": 45,
      "aqiDescription": "Good",
      "description": "Sunny and pleasant",
      "icon": "sunny",
      "city": "Mountain View"
    }
  `;

  let geminiApiResponse: GenerateContentResponse | undefined;

  try {
    geminiApiResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4, 
      }
    });

    let jsonStr = geminiApiResponse.text.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (
      typeof parsedData.temperature !== 'number' ||
      typeof parsedData.feelsLike !== 'number' ||
      typeof parsedData.humidity !== 'number' ||
      typeof parsedData.windSpeed !== 'number' ||
      typeof parsedData.pressure !== 'number' ||
      typeof parsedData.visibility !== 'number' ||
      typeof parsedData.uvIndex !== 'number' ||
      typeof parsedData.precipitationChance !== 'number' ||
      typeof parsedData.sunrise !== 'string' ||
      typeof parsedData.sunset !== 'string' ||
      typeof parsedData.aqi !== 'number' || // AQI validation
      typeof parsedData.aqiDescription !== 'string' || // AQI description validation
      typeof parsedData.description !== 'string' ||
      typeof parsedData.icon !== 'string' ||
      !validIconTypes.includes(parsedData.icon as WeatherIconType) ||
      (parsedData.city !== null && typeof parsedData.city !== 'string')
    ) {
      console.error("Invalid data structure from Gemini:", parsedData, "Original text:", geminiApiResponse.text);
      throw new Error('AI provided an invalid or incomplete weather data format.');
    }
    
    // If Gemini returns 'partly-cloudy', try to infer day/night based on sunrise/sunset
    let finalIcon = parsedData.icon as WeatherIconType;
    if (finalIcon === 'partly-cloudy' as any) { // Temp cast for check
        finalIcon = isDayTime(parsedData.sunrise, parsedData.sunset) ? 'partly-cloudy-day' : 'partly-cloudy-night';
    }


    return {
        temperature: Math.round(parsedData.temperature),
        feelsLike: Math.round(parsedData.feelsLike),
        humidity: Math.round(parsedData.humidity),
        windSpeed: Math.round(parsedData.windSpeed),
        pressure: Math.round(parsedData.pressure),
        visibility: Math.round(parsedData.visibility),
        uvIndex: Math.round(parsedData.uvIndex),
        precipitationChance: Math.round(parsedData.precipitationChance),
        sunrise: parsedData.sunrise,
        sunset: parsedData.sunset,
        aqi: Math.round(parsedData.aqi),
        aqiDescription: parsedData.aqiDescription,
        description: parsedData.description,
        icon: finalIcon,
        city: parsedData.city || undefined,
        lastUpdated: new Date().toISOString() 
    };

  } catch (error) {
    console.error('Error calling Gemini API or parsing response:', error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
         const apiError: ApiKeyError = new Error("Invalid API Key. Please check your Gemini API key.");
         apiError.isApiKeyError = true;
         throw apiError;
    }
    if (error instanceof SyntaxError && geminiApiResponse && geminiApiResponse.text) {
        throw new Error(`AI returned malformed data. Could not parse weather information. Raw AI output: ${geminiApiResponse.text.substring(0,100)}...`);
    }
    throw new Error(`Failed to get weather prediction from AI. ${error instanceof Error ? error.message : 'Unknown AI error'}`);
  }
};