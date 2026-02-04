import { AlertTriangle, X } from 'lucide-react';
import { Alert } from '@/types/flood';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  
  const criticalAlerts = alerts.filter(a => a.isActive && a.level === 'danger');
  
  if (dismissed || criticalAlerts.length === 0) return null;

  const primaryAlert = criticalAlerts[0];
  const additionalCount = criticalAlerts.length - 1;

  return (
    <div className={cn(
      "gradient-danger text-destructive-foreground animate-slide-down",
      "px-4 py-3 shadow-lg"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 animate-pulse-alert">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {primaryAlert.districtName}: {primaryAlert.message}
            </p>
            {additionalCount > 0 && (
              <p className="text-sm opacity-90">
                +{additionalCount} more critical alert{additionalCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 rounded-full p-1 hover:bg-destructive-foreground/20 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
