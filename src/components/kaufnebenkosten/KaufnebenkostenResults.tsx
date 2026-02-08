import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Scale, BookOpen, Users, Receipt, TrendingUp, MapPin } from 'lucide-react';
import type { KaufnebenkostenResults } from '@/types/kaufnebenkosten';
import { BUNDESLAENDER } from '@/types/kaufnebenkosten';
import heroGradient from '@/assets/hero-gradient.png';

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
    <div className="space-y-3">
      {/* Primary Hero Result */}
      <Card className="relative overflow-hidden border-0">
        <img
          src={heroGradient}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <CardContent className="relative z-10 pt-6">
          <div className="text-center">
            <p className="text-sm text-white/80 mb-1">Kaufnebenkosten gesamt</p>
            <p className="text-4xl font-bold font-mono text-white">
              {formatCurrency(results.nebenkostenGesamt)}
            </p>
            <p className="text-sm text-white/70 mt-2">
              {formatPercent(results.nebenkostenProzent)} vom Kaufpreis
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Grid */}
      <div className="grid grid-cols-2 gap-2">
        {costItems.filter(item => !item.hidden).map((item) => (
          <Card key={item.label} className="overflow-hidden border border-border/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${item.bgColor}`}>
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                </div>
                <span className="text-xs text-muted-foreground truncate">{item.label}</span>
              </div>
              <p className="font-mono font-bold text-xl mt-2">{formatCurrency(item.value)}</p>
              <p className="text-xs text-muted-foreground">{formatPercent(item.percent)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Breakdown */}
      <Card className="border border-border/50">
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
