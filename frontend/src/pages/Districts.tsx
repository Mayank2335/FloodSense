import { useState } from 'react';
import { Header } from '@/components/Header';
import { DistrictCard } from '@/components/DistrictCard';
// import { mockDistricts } from '@/data/mockData'; // Removed dummy data
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { activeAlerts } from '@/data/mockData';
import { District, RiskLevel } from '@/types/flood';
import { useToast } from '@/hooks/use-toast';

const Districts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      toast({ title: "Configuration Error", description: "API Key is missing", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery)}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        const err = await response.json();
        console.error("OpenWeather Error:", err);
        throw new Error(err.message || 'City not found');
      }

      const data = await response.json();
      
      // 1. Fetch Real Population with robust fallback strategy
      // Primary: API Ninja (User provided key, highly accurate for major cities)
      // Secondary: Open-Meteo (Free, broader coverage for smaller towns like Bathinda)
      let realPopulation = 0;
      
      // Attempt 1: API Ninja
      try {
           const popResponse = await fetch(
            `https://api.api-ninjas.com/v1/city?name=${encodeURIComponent(data.name)}&limit=1`,
            { headers: { 'X-Api-Key': 'SHSgzW3Wxw4Jacw3v59QEr81PvfAnoY29t6FMVc5' } }
           );
           if (popResponse.ok) {
               const popData = await popResponse.json();
               if (popData && popData.length > 0) {
                   realPopulation = popData[0].population;
               }
           }
      } catch (e) {
          console.warn("API Ninja population fetch failed, attempting fallback...", e);
      }

      // Attempt 2: Open-Meteo Fallback (if Ninja returned nothing or failed)
      if (!realPopulation || realPopulation === 0) {
          try {
             // Clean name for Open-Meteo just in case
             const omResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(data.name)}&count=1&language=en&format=json`);
             if (omResponse.ok) {
                 const omData = await omResponse.json();
                 if (omData.results && omData.results.length > 0) {
                     realPopulation = omData.results[0].population || 0;
                 }
             }
          } catch(e) {
             console.error("Open-Meteo fallback failed", e);
          }
      }

      // 2. Fetch Real Flood Data (Open-Meteo)
      let riverDischarge = 0;
      let floodHistory = [];
      try {
          const floodResponse = await fetch(
            `https://flood-api.open-meteo.com/v1/flood?latitude=${data.coord.lat}&longitude=${data.coord.lon}&daily=river_discharge&past_days=3&forecast_days=1`
          );
          if (floodResponse.ok) {
              const floodJson = await floodResponse.json();
              // floodJson.daily.river_discharge is array [past_days ... today ... forecast]
              // Index 3 is "today" if past_days=3
              riverDischarge = floodJson.daily?.river_discharge?.[3] || 0;
              
              floodHistory = floodJson?.daily?.time?.map((t: string, i: number) => ({
                 time: new Date(t).toLocaleDateString(undefined, {weekday: 'short'}),
                 level: floodJson.daily.river_discharge[i]
              })) || [];
          }
      } catch (e) {
          console.error("Flood API error", e);
      }

      // Transform API data to District model
      const weatherId = data.weather[0].id;
      let condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' = 'Cloudy';
      if (weatherId >= 200 && weatherId < 300) condition = 'Stormy';
      else if (weatherId >= 300 && weatherId < 600) condition = 'Rainy';
      else if (weatherId >= 600 && weatherId < 700) condition = 'Rainy';
      else if (weatherId === 800) condition = 'Sunny';
      
      // Infer risk based on ACTUAL river discharge if available
      let risk: RiskLevel = 'safe';
      if (riverDischarge > 500) risk = 'danger'; // Arbitrary threshold for m3/s
      else if (riverDischarge > 200) risk = 'warning';
      else if (riverDischarge > 50) risk = 'watch';
      
      // Fallback to weather-based risk if river data is missing (e.g. no river nearby)
      if (riverDischarge === 0 && (condition === 'Stormy' || condition === 'Rainy')) {
         risk = condition === 'Stormy' ? 'danger' : 'watch';
      }

      const newDistrict: District = {
        id: `live-${data.id}`,
        name: data.name,
        region: data.sys.country,
        riskLevel: risk,
        rainfall24h: data.rain ? (data.rain['1h'] || 0) * 24 : 0, 
        rainfallForecast: 0,
        riverLevel: riverDischarge, // Actual m3/s
        lastUpdated: new Date(),
        population: realPopulation || 10000, 
        coordinates: { lat: data.coord.lat, lng: data.coord.lon },
        weather: {
          temp: Math.round(data.main.temp),
          condition: condition,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
        },
        // Use real flood history if available, else empty or simulated
        waterLevelHistory: floodHistory.length > 0 ? floodHistory : []
      };

      // Add to list, avoiding duplicates
      setDistricts(prev => {
        const filtered = prev.filter(d => d.id !== newDistrict.id);
        return [newDistrict, ...filtered];
      });
      
      setSearchQuery(''); 

    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not find weather data for that location.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header alertCount={activeAlerts.length} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              Live Monitoring
            </h1>
            <p className="text-muted-foreground mt-1">
              Search any city to get real-time flood risk analysis
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-96 flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search city (e.g., London, Mumbai)..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading}
                />
            </div>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        </div>

        {districts.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="inline-flex items-center justify-center p-4 bg-white shadow-sm rounded-full mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No locations monitored</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              Enter a city name above to fetch live weather and flood risk data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district) => (
              <DistrictCard key={district.id} district={district} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Districts;
