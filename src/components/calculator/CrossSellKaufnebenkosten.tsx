import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CrossSellKaufnebenkosten = () => {
  return (
    <Card className="border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Kaufnebenkosten berechnen</p>
            <p className="text-xs text-muted-foreground">
              Grunderwerbsteuer, Notar & Makler – alles auf einen Blick
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link to="/kaufnebenkosten">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
