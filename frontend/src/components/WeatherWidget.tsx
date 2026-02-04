import { CloudRain, Sun, Cloud, CloudLightning, Wind, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherWidgetProps {
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  className?: string;
}

export function WeatherWidget({ weather, className }: WeatherWidgetProps) {
  const getIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'stormy': return <CloudLightning className="h-8 w-8 text-yellow-400 animate-pulse" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-slate-300" />;
      case 'sunny': return <Sun className="h-8 w-8 text-orange-400 animate-spin-slow" />;
      default: return <Sun className="h-8 w-8 text-orange-400" />;
    }
  };

  const getGradient = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'stormy': return 'from-slate-800 to-slate-900 border-yellow-500/30';
      case 'rainy': return 'from-blue-900/80 to-slate-900 border-blue-500/30';
      case 'cloudy': return 'from-slate-700 to-slate-800 border-slate-500/30';
      case 'sunny': return 'from-sky-900/80 to-blue-900 border-orange-500/30';
      default: return 'from-slate-800 to-slate-900';
    }
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-4 shadow-lg bg-gradient-to-br backdrop-blur-md",
      getGradient(weather.condition),
      className
    )}>
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="text-3xl font-bold text-white tracking-tight">{weather.temp}°</span>
             <span className="text-xs font-medium text-white/60 uppercase tracking-widest">{weather.condition}</span>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-blue-100/70">
              <Droplets className="h-3 w-3" />
              <span>{weather.humidity}% Humidity</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-100/70">
              <Wind className="h-3 w-3" />
              <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        <div className="p-2 bg-white/10 rounded-full shadow-inner ring-1 ring-white/20">
           {getIcon(weather.condition)}
        </div>
      </div>
    </div>
  );
}
