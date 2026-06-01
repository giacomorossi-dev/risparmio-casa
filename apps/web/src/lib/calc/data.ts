// Tabelle dati statiche per i calcolatori. Valori indicativi ma realistici;
// inline (come data/categories.ts di quale-conviene) per restare 100% client-side.

/** Densità ingredienti in g/ml (per volume↔peso). Valori medi da cucina. */
export const INGREDIENT_DENSITY: Record<string, { label: string; gPerMl: number }> = {
  acqua: { label: 'Acqua', gPerMl: 1.0 },
  latte: { label: 'Latte', gPerMl: 1.03 },
  olio: { label: 'Olio', gPerMl: 0.92 },
  farina: { label: 'Farina 00', gPerMl: 0.53 },
  zucchero: { label: 'Zucchero semolato', gPerMl: 0.85 },
  'zucchero-velo': { label: 'Zucchero a velo', gPerMl: 0.56 },
  sale: { label: 'Sale fino', gPerMl: 1.2 },
  riso: { label: 'Riso', gPerMl: 0.85 },
  burro: { label: 'Burro fuso', gPerMl: 0.96 },
  miele: { label: 'Miele', gPerMl: 1.42 },
  cacao: { label: 'Cacao in polvere', gPerMl: 0.52 },
  panna: { label: 'Panna', gPerMl: 1.0 },
};

/** Gas mark del forno → °C (tabella standard). */
export const GAS_MARK_TO_CELSIUS: Record<number, number> = {
  1: 140,
  2: 150,
  3: 170,
  4: 180,
  5: 190,
  6: 200,
  7: 220,
  8: 230,
  9: 240,
};

/** Grammatura consigliata per persona (in grammi), per "quanto cucinare". */
export const SERVING_GRAMS: Record<string, { label: string; grams: number }> = {
  pasta: { label: 'Pasta', grams: 80 },
  riso: { label: 'Riso', grams: 70 },
  carne: { label: 'Carne', grams: 150 },
  pesce: { label: 'Pesce', grams: 200 },
  contorno: { label: 'Verdura/contorno', grams: 200 },
  pane: { label: 'Pane', grams: 50 },
  legumi_secchi: { label: 'Legumi secchi', grams: 60 },
  formaggio: { label: 'Formaggio', grams: 50 },
  patate: { label: 'Patate', grams: 250 },
};

/** Fattore di conversione gas naturale m³ → kWh (PCS medio, configurabile). */
export const GAS_M3_TO_KWH = 10.69;

/** Volumi standard delle "misure da cucina" in ml. */
export const KITCHEN_VOLUMES_ML = {
  cucchiaino: 5,
  cucchiaio: 15,
  bicchiere: 200,
  tazza: 250,
  cup: 240,
} as const;
