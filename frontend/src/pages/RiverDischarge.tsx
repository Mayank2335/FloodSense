import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, AlertTriangle, Droplets } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { fetchWeatherApi } from 'openmeteo';

interface RiverData {
  time: string;
  discharge: number;
}

const RiverDischarge = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RiverData[] | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  const searchCity = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setData(null);
    setLocationName(null);

    try {
      // First geocode the city
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      setLocationName(`${name}, ${country}`);

      // Now fetch river discharge data from open-meteo flood api
      const params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "river_discharge",
        "past_days": 30,
        "forecast_days": 7
      };
      
      const url = "https://flood-api.open-meteo.com/v1/flood";
      const responses = await fetchWeatherApi(url, params);
      
      // Process the response
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const daily = response.daily()!;
      
      // Note: The time definitions in the openmeteo helper are low-level Float32 arrays
      // We need to convert them to readable dates
      const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

      const timeArray = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
        (t) => new Date((t + utcOffsetSeconds) * 1000)
      );

      const dischargeArray = daily.variables(0)!.valuesArray()!;

      const chartData: RiverData[] = [];
      for (let i = 0; i < timeArray.length; i++) {
        chartData.push({
          time: timeArray[i].toLocaleDateString(),
          discharge: dischargeArray[i]
        });
      }

      setData(chartData);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header alertCount={0} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">River Discharge Monitor</h1>

        <div className="flex gap-4 mb-8 max-w-lg">
          <Input 
            placeholder="Enter city name (e.g., London, Mumbai, New York)" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchCity()}
            className="flex-grow"
          />
          <Button onClick={searchCity} disabled={loading}>
            {loading ? <span className="animate-spin mr-2">⏳</span> : <Search className="w-4 h-4 mr-2" />}
            Search
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>River Discharge - {locationName}</CardTitle>
                <CardDescription>
                  Daily river discharge (m³/s) for the past 30 days and 7 day forecast.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorDischarge" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis label={{ value: 'Discharge (m³/s)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="discharge" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDischarge)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-2xl font-bold text-blue-600">
                     {data[data.length - 8]?.discharge.toFixed(2)} m³/s
                   </div>
                   <p className="text-sm text-slate-500">Estimated discharge for today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Peak Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="text-2xl font-bold text-amber-600">
                     {Math.max(...data.slice(-7).map(d => d.discharge)).toFixed(2)} m³/s
                   </div>
                   <p className="text-sm text-slate-500">Highest predicted in next 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trend</CardTitle>
                </CardHeader>
                <CardContent>
                   {(() => {
                     const today = data[data.length - 8]?.discharge || 0;
                     const tomorrow = data[data.length - 7]?.discharge || 0;
                     const diff = tomorrow - today;
                     return (
                       <div>
                         <div className={`text-2xl font-bold ${diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                           {diff > 0 ? '↑ Rising' : '↓ Falling'}
                         </div>
                         <p className="text-sm text-slate-500">
                           {Math.abs(diff).toFixed(2)} m³/s change expected tomorrow
                         </p>
                       </div>
                     )
                   })()}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {!data && !loading && !error && (
            <div className="text-center py-20 text-slate-400 bg-white rounded-lg border border-dashed border-slate-300">
                <Droplets className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-slate-900">No Data to Display</h3>
                <p>Search for a city to see river discharge analytics.</p>
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RiverDischarge;