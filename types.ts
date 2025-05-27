export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type WeatherIconType = 
  | 'sunny' 
  | 'cloudy' 
  | 'partly-cloudy-day' // Differentiated for day
  | 'partly-cloudy-night' // Differentiated for night
  | 'rain' 
  | 'light-rain'
  | 'heavy-rain'
  | 'snow' 
  | 'light-snow'
  | 'heavy-snow'
  | 'thunderstorm' 
  | 'fog' 
  | 'windy' 
  | 'mist'
  | 'drizzle'
  | 'unknown';

export interface WeatherData {
  temperature: number; // Celsius
  humidity: number;    // Percentage
  windSpeed: number;   // km/h
  description: string;
  icon: WeatherIconType;
  city?: string;
  feelsLike: number; // Celsius
  pressure: number; // hPa
  visibility: number; // km
  uvIndex: number; // 0-11+
  precipitationChance: number; // Percentage (0-100)
  sunrise: string; // e.g., "06:30 AM"
  sunset: string; // e.g., "07:45 PM"
  aqi: number; // Air Quality Index value
  aqiDescription: string; // e.g., "Good", "Moderate", "Unhealthy"
  lastUpdated: string; // ISO string or formatted string
}

export interface ApiKeyError extends Error {
  isApiKeyError?: boolean;
}