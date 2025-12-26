import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon?: string;
}

export const useWeather = (lat?: number, lng?: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using OpenWeatherMap API (free tier)
        // Set VITE_WEATHER_API_KEY in .env file or use demo key
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Weather data unavailable');
        }

        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 2.237), // Convert m/s to mph
          icon: data.weather[0].icon
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        // Fallback data
        setWeather({
          temperature: 72,
          condition: 'Clear',
          description: 'Clear sky',
          humidity: 50,
          windSpeed: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, [lat, lng]);

  return { weather, loading, error };
};

