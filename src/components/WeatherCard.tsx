import { WeatherData, getWeatherIcon, formatWindDirection, formatTime } from '@/lib/weather';

interface WeatherCardProps {
  weather: WeatherData;
  loading?: boolean;
}

export default function WeatherCard({ weather, loading = false }: WeatherCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="text-center mb-6">
          <div className="h-16 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
          <div className="h-12 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const currentTemp = Math.round(weather.current.temperature_2m);
  const windSpeed = Math.round(weather.current.wind_speed_10m);
  const windDir = formatWindDirection(weather.current.wind_direction_10m);
  const currentTime = formatTime(weather.current.time);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {weather.location.name || 'Current Location'}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{currentTime}</span>
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl mb-2">
          {getWeatherIcon(weather.daily.weather_code[0])}
        </div>
        <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {currentTemp}°F
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Feels like {currentTemp}°F
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">💨</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Wind</div>
          <div className="font-semibold text-gray-800 dark:text-gray-100">
            {windSpeed} mph {windDir}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl mb-1">🌡️</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
          <div className="font-semibold text-gray-800 dark:text-gray-100">65%</div>
        </div>
      </div>
    </div>
  );
}