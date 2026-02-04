import { useState } from 'react';
import { Map, ZoomIn, ZoomOut, Layers, Navigation, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockDistricts } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { District } from '@/types/flood';

interface MapMarkerProps {
  district: District;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
}

function MapMarker({ district, x, y, isSelected, onClick }: MapMarkerProps) {
  const markerStyles = {
    safe: 'bg-success border-success-foreground',
    watch: 'bg-watch border-watch-foreground',
    warning: 'bg-warning border-warning-foreground animate-pulse',
    danger: 'bg-destructive border-destructive-foreground animate-pulse-alert',
  };

  const glowStyles = {
    safe: '',
    watch: '',
    warning: 'shadow-glow-warning',
    danger: 'shadow-glow-danger',
  };

  const size = district.riskLevel === 'danger' ? 'w-5 h-5' : 
               district.riskLevel === 'warning' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <div 
      className="absolute cursor-pointer group transition-transform duration-200 hover:scale-125"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
    >
      {/* Ripple effect for danger zones */}
      {district.riskLevel === 'danger' && (
        <div className="absolute -inset-3 bg-destructive/20 rounded-full animate-ripple" />
      )}
      
      {/* Marker */}
      <div className={cn(
        'rounded-full border-2 transition-all duration-300',
        size,
        markerStyles[district.riskLevel],
        glowStyles[district.riskLevel],
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-150'
      )} />

      {/* Tooltip */}
      <div className={cn(
        'absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10',
        'bg-card/95 backdrop-blur border border-border rounded-lg shadow-lg p-3 min-w-[180px]'
      )}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-semibold text-foreground text-sm">{district.name}</span>
          <span className={cn(
            'text-xs px-1.5 py-0.5 rounded-full font-medium',
            district.riskLevel === 'danger' && 'bg-destructive text-destructive-foreground',
            district.riskLevel === 'warning' && 'bg-warning text-warning-foreground',
            district.riskLevel === 'watch' && 'bg-watch text-watch-foreground',
            district.riskLevel === 'safe' && 'bg-success text-success-foreground',
          )}>
            {district.riskLevel.toUpperCase()}
          </span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Rain 24h:</span>
            <span className="font-mono">{district.rainfall24h}mm</span>
          </div>
          <div className="flex justify-between">
            <span>River Level:</span>
            <span className="font-mono">{district.riverLevel}%</span>
          </div>
        </div>
        {/* Arrow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-border" />
      </div>
    </div>
  );
}

export function InteractiveMap() {
  const [zoom, setZoom] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [showLayers, setShowLayers] = useState(false);

  // Generate pseudo-random positions for districts based on their id
  const getPosition = (id: string, index: number) => {
    const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const x = 15 + (Math.abs(hash) % 70);
    const y = 15 + ((index * 17 + Math.abs(hash >> 4)) % 65);
    return { x, y };
  };

  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden">
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">District Risk Map</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button 
            variant={showLayers ? "secondary" : "ghost"} 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setShowLayers(!showLayers)}
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[400px] overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border"/>
              </pattern>
              <pattern id="mapGridSmall" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.25" className="text-border"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGridSmall)" />
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
          </svg>
        </div>

        {/* Terrain Features (decorative) */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          {/* Rivers */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <path 
              d="M 0 200 Q 100 180 200 220 T 400 180 T 600 240 T 800 200" 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="3"
              strokeDasharray="0"
              className="animate-[dash_20s_linear_infinite]"
            />
            <path 
              d="M 100 350 Q 200 320 300 380 T 500 340" 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2"
              opacity="0.6"
            />
          </svg>

          {/* Region Labels */}
          <div className="absolute top-8 left-8 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
            North Region
          </div>
          <div className="absolute bottom-20 right-8 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
            South Region
          </div>
          <div className="absolute top-1/2 left-4 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider -rotate-90">
            West
          </div>
        </div>

        {/* District Markers */}
        <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          {mockDistricts.map((district, index) => {
            const pos = getPosition(district.id, index);
            return (
              <MapMarker
                key={district.id}
                district={district}
                x={pos.x}
                y={pos.y}
                isSelected={selectedDistrict === district.id}
                onClick={() => setSelectedDistrict(selectedDistrict === district.id ? null : district.id)}
              />
            );
          })}
        </div>

        {/* Compass */}
        <div className="absolute top-4 right-4 bg-card/80 backdrop-blur rounded-full p-2 border border-border">
          <Navigation className="h-5 w-5 text-primary" />
        </div>

        {/* Scale */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-card/80 backdrop-blur rounded-lg px-3 py-1.5 border border-border">
          <div className="w-12 h-0.5 bg-foreground rounded" />
          <span className="text-xs text-muted-foreground">10 km</span>
        </div>
      </div>

      {/* Layer Panel */}
      {showLayers && (
        <div className="absolute top-16 right-4 bg-card border border-border rounded-lg shadow-lg p-3 animate-scale-in z-20">
          <p className="text-xs font-semibold text-foreground mb-2">Map Layers</p>
          <div className="space-y-2">
            {['Flood Zones', 'River Networks', 'Population Density', 'Evacuation Routes'].map((layer, i) => (
              <label key={layer} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  defaultChecked={i < 2}
                  className="rounded border-border"
                />
                <span className="text-xs text-muted-foreground">{layer}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Legend */}
      <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
        <div className="flex items-center gap-4">
          {[
            { level: 'safe', label: 'Safe' },
            { level: 'watch', label: 'Watch' },
            { level: 'warning', label: 'Warning' },
            { level: 'danger', label: 'Danger' },
          ].map(({ level, label }) => (
            <div key={level} className="flex items-center gap-1.5">
              <div className={cn(
                'w-3 h-3 rounded-full border-2',
                level === 'safe' && 'bg-success border-success',
                level === 'watch' && 'bg-watch border-watch',
                level === 'warning' && 'bg-warning border-warning',
                level === 'danger' && 'bg-destructive border-destructive',
              )} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Live updates
        </div>
      </div>
    </div>
  );
}
