import { District, RISK_LABELS } from '@/types/flood';
import { Badge } from '@/components/ui/badge';
import { CloudRain, Waves, Users, MapPin, Clock, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WeatherWidget } from './WeatherWidget'; // New import
import { WaterLevelChart } from './WaterLevelChart'; // New import
import { useDistrictWeather } from '@/hooks/useWeather';

interface DistrictCardProps {
  district: District;
  showWeather?: boolean;
}

export function DistrictCard({ district, showWeather = true }: DistrictCardProps) {
  // Try to specific real weather if coords exist
  const { weather: realWeather, isLoading: weatherLoading } = useDistrictWeather(
     district.coordinates?.lat || 0, 
     district.coordinates?.lng || 0
  );

  // Use real weather if available, otherwise fallback to provided weather prop (which might be real or mock)
  const displayWeather = realWeather || district.weather;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const borderStyles = {
    safe: 'border-success/30 hover:border-success/60',
    watch: 'border-watch/30 hover:border-watch/60',
    warning: 'border-warning/30 hover:border-warning/60',
    danger: 'border-destructive/50 hover:border-destructive shadow-glow-danger',
  };

  const progressStyles = {
    safe: 'bg-success',
    watch: 'bg-watch',
    warning: 'bg-warning',
    danger: 'bg-destructive',
  };

  const bgAccent = {
    safe: 'from-success/5 to-transparent',
    watch: 'from-watch/5 to-transparent',
    warning: 'from-warning/5 to-transparent',
    danger: 'from-destructive/10 to-transparent',
  };

  return (
    <div className={cn(
      'group relative rounded-xl border-2 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up flex flex-col',
      borderStyles[district.riskLevel],
      // Height control allowing expansion
      'h-full' 
    )}>
      {/* Gradient Background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br pointer-events-none',
        bgAccent[district.riskLevel]
      )} />

      {/* Danger Indicator Bar */}
      {district.riskLevel === 'danger' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-warning to-destructive animate-pulse" />
      )}

      <div className="relative p-5 flex flex-col h-full">
        {/* Header - Compact */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
              <MapPin className="h-3 w-3" />
              <span>{district.region}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {district.name}
            </h3>
          </div>
          <Badge variant={district.riskLevel} className="shadow-sm uppercase text-[10px] tracking-widest px-2 py-1">
            {RISK_LABELS[district.riskLevel]}
          </Badge>
        </div>

        {/* WEATHER WIDGET Integration */}
        {showWeather && (
          <>
            {district.coordinates && weatherLoading && !displayWeather ? (
                <div className="h-24 flex items-center justify-center border border-dashed border-slate-200 rounded-xl mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                  <span className="ml-2 text-xs text-slate-400">Syncing Satellite Data...</span>
                </div>
            ) : displayWeather ? (
              <div className="mb-4">
                <WeatherWidget weather={displayWeather} className="shadow-sm border-slate-200/50" />
              </div>
            ) : null}
          </>
        )}

        {/* Alert Message */}
        {district.alertMessage && (
          <div className={cn(
            'mb-4 rounded-lg p-3 text-sm border-l-4 transition-all duration-300 shadow-sm',
            district.riskLevel === 'danger' 
              ? 'bg-destructive/10 text-destructive border-destructive font-medium' 
              : district.riskLevel === 'warning' 
                ? 'bg-warning/10 text-warning-foreground border-warning' 
                : 'bg-muted text-muted-foreground border-muted'
          )}>
            {district.alertMessage}
          </div>
        )}

        {/* River Level & Trend Chart Section */}
        <div className="mb-4 bg-slate-50/50 rounded-lg p-3 border border-slate-100 flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Water Level Monitor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-lg font-bold ${district.riverLevel > 80 ? 'text-red-600' : 'text-slate-700'}`}>
                {district.riverLevel}%
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden mb-3">
            <div className="absolute top-0 left-[70%] w-0.5 h-full bg-yellow-400 z-10" />
            <div className="absolute top-0 left-[85%] w-0.5 h-full bg-red-500 z-10" />
            <div 
              className={cn(
                'h-full transition-all duration-700 ease-out rounded-full relative overflow-hidden',
                progressStyles[district.riskLevel]
              )}
              style={{ width: `${district.riverLevel}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          
          {/* Chart Integration */}
          {district.history && (
            <div className="border-t border-slate-200/50 pt-2">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-400 font-mono">24H Trend</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                     <TrendingUp className="h-3 w-3" />
                     <span>Rising</span>
                  </div>
               </div>
               <WaterLevelChart data={district.history} threshold={90} />
            </div>
          )}
        </div>

        {/* Footer Stats Row */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-border/50">
            <div className="text-center p-2 rounded bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Rainfall</p>
              <p className="font-mono text-sm font-bold text-slate-700">{district.rainfall24h} mm</p>
            </div>
            <div className="text-center p-2 rounded bg-slate-50 border border-slate-100">
              <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Population</p>
              <p className="font-mono text-sm font-bold text-slate-700">{formatNumber(district.population)}</p>
            </div>
        </div>
      </div>
    </div>
  );
}
