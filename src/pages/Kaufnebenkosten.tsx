import { useState } from 'react';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { KaufnebenkostenInputsSection } from '@/components/kaufnebenkosten/KaufnebenkostenInputs';
import { KaufnebenkostenResultsSection } from '@/components/kaufnebenkosten/KaufnebenkostenResults';
import { CrossSellRendite } from '@/components/kaufnebenkosten/CrossSellRendite';
import { Button } from '@/components/ui/button';
import { RotateCcw, Calculator } from 'lucide-react';
import { useKaufnebenkosten, getDefaultKaufnebenkostenInputs } from '@/hooks/useKaufnebenkosten';
import type { KaufnebenkostenInputs } from '@/types/kaufnebenkosten';
import heroGradient from '@/assets/hero-gradient.png';

const Kaufnebenkosten = () => {
  const [inputs, setInputs] = useState<KaufnebenkostenInputs>(getDefaultKaufnebenkostenInputs());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const results = useKaufnebenkosten(inputs);

  const handleReset = () => {
    setInputs(getDefaultKaufnebenkostenInputs());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={() => setShowAuthModal(true)} />

      {/* Hero Section */}
      <div className="relative text-white py-8 px-4 overflow-hidden">
        <img src={heroGradient} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="container relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Kaufnebenkosten-Rechner</h1>
          </div>
          <p className="text-white/80 text-lg">
            Berechne alle Nebenkosten beim Immobilienkauf – inkl. Grunderwerbsteuer, Notar & Makler
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-4">
            <KaufnebenkostenInputsSection inputs={inputs} onChange={setInputs} />
            
            <Button variant="outline" onClick={handleReset} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ergebnisse</h2>
              <KaufnebenkostenResultsSection results={results} />
            </div>
            
            {/* Cross-Sell Banner */}
            <CrossSellRendite />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Kaufnebenkosten</div>
            <div className="font-mono text-xl font-bold text-primary">
              {formatCurrency(results.nebenkostenGesamt)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Gesamtkosten</div>
            <div className="font-mono text-lg font-semibold">
              {formatCurrency(results.gesamtkosten)}
            </div>
          </div>
        </div>
      </div>

      {/* Add padding for mobile sticky footer */}
      <div className="lg:hidden h-20" />

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Kaufnebenkosten;
