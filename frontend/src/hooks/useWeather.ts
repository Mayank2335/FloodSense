import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface WeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  weather_code: number;
}

// Map OpenWeatherMap codes to our descriptions
const getWeatherCondition = (id: number): 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' => {
  if (id >= 200 && id < 300) return 'Stormy';
  if (id >= 300 && id < 600) return 'Rainy';
  if (id >= 600 && id < 700) return 'Rainy'; // Snow as Rainy for now
  if (id >= 700 && id < 800) return 'Cloudy'; // Atmosphere
  if (id === 800) return 'Sunny';
  if (id > 800) return 'Cloudy';
  return 'Cloudy';
};

export function useDistrictWeather(lat: number, lng: number) {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || "4787224742c45cb1dd7dc2b90de1bbf2";
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: async () => {
      // Use OpenWeatherMap API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Weather API Error:', response.status, errorData);
        throw new Error(`Weather data fetch failed: ${response.status} ${errorData.message || ''}`);
      }

      return response.json();
    },
    refetchInterval: 300000, 
    enabled: !!apiKey, // Only run if key exists
  });

  return {
    weather: data ? {
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      condition: getWeatherCondition(data.weather[0].id)
    } : null,
    isLoading,
    error
  };
}
