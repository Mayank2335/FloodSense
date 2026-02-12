import { useQuery } from '@tanstack/react-query';

const fetchPopulationForCity = async (cityName: string | null) => {
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

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(term)}&limit=1`,
      {
        headers: { 'X-Api-Key': apiKey }
      }
    );
    
    if (!response.ok) {
      console.error('Population API failed', response.status);
      return null;
    }
    
    const json = await response.json();
    if (json && json.length > 0) {
        console.log('Population data (Ninja):', json[0]);
        // If it returns a result, we generally trust it. 
        // Refinement: If we wanted to prefer India, we'd need country context.
        return json[0].population;
    }

    // Fallback: Open-Meteo Geocoding API
    // This often has better coverage for smaller Indian towns than Ninja Free Tier
    console.log(`Attempting Open-Meteo fallback for: "${term}"`);
    const omResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(term)}&count=1&language=en&format=json`);
    if (omResponse.ok) {
        const omData = await omResponse.json();
        if (omData.results && omData.results.length > 0) {
            console.log('Population data (Open-Meteo):', omData.results[0]);
            return omData.results[0].population || 0;
        }
    }

  } catch (error) {
    console.error("Error fetching population:", error);
  }
  return 0;
};

export { fetchPopulationForCity };

export function usePopulation(cityName: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: ['population', cityName, 'api-ninja'], // Changed key to force refetch
    queryFn: () => fetchPopulationForCity(cityName),
    enabled: !!cityName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { population: data, isLoading };
}
