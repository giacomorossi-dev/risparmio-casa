// Calcolatori per la casa / fai-da-te — funzioni pure, granulari.

/** Area di una parete rettangolare. */
export function rectArea(width: number, height: number): number {
  return width * height;
}

/** Volume di una stanza. */
export function roomVolume(width: number, length: number, height: number): number {
  return width * length * height;
}

/**
 * Litri di vernice per dipingere `wallArea` m² con `coats` mani.
 * `coveragePerLiter` = m² coperti da 1 litro per mano (default 10).
 * `deductions` = m² da togliere (porte/finestre).
 */
export function paintLiters({
  wallArea,
  coats = 2,
  coveragePerLiter = 10,
  deductions = 0,
}: {
  wallArea: number;
  coats?: number;
  coveragePerLiter?: number;
  deductions?: number;
}): number {
  const net = Math.max(0, wallArea - deductions);
  if (coveragePerLiter <= 0) throw new RangeError('coveragePerLiter deve essere > 0');
  return (net * coats) / coveragePerLiter;
}

/**
 * Piastrelle/parquet necessari per coprire `area` m².
 * `tileArea` = m² di una piastrella; `wastePercent` = sfrido (default 10%).
 * `perBox` opzionale → calcola anche le scatole.
 */
export function tilesNeeded({
  area,
  tileArea,
  wastePercent = 10,
  perBox,
}: {
  area: number;
  tileArea: number;
  wastePercent?: number;
  perBox?: number;
}): { areaWithWaste: number; tiles: number; boxes?: number } {
  if (tileArea <= 0) throw new RangeError('tileArea deve essere > 0');
  const areaWithWaste = area * (1 + wastePercent / 100);
  const tiles = Math.ceil(areaWithWaste / tileArea);
  const result: { areaWithWaste: number; tiles: number; boxes?: number } = {
    areaWithWaste,
    tiles,
  };
  if (perBox && perBox > 0) result.boxes = Math.ceil(tiles / perBox);
  return result;
}
