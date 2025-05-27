import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const DetailItem: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/20 last:border-b-0">
    <span className="text-sky-200 text-sm sm:text-base">{label}:</span>
    <span className="font-semibold text-sky-50 text-sm sm:text-base">{value}{unit && <span className="text-xs ml-1">{unit}</span>}</span>
  </div>
);

const formatLastUpdatedTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return "recently";
  }
};

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, onRefresh, isRefreshing }) => {
  const { 
    temperature, 
    humidity, 
    windSpeed, 
    description, 
    icon,
    feelsLike,
    pressure,
    visibility,
    uvIndex,
    precipitationChance,
    sunrise,
    sunset,
    aqi,
    aqiDescription,
    lastUpdated
  } = weatherData;

  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <WeatherIcon iconType={icon} />
        <p className="text-5xl md:text-6xl font-bold tracking-tight text-white">
          {Math.round(temperature)}<span className="text-3xl align-top">°C</span>
        </p>
        <p className="text-lg text-sky-100 capitalize">{description}</p>
        <p className="text-sm text-sky-200">Feels like: {Math.round(feelsLike)}°C</p>
      </div>

      <div className="space-y-1 pt-4">
        <DetailItem label="Humidity" value={humidity} unit="%" />
        <DetailItem label="Wind Speed" value={windSpeed} unit="km/h" />
        <DetailItem label="Pressure" value={pressure} unit="hPa" />
        <DetailItem label="Visibility" value={visibility} unit="km" />
        <DetailItem label="UV Index" value={uvIndex} />
        <DetailItem label="Precipitation" value={precipitationChance} unit="%" />
        <DetailItem label="Sunrise" value={sunrise} />
        <DetailItem label="Sunset" value={sunset} />
        <DetailItem label="AQI" value={aqi} />
        <DetailItem label="Air Quality" value={aqiDescription} />
      </div>

      <div className="mt-6 pt-4 border-t border-white/20 text-center">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400/50 text-white font-semibold py-2 px-6 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-75 flex items-center justify-center mx-auto w-full sm:w-auto"
          aria-label="Refresh weather forecast"
        >
          {isRefreshing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
             "🔄 Refresh Weather"
          )}
        </button>
        <p className="text-xs text-sky-200/80 mt-3">
          Last updated: {formatLastUpdatedTime(lastUpdated)}
        </p>
      </div>
    </div>
  );
};