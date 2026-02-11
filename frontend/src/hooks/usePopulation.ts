import { useQuery } from '@tanstack/react-query';

export function usePopulation(cityName: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['population', cityName, 'api-ninja'], // Changed key to force refetch
    queryFn: async () => {
      if (!cityName) return null;
      
      const apiKey = 'SHSgzW3Wxw4Jacw3v59QEr81PvfAnoY29t6FMVc5';
      // Clean city name logic
      let term = cityName.split(',')[0];
      
      // aggressive cleaning of administrative terms
      const removeTerms = [' City', ' District', ' Division', ' Cantonment', ' Tehsil'];
      removeTerms.forEach(t => {
          const re = new RegExp(t + '$', 'i');
          term = term.replace(re, '');
      });
      
      term = term.replace(/\(.*\)/g, '').trim();
      
      console.log(`Fetching population for raw: "${cityName}", cleaned: "${term}"`);

      const response = await fetch(
        `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(term)}&limit=1`,
        {
          headers: { 'X-Api-Key': 'SHSgzW3Wxw4Jacw3v59QEr81PvfAnoY29t6FMVc5' }
        }
      );
      
      if (!response.ok) {
        console.error('Population API failed', response.status);
        return null;
      }
      
      const json = await response.json();
      if (json && json.length > 0) {
          console.log('Population data:', json[0]);
          return json[0].population;
      }
      return 0;
    },
    enabled: !!cityName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { population: data, isLoading };
}
