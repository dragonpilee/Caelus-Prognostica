
import React, { useState, useEffect, useCallback } from 'react';
import { Coordinates, WeatherData, ApiKeyError, WeatherIconType } from './types';
import { getCurrentLocation } from './services/geolocationService';
import { predictWeather, isApiKeyConfigured } from './services/geminiService';
import { LocationDisplay } from './components/LocationDisplay';
import { WeatherDisplay } from './components/WeatherDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';

const isDayTime = (weather: WeatherData | null): boolean => {
  if (!weather || !weather.sunrise || !weather.sunset) return true; // Default to day if no data

  const now = new Date();
  
  const parseTime = (timeStr: string): Date | null => {
    const [time, period] = timeStr.split(' ');
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    if (isNaN(hours) || isNaN(minutes)) return null;

    if (period?.toLowerCase() === 'pm' && hours < 12) hours += 12;
    if (period?.toLowerCase() === 'am' && hours === 12) hours = 0; // Midnight case

    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    return date;
  };

  const sunriseDate = parseTime(weather.sunrise);
  const sunsetDate = parseTime(weather.sunset);

  if (!sunriseDate || !sunsetDate) return true; // Default to day if parsing fails

  return now >= sunriseDate && now < sunsetDate;
};


const getWeatherBackgroundClasses = (weather: WeatherData | null): string => {
  if (!weather || !weather.icon) return 'bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700'; // Default

  const dayTime = isDayTime(weather);
  const icon = weather.icon;

  if (icon === 'sunny') return 'bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 animate-bg-pulse';
  if (icon === 'partly-cloudy-day') return 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 animate-bg-subtle-shift';
  if (icon === 'cloudy') return 'bg-gradient-to-br from-slate-400 via-gray-500 to-slate-600 animate-bg-subtle-shift';
  
  if (icon === 'rain' || icon === 'light-rain' || icon === 'heavy-rain' || icon === 'drizzle') {
    return dayTime 
      ? 'bg-gradient-to-br from-blue-500 via-slate-600 to-gray-700 animate-bg-rainy'
      : 'bg-gradient-to-br from-indigo-700 via-slate-800 to-gray-900 animate-bg-rainy';
  }
  if (icon === 'snow' || icon === 'light-snow' || icon === 'heavy-snow') {
    return dayTime
      ? 'bg-gradient-to-br from-sky-200 via-slate-300 to-gray-400 animate-bg-subtle-shift'
      : 'bg-gradient-to-br from-indigo-400 via-slate-500 to-gray-600 animate-bg-subtle-shift';
  }
  if (icon === 'thunderstorm') return 'bg-gradient-to-br from-slate-700 via-purple-800 to-gray-900 animate-bg-storm';
  if (icon === 'fog' || icon === 'mist') return 'bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500 animate-bg-subtle-shift';
  
  if (!dayTime) { // General night backgrounds
    if (icon === 'partly-cloudy-night') return 'bg-gradient-to-br from-indigo-800 via-purple-900 to-slate-900 animate-bg-subtle-shift';
    return 'bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 animate-bg-pulse-night'; // Clear night
  }
  
  return 'bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700'; // Fallback default
};


const App: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  const [mainCardVisible, setMainCardVisible] = useState<boolean>(false);

  const backgroundClasses = getWeatherBackgroundClasses(weather);

  const fetchLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    setWeather(null); 
    setWeatherError(null);
    setMainCardVisible(false); 
    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
    } catch (error) {
      if (error instanceof Error) {
        setLocationError(error.message);
      } else {
        setLocationError('An unknown error occurred while fetching location.');
      }
      setLocation(null);
      setMainCardVisible(true); // Show error card
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  const handleFetchWeather = useCallback(async (coords: Coordinates) => {
    if (!isApiKeyConfigured()) {
      setApiKeyMissing(true);
      setWeatherError("API Key is not configured. Please contact the administrator.");
      setIsLoadingWeather(false);
      setMainCardVisible(true);
      return;
    }
    setApiKeyMissing(false);
    setIsLoadingWeather(true);
    setWeatherError(null);
    // Don't hide card during refresh, only initial load
    // setMainCardVisible(false); 
    try {
      const weatherData = await predictWeather(coords.latitude, coords.longitude);
      setWeather(weatherData);
      setMainCardVisible(true);
    } catch (error) {
        const err = error as ApiKeyError;
        if (err.isApiKeyError) {
            setApiKeyMissing(true);
            setWeatherError(err.message);
        } else if (error instanceof Error) {
            setWeatherError(`Failed to fetch weather: ${error.message}`);
        } else {
            setWeatherError('An unknown error occurred while fetching weather data.');
        }
        setMainCardVisible(true); // Ensure card is visible to show error
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]); 

  useEffect(() => {
    if (location && !weather && !isLoadingLocation) { 
      handleFetchWeather(location);
    }
  }, [location, weather, isLoadingLocation, handleFetchWeather]);
  
  useEffect(() => {
    // Trigger main card animation slightly after initial elements might be ready
    if(!isLoadingLocation && (location || locationError || apiKeyMissing)){
        const timer = setTimeout(() => setMainCardVisible(true), 100);
        return () => clearTimeout(timer);
    }
  }, [isLoadingLocation, location, locationError, apiKeyMissing]);


  const onRefreshWeather = () => {
    if (location) {
      handleFetchWeather(location);
    }
  };

  const renderContent = () => {
    if (apiKeyMissing && !isLoadingLocation) {
      return <ErrorDisplay message={weatherError || "API Key is not configured. This application cannot function without it."} />;
    }
    if (isLoadingLocation) {
      return <LoadingSpinner text="Locating your position..." />;
    }
    if (locationError) {
      return <ErrorDisplay message={locationError} onRetry={fetchLocation} />;
    }
    if (location) {
      if (isLoadingWeather && !weather) { 
        return (
          <>
            <LocationDisplay coordinates={location} />
            <LoadingSpinner text="Conjuring weather spirits..." />
          </>
        );
      }
      if (weatherError && !weather && !apiKeyMissing) {
         return (
          <>
            <LocationDisplay coordinates={location} />
            <ErrorDisplay message={weatherError} onRetry={() => handleFetchWeather(location)} />
          </>
        );
      }
      if (weather) { 
        return (
          <>
            <LocationDisplay coordinates={location} city={weather.city} />
            {weatherError && !apiKeyMissing && ( 
                <div className="mb-4">
                    <ErrorDisplay message={`Refresh failed: ${weatherError}. Showing last forecast.`} />
                </div>
            )}
            <WeatherDisplay 
                weatherData={weather} 
                onRefresh={onRefreshWeather}
                isRefreshing={isLoadingWeather}
            />
          </>
        );
      }
       return (
         <>
           <LocationDisplay coordinates={location} />
           <LoadingSpinner text="Consulting the oracles..." />
         </>
       );
    }
    return <ErrorDisplay message="The cosmos seems unsettled. Please try refreshing." />;
  };

  return (
    <div className={`min-h-screen text-white flex flex-col items-center justify-center p-4 selection:bg-sky-300 selection:text-sky-900 transition-all duration-1000 ease-in-out ${backgroundClasses}`}>
      <header className="text-center mb-8 md:mb-12 animate-fade-in-down">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-shadow-lg">
          Caelus Prognostica
        </h1>
        <p className="mt-3 text-lg md:text-xl text-sky-100/90 text-shadow">
          AI-powered glimpses into the atmospheric tapestry.
        </p>
      </header>
      
      <main 
        className={`w-full max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-5xl bg-white/25 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-8 lg:p-10 transform transition-all duration-500 hover:scale-[1.02] ${mainCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ perspective: '1000px' }} // For potential 3D hover effects if desired later
        >
        {renderContent()}
      </main>

      <footer className="mt-12 text-center text-sm text-sky-200/80 animate-fade-in-up">
        <p>&copy; {new Date().getFullYear()} Caelus Prognostica. Developed by Alan Cyril Sunny.</p>
        <p>Weather data is AI-generated, observe with wisdom.</p>
      </footer>
    </div>
  );
};

export default App;