import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Scale, BookOpen, Users, Receipt, TrendingUp } from 'lucide-react';
import type { KaufnebenkostenResults } from '@/types/kaufnebenkosten';
import { BUNDESLAENDER } from '@/types/kaufnebenkosten';

interface Props {
  results: KaufnebenkostenResults;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const KaufnebenkostenResultsSection = ({ results }: Props) => {
  const bundeslandLabel = BUNDESLAENDER.find(b => b.value === results.bundesland)?.label || results.bundesland;

  const costItems = [
    {
      icon: Building2,
      label: 'Grunderwerbsteuer',
      value: results.grunderwerbsteuer,
      percent: results.grestProzent,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Scale,
      label: 'Notarkosten',
      value: results.notarkosten,
      percent: results.notarProzent,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: BookOpen,
      label: 'Grundbuchkosten',
      value: results.grundbuchkosten,
      percent: results.grundbuchProzent,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Users,
      label: 'Maklerkosten',
      value: results.maklerkosten,
      percent: results.maklerProzent,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      hidden: results.maklerProzent === 0,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Primary Result */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Kaufnebenkosten gesamt</p>
            <p className="text-4xl font-bold font-mono gradient-text">
              {formatCurrency(results.nebenkostenGesamt)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {formatPercent(results.nebenkostenProzent)} vom Kaufpreis
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Grid */}
      <div className="grid grid-cols-2 gap-3">
        {costItems.filter(item => !item.hidden).map((item) => (
          <Card key={item.label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{item.label}</p>
                  <p className="font-mono font-semibold text-sm">{formatCurrency(item.value)}</p>
                  <p className="text-xs text-muted-foreground">{formatPercent(item.percent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="h-4 w-4 text-primary" />
            Gesamtübersicht
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">Kaufpreis</span>
            <span className="font-mono font-medium">{formatCurrency(results.kaufpreis)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-muted-foreground">+ Nebenkosten</span>
            <span className="font-mono font-medium text-primary">{formatCurrency(results.nebenkostenGesamt)}</span>
          </div>
          <div className="flex justify-between items-center py-2 bg-muted/50 -mx-6 px-6 rounded-b-lg">
            <span className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Gesamtkosten
            </span>
            <span className="font-mono font-bold text-lg">{formatCurrency(results.gesamtkosten)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Info Badge */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          <MapPin className="h-3 w-3" />
          Standort: {bundeslandLabel}
        </span>
      </div>
    </div>
  );
};

// Small MapPin import for the badge
import { MapPin } from 'lucide-react';
