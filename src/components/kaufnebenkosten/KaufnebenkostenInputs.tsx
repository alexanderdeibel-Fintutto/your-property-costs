import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Euro, MapPin, Users, Percent } from 'lucide-react';
import type { KaufnebenkostenInputs } from '@/types/kaufnebenkosten';
import { BUNDESLAENDER } from '@/types/kaufnebenkosten';

interface Props {
  inputs: KaufnebenkostenInputs;
  onChange: (inputs: KaufnebenkostenInputs) => void;
}

export const KaufnebenkostenInputsSection = ({ inputs, onChange }: Props) => {
  const handleChange = (field: keyof KaufnebenkostenInputs, value: number | string | boolean) => {
    onChange({ ...inputs, [field]: value });
  };

  const selectedBundesland = BUNDESLAENDER.find(b => b.value === inputs.bundesland);

  return (
    <div className="space-y-4">
      {/* Kaufpreis & Standort */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Euro className="h-5 w-5 text-primary" />
            Kaufpreis & Standort
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kaufpreis">Kaufpreis</Label>
            <div className="relative">
              <Input
                id="kaufpreis"
                type="number"
                value={inputs.kaufpreis}
                onChange={(e) => handleChange('kaufpreis', Number(e.target.value))}
                className="pr-8 font-mono"
                min={0}
                step={10000}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
            </div>
            <p className="text-xs text-muted-foreground">Gesamtkaufpreis der Immobilie</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bundesland" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Bundesland
            </Label>
            <Select
              value={inputs.bundesland}
              onValueChange={(value) => handleChange('bundesland', value)}
            >
              <SelectTrigger id="bundesland">
                <SelectValue placeholder="Bundesland wählen" />
              </SelectTrigger>
              <SelectContent>
                {BUNDESLAENDER.map((bl) => (
                  <SelectItem key={bl.value} value={bl.value}>
                    {bl.label} ({bl.steuer}% GrESt)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBundesland && (
              <p className="text-xs text-muted-foreground">
                Grunderwerbsteuer in {selectedBundesland.label}: {selectedBundesland.steuer}%
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Makler */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Makler (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mit-makler">Kauf mit Makler?</Label>
              <p className="text-xs text-muted-foreground">Maklerprovision einbeziehen</p>
            </div>
            <Switch
              id="mit-makler"
              checked={inputs.mitMakler}
              onCheckedChange={(checked) => handleChange('mitMakler', checked)}
            />
          </div>

          {inputs.mitMakler && (
            <div className="space-y-2">
              <Label htmlFor="makler-prozent" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Maklerprovision (Käuferanteil)
              </Label>
              <div className="relative">
                <Input
                  id="makler-prozent"
                  type="number"
                  value={inputs.maklerProzent}
                  onChange={(e) => handleChange('maklerProzent', Number(e.target.value))}
                  className="pr-8 font-mono"
                  min={0}
                  max={10}
                  step={0.01}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">Üblich: 3,57% (inkl. MwSt.)</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
