import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { Alert, RiskLevel } from '@/types/flood';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  
  // Filter all active alerts that are not 'safe'
  const activeAlerts = alerts.filter(a => a.isActive && a.level !== 'safe');
  
  if (dismissed || activeAlerts.length === 0) return null;

  // Priority: danger > warning > watch
  const priorityMap: Record<RiskLevel, number> = {
    danger: 3,
    warning: 2,
    watch: 1,
    safe: 0
  };

  const sortedAlerts = [...activeAlerts].sort((a, b) => priorityMap[b.level] - priorityMap[a.level]);
  const primaryAlert = sortedAlerts[0];
  const additionalCount = activeAlerts.length - 1;

  // Determine styling based on highest priority alert
  const getBannerStyle = (level: RiskLevel) => {
    switch (level) {
      case 'danger':
        return "gradient-danger text-destructive-foreground";
      case 'warning':
        return "gradient-warning text-warning-foreground";
      default: // watch
        return "bg-yellow-100 text-yellow-900 border-yellow-200";
    }
  };

  const getIcon = (level: RiskLevel) => {
      switch (level) {
        case 'danger': return <AlertTriangle className="h-6 w-6" />;
        case 'warning': return <AlertCircle className="h-6 w-6" />;
        default: return <Info className="h-6 w-6" />;
      }
  };

  return (
    <div className={cn(
      getBannerStyle(primaryAlert.level),
      "animate-slide-down px-4 py-3 shadow-lg transition-colors duration-300"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 animate-pulse-alert">
            {getIcon(primaryAlert.level)}
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {primaryAlert.districtName}: {primaryAlert.message}
            </p>
            {additionalCount > 0 && (
              <p className="text-sm opacity-90">
                +{additionalCount} more alert{additionalCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
