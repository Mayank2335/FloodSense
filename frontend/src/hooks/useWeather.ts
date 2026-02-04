import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface WeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
}

// Map WMO Weather codes to our meaningful descriptions
const getWeatherCondition = (code: number): 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' => {
  if (code <= 3) return 'Sunny';
  if (code <= 48) return 'Cloudy';
  if (code <= 67 || (code >= 80 && code <= 82)) return 'Rainy';
  if (code >= 95) return 'Stormy';
  return 'Cloudy'; // Default
};

export function useDistrictWeather(lat: number, lng: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: async () => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      return response.json();
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const currentWeather = data?.current;

  return {
    weather: currentWeather ? {
      temp: Math.round(currentWeather.temperature_2m),
      humidity: currentWeather.relative_humidity_2m,
      windSpeed: Math.round(currentWeather.wind_speed_10m),
      condition: getWeatherCondition(currentWeather.weather_code)
    } : null,
    isLoading,
    error
  };
}
