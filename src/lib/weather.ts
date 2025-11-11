export interface WeatherData {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,wind_speed_10m,wind_direction_10m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
    forecast_days: '7'
  });

  const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    current: data.current,
    daily: data.daily,
    location: {
      name: '', // Will be set by caller
      latitude: lat,
      longitude: lon
    }
  };
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json'
  });

  const response = await fetch(`${GEOCODING_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data = await response.json();

  return data.results?.map((result: any) => ({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1
  })) || [];
}

export function getWeatherIcon(code: number): string {
  // WMO Weather interpretation codes
  const icons: Record<number, string> = {
    0: '☀️', // Clear sky
    1: '🌤️', // Mainly clear
    2: '⛅', // Partly cloudy
    3: '☁️', // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌦️', // Light drizzle
    53: '🌦️', // Moderate drizzle
    55: '🌦️', // Dense drizzle
    56: '🌨️', // Light freezing drizzle
    57: '🌨️', // Dense freezing drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    66: '🌨️', // Light freezing rain
    67: '🌨️', // Heavy freezing rain
    71: '❄️', // Slight snow fall
    73: '❄️', // Moderate snow fall
    75: '❄️', // Heavy snow fall
    77: '❄️', // Snow grains
    80: '🌧️', // Slight rain showers
    81: '🌧️', // Moderate rain showers
    82: '🌧️', // Violent rain showers
    85: '❄️', // Slight snow showers
    86: '❄️', // Heavy snow showers
    95: '⛈️', // Thunderstorm
    96: '⛈️', // Thunderstorm with slight hail
    99: '⛈️', // Thunderstorm with heavy hail
  };

  return icons[code] || '☀️';
}

export function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}