import { useMemo } from 'react';
import type { KaufnebenkostenInputs, KaufnebenkostenResults } from '@/types/kaufnebenkosten';
import { GRUNDERWERBSTEUER } from '@/types/kaufnebenkosten';

const round = (value: number, decimals: number = 2): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const getDefaultKaufnebenkostenInputs = (): KaufnebenkostenInputs => ({
  kaufpreis: 350000,
  bundesland: 'bayern',
  mitMakler: true,
  maklerProzent: 3.57,
});

export const useKaufnebenkosten = (inputs: KaufnebenkostenInputs): KaufnebenkostenResults => {
  return useMemo(() => {
    const { kaufpreis, bundesland, mitMakler, maklerProzent } = inputs;

    const grestProzent = GRUNDERWERBSTEUER[bundesland] || 5.0;
    const grunderwerbsteuer = kaufpreis * (grestProzent / 100);

    const notarProzent = 1.5;
    const notarkosten = kaufpreis * (notarProzent / 100);

    const grundbuchProzent = 0.5;
    const grundbuchkosten = kaufpreis * (grundbuchProzent / 100);

    const maklerkosten = mitMakler ? kaufpreis * (maklerProzent / 100) : 0;

    const nebenkostenOhneMakler = grunderwerbsteuer + notarkosten + grundbuchkosten;
    const nebenkostenGesamt = nebenkostenOhneMakler + maklerkosten;
    const nebenkostenProzent = (nebenkostenGesamt / kaufpreis) * 100;
    const gesamtkosten = kaufpreis + nebenkostenGesamt;

    return {
      kaufpreis,
      bundesland,
      grunderwerbsteuer: round(grunderwerbsteuer),
      grestProzent,
      notarkosten: round(notarkosten),
      notarProzent,
      grundbuchkosten: round(grundbuchkosten),
      grundbuchProzent,
      maklerkosten: round(maklerkosten),
      maklerProzent: mitMakler ? maklerProzent : 0,
      nebenkostenOhneMakler: round(nebenkostenOhneMakler),
      nebenkostenGesamt: round(nebenkostenGesamt),
      nebenkostenProzent: round(nebenkostenProzent, 1),
      gesamtkosten: round(gesamtkosten),
    };
  }, [inputs]);
};
