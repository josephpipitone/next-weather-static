'use client';

import { useState, useEffect } from 'react';
import LocationSearch from '@/components/LocationSearch';
import WeatherCard from '@/components/WeatherCard';
import ForecastList from '@/components/ForecastList';
import ErrorMessage from '@/components/ErrorMessage';
import { WeatherData, LocationData, fetchWeatherData } from '@/lib/weather';

const DEFAULT_LOCATION: LocationData = {
  name: 'Fairport, NY',
  latitude: 43.0987,
  longitude: -77.4422,
  country: 'United States'
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = async (location: LocationData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData(location.latitude, location.longitude);
      data.location = location; // Update location info
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(currentLocation);
  }, []);

  const handleLocationSelect = (location: LocationData) => {
    setCurrentLocation(location);
    loadWeatherData(location);
  };

  const handleRetry = () => {
    loadWeatherData(currentLocation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-gray-800 dark:via-gray-900 dark:to-black transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white dark:text-gray-100 mb-2">Weather App</h1>
          <p className="text-blue-100 dark:text-gray-300">Get current weather and forecasts for any location</p>
        </div>

        <LocationSearch
          onLocationSelect={handleLocationSelect}
          currentLocation={currentLocation}
        />

        {error && (
          <div className="max-w-md mx-auto mb-6">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <WeatherCard weather={weather!} loading={loading} />
          </div>
          <div className="lg:col-span-2">
            <ForecastList weather={weather!} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
