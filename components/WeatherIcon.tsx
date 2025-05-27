
import React from 'react';
import { WeatherIconType } from '../types';

interface WeatherIconProps {
  iconType: WeatherIconType;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconType, className = "text-7xl md:text-8xl" }) => {
  const iconMap: Record<WeatherIconType, string> = {
    'sunny': '☀️',
    'cloudy': '☁️',
    'partly-cloudy-day': '⛅', // Updated from 'partly-cloudy'
    'partly-cloudy-night': '⛅', // Added for night variant
    'rain': '🌧️',
    'light-rain': '🌦️',
    'heavy-rain': '⛈️',
    'snow': '❄️',
    'light-snow': '🌨️',
    'heavy-snow': '☃️',
    'thunderstorm': '⛈️',
    'fog': '🌫️',
    'mist': '🌫️',
    'drizzle': '💧',
    'windy': '💨',
    'unknown': '❓'
  };
  
  const accessibleLabel = iconType.replace('-', ' ');

  return (
      <span 
        className={`${className} inline-block transform transition-transform duration-300 ease-out hover:scale-110`} 
        role="img" 
        aria-label={accessibleLabel}
      >
        {iconMap[iconType] || iconMap['unknown']}
      </span>
  );
};
