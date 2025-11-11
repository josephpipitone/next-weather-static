'use client';

import { useState, useEffect, useRef } from 'react';
import { LocationData, searchLocations } from '@/lib/weather';

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  currentLocation?: LocationData;
}

export default function LocationSearch({ onLocationSelect, currentLocation }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLocation) {
      setQuery(`${currentLocation.name}${currentLocation.admin1 ? `, ${currentLocation.admin1}` : ''}, ${currentLocation.country}`);
    }
  }, [currentLocation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (value: string) => {
    setQuery(value);
    setError(null);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchLocations(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch (err) {
      setError('Failed to search locations');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: LocationData) => {
    setQuery(`${location.name}${location.admin1 ? `, ${location.admin1}` : ''}, ${location.country}`);
    setShowSuggestions(false);
    setSuggestions([]);
    onLocationSelect(location);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode to get location name
            const results = await searchLocations(`${latitude},${longitude}`);
            if (results.length > 0) {
              handleLocationSelect(results[0]);
            } else {
              // Fallback to coordinates
              handleLocationSelect({
                name: 'Current Location',
                latitude,
                longitude,
                country: 'Unknown'
              });
            }
          } catch (err) {
            setError('Failed to get location name');
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          setError('Unable to get your location');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          {isLoading && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        <button
          onClick={handleCurrentLocation}
          disabled={isLoading}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
          title="Use current location"
        >
          📍
        </button>
      </div>

      {error && (
        <div className="mt-2 text-red-600 text-sm">{error}</div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((location, index) => (
            <button
              key={`${location.latitude}-${location.longitude}-${index}`}
              onClick={() => handleLocationSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {location.name}
                {location.admin1 && `, ${location.admin1}`}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{location.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}