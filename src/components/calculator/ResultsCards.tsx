import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, Clock, PiggyBank, Euro } from 'lucide-react';
import type { CalculatorResults, YieldRating } from '@/types/calculator';
import { getYieldRating, getYieldLabel, formatCurrency, formatNumber } from '@/hooks/useCalculator';
import heroGradient from '@/assets/hero-gradient.png';

interface ResultsCardsProps {
  results: CalculatorResults;
}

const getYieldColorClass = (rating: YieldRating): string => {
  const classes: Record<YieldRating, string> = {
    excellent: 'bg-[hsl(var(--yield-excellent))] text-white',
    good: 'bg-[hsl(var(--yield-good))] text-white',
    ok: 'bg-[hsl(var(--yield-ok))] text-black',
    weak: 'bg-[hsl(var(--yield-weak))] text-black',
    bad: 'bg-[hsl(var(--yield-bad))] text-white',
  };
  return classes[rating];
};

export const ResultsCards = ({ results }: ResultsCardsProps) => {
  const bruttoRating = getYieldRating(results.bruttoMietrendite);
  const nettoRating = getYieldRating(results.nettoMietrendite);
  const ekRating = getYieldRating(results.eigenkapitalRendite);

  return (
    <div className="space-y-3">
      {/* Primary Hero Card - Cashflow */}
      <Card className="relative overflow-hidden border-0">
        <img
          src={heroGradient}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <CardContent className="relative z-10 p-5">
          <div className="flex items-center gap-2 mb-1">
            {results.monatlicheCashflow >= 0 ? (
              <TrendingUp className="h-4 w-4 text-white/80" />
            ) : (
              <TrendingDown className="h-4 w-4 text-white/80" />
            )}
            <span className="text-sm font-medium text-white/80">Monatlicher Cashflow</span>
          </div>
          <div className="font-mono text-4xl font-bold text-white">
            {formatCurrency(results.monatlicheCashflow)}
          </div>
          <div className="text-sm text-white/70 mt-1">
            {results.monatlicheCashflow >= 0 ? 'Positiver Cashflow' : 'Negativer Cashflow – Zuschuss nötig'}
          </div>
        </CardContent>
      </Card>

      {/* Yield Rating Cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card className={`${getYieldColorClass(bruttoRating)} border-0`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Percent className="h-3.5 w-3.5 opacity-80" />
              <span className="text-xs font-medium opacity-80">Brutto</span>
            </div>
            <div className="font-mono text-xl font-bold">
              {formatNumber(results.bruttoMietrendite)}%
            </div>
            <div className="text-xs mt-0.5 opacity-80">{getYieldLabel(bruttoRating)}</div>
          </CardContent>
        </Card>

        <Card className={`${getYieldColorClass(nettoRating)} border-0`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Percent className="h-3.5 w-3.5 opacity-80" />
              <span className="text-xs font-medium opacity-80">Netto</span>
            </div>
            <div className="font-mono text-xl font-bold">
              {formatNumber(results.nettoMietrendite)}%
            </div>
            <div className="text-xs mt-0.5 opacity-80">{getYieldLabel(nettoRating)}</div>
          </CardContent>
        </Card>

        <Card className={`${getYieldColorClass(ekRating)} border-0`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 opacity-80" />
              <span className="text-xs font-medium opacity-80">EK-Rendite</span>
            </div>
            <div className="font-mono text-xl font-bold">
              {formatNumber(results.eigenkapitalRendite)}%
            </div>
            <div className="text-xs mt-0.5 opacity-80">{getYieldLabel(ekRating)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metric Cards - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="border border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Kaufpreis-Faktor</span>
            </div>
            <div className="font-mono text-xl font-bold mt-2 text-foreground">
              {formatNumber(results.kaufpreisFaktor, 1)}x
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <PiggyBank className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Gesamtinvestition</span>
            </div>
            <div className="font-mono text-xl font-bold mt-2 text-foreground">
              {formatCurrency(results.gesamtinvestition)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Euro className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Monatl. Rate</span>
            </div>
            <div className="font-mono text-xl font-bold mt-2 text-foreground">
              {formatCurrency(results.monatlicheRate)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Euro className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Kaufnebenkosten</span>
            </div>
            <div className="font-mono text-xl font-bold mt-2 text-foreground">
              {formatCurrency(results.kaufnebenkostenGesamt)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
