export interface KaufnebenkostenInputs {
  kaufpreis: number;
  bundesland: string;
  mitMakler: boolean;
  maklerProzent: number;
}

export interface KaufnebenkostenResults {
  kaufpreis: number;
  bundesland: string;
  grunderwerbsteuer: number;
  grestProzent: number;
  notarkosten: number;
  notarProzent: number;
  grundbuchkosten: number;
  grundbuchProzent: number;
  maklerkosten: number;
  maklerProzent: number;
  nebenkostenOhneMakler: number;
  nebenkostenGesamt: number;
  nebenkostenProzent: number;
  gesamtkosten: number;
}

export const BUNDESLAENDER = [
  { value: 'baden-wuerttemberg', label: 'Baden-Württemberg', steuer: 5.0 },
  { value: 'bayern', label: 'Bayern', steuer: 3.5 },
  { value: 'berlin', label: 'Berlin', steuer: 6.0 },
  { value: 'brandenburg', label: 'Brandenburg', steuer: 6.5 },
  { value: 'bremen', label: 'Bremen', steuer: 5.0 },
  { value: 'hamburg', label: 'Hamburg', steuer: 5.5 },
  { value: 'hessen', label: 'Hessen', steuer: 6.0 },
  { value: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern', steuer: 6.0 },
  { value: 'niedersachsen', label: 'Niedersachsen', steuer: 5.0 },
  { value: 'nordrhein-westfalen', label: 'Nordrhein-Westfalen', steuer: 6.5 },
  { value: 'rheinland-pfalz', label: 'Rheinland-Pfalz', steuer: 5.0 },
  { value: 'saarland', label: 'Saarland', steuer: 6.5 },
  { value: 'sachsen', label: 'Sachsen', steuer: 5.5 },
  { value: 'sachsen-anhalt', label: 'Sachsen-Anhalt', steuer: 5.0 },
  { value: 'schleswig-holstein', label: 'Schleswig-Holstein', steuer: 6.5 },
  { value: 'thueringen', label: 'Thüringen', steuer: 5.0 },
] as const;

export const GRUNDERWERBSTEUER: Record<string, number> = {
  'baden-wuerttemberg': 5.0,
  'bayern': 3.5,
  'berlin': 6.0,
  'brandenburg': 6.5,
  'bremen': 5.0,
  'hamburg': 5.5,
  'hessen': 6.0,
  'mecklenburg-vorpommern': 6.0,
  'niedersachsen': 5.0,
  'nordrhein-westfalen': 6.5,
  'rheinland-pfalz': 5.0,
  'saarland': 6.5,
  'sachsen': 5.5,
  'sachsen-anhalt': 5.0,
  'schleswig-holstein': 6.5,
  'thueringen': 5.0,
};
