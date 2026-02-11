import { useQuery } from '@tanstack/react-query';

export function useFloodData(lat: number, lng: number) {
  // Open-Meteo Flood API
  // Free tier does not require an API key. 
  // If a key is needed for higher limits, it can be appended as &apikey=YOUR_KEY
  // but standard usage is free.
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['flood', lat, lng],
    queryFn: async () => {
      if (!lat || !lng) return null;
      
      // Fetching River Discharge (m³/s) with history for chart
      const response = await fetch(
        `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lng}&daily=river_discharge&past_days=7&forecast_days=3`
      );
      
      if (!response.ok) {
        throw new Error('Flood data fetch failed');
      }

      return response.json();
    },
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Extract today's river discharge
  // daily.river_discharge is an array [today, tomorrow, ...]
  const riverDischarge = data?.daily?.river_discharge?.[7]; // Index 7 is "today" if past_days=7

  // Format data for Recharts: [{ time: 'Mon', level: 10 }, ...]
  const dischargeHistory = data?.daily?.time?.map((dateStr: string, index: number) => ({
      time: new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short' }),
      level: data.daily.river_discharge[index]
  })) || [];

  return {
    riverDischarge, // in m³/s (current/today)
    dischargeHistory, // Array for chart
    isLoading,
    error
  };
}
