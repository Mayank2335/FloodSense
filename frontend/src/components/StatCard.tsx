import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = 'default',
  trend,
  trendValue
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border hover:border-primary/50',
    danger: 'bg-destructive/5 border-destructive/30 hover:border-destructive/50',
    warning: 'bg-warning/5 border-warning/30 hover:border-warning/50',
    success: 'bg-success/5 border-success/30 hover:border-success/50',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    danger: 'bg-destructive/20 text-destructive',
    warning: 'bg-warning/20 text-warning',
    success: 'bg-success/20 text-success',
  };

  const glowStyles = {
    default: '',
    danger: 'hover:shadow-glow-danger',
    warning: 'hover:shadow-glow-warning',
    success: '',
  };

  return (
    <div className={cn(
      'group relative rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up overflow-hidden',
      variantStyles[variant],
      glowStyles[variant]
    )}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id={`stat-pattern-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#stat-pattern-${variant})`} />
        </svg>
      </div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold tracking-tight text-foreground font-mono tabular-nums">{value}</p>
            {trend && trendValue && (
              <span className={cn(
                'flex items-center gap-0.5 text-xs font-medium',
                trend === 'up' && 'text-destructive',
                trend === 'down' && 'text-success',
                trend === 'neutral' && 'text-muted-foreground'
              )}>
                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                {trendValue}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          'rounded-xl p-3 transition-transform duration-300 group-hover:scale-110',
          iconStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Animated Bottom Border */}
      <div className={cn(
        'absolute bottom-0 left-0 h-1 transition-all duration-500 group-hover:w-full',
        variant === 'default' && 'bg-primary w-0',
        variant === 'danger' && 'bg-destructive w-1/3',
        variant === 'warning' && 'bg-warning w-1/4',
        variant === 'success' && 'bg-success w-0',
      )} />
    </div>
  );
}
