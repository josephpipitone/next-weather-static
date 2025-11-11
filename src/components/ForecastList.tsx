import { WeatherData, getWeatherIcon, formatDate } from '@/lib/weather';

interface ForecastListProps {
  weather: WeatherData;
  loading?: boolean;
}

export default function ForecastList({ weather, loading = false }: ForecastListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">7-Day Forecast</h3>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="h-8 bg-gray-200 rounded w-8"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">7-Day Forecast</h3>
      <div className="space-y-3">
        {weather.daily.time.slice(1).map((date, index) => {
          const dayIndex = index + 1;
          const high = Math.round(weather.daily.temperature_2m_max[dayIndex]);
          const low = Math.round(weather.daily.temperature_2m_min[dayIndex]);
          const icon = getWeatherIcon(weather.daily.weather_code[dayIndex]);
          const formattedDate = formatDate(date);

          return (
            <div key={date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">{formattedDate}</span>
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{high}°</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">{low}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}