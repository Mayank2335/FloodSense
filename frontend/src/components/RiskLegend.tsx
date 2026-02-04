import { Badge } from '@/components/ui/badge';
import { RISK_LABELS, RISK_DESCRIPTIONS, RiskLevel } from '@/types/flood';

const riskLevels: RiskLevel[] = ['safe', 'watch', 'warning', 'danger'];

export function RiskLegend() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold text-foreground mb-4">Risk Level Guide</h3>
      <div className="space-y-3">
        {riskLevels.map(level => (
          <div key={level} className="flex items-start gap-3">
            <Badge variant={level} className="mt-0.5 shrink-0">
              {RISK_LABELS[level]}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {RISK_DESCRIPTIONS[level]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
