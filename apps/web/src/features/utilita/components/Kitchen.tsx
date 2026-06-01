import { CakeSlice, ChefHat, Flame, Scale, Users } from 'lucide-react';
import { useState } from 'react';
import { INGREDIENT_DENSITY, SERVING_GRAMS } from '../../../lib/calc/data.ts';
import {
  celsiusToGasMark,
  convertYeast,
  ovenConvert,
  recipeScaleFactor,
  servingAmount,
  volumeToWeight,
  weightToVolume,
} from '../../../lib/calc/kitchen.ts';
import { NumberField, nf, Result, SelectField, toNum, UtilityCard } from './kit.tsx';

const INGREDIENTS = Object.entries(INGREDIENT_DENSITY).map(([value, d]) => ({
  value,
  label: d.label,
}));
const VP_DIR = [
  { value: 'v2w', label: 'da ml a grammi' },
  { value: 'w2v', label: 'da grammi a ml' },
];

export function VolumePeso() {
  const [ing, setIng] = useState('farina');
  const [dir, setDir] = useState('v2w');
  const [val, setVal] = useState('');
  const n = toNum(val);
  let out = '—';
  if (!Number.isNaN(n)) {
    out =
      dir === 'v2w'
        ? `${nf.format(volumeToWeight(ing, n))} g`
        : `${nf.format(weightToVolume(ing, n))} ml`;
  }
  return (
    <UtilityCard icon={Scale} title="Volume ↔ peso" hint="Bicchieri/cucchiai → grammi e viceversa">
      <SelectField label="Ingrediente" value={ing} onChange={setIng} options={INGREDIENTS} />
      <SelectField label="Conversione" value={dir} onChange={setDir} options={VP_DIR} />
      <NumberField label={dir === 'v2w' ? 'Millilitri' : 'Grammi'} value={val} onChange={setVal} />
      <Result value={out} muted={out === '—'} />
    </UtilityCard>
  );
}

const OVEN_DIR = [
  { value: 's2f', label: 'da statico a ventilato' },
  { value: 'f2s', label: 'da ventilato a statico' },
];

export function Forno() {
  const [dir, setDir] = useState('s2f');
  const [val, setVal] = useState('180');
  const n = toNum(val);
  const out = Number.isNaN(n)
    ? '—'
    : `${nf.format(dir === 's2f' ? ovenConvert(n, 'static', 'fan') : ovenConvert(n, 'fan', 'static'))} °C`;
  const gas = Number.isNaN(n) ? '—' : `gas mark ${celsiusToGasMark(n)}`;
  return (
    <UtilityCard icon={Flame} title="Forno" hint="Statico ↔ ventilato (≈ −20 °C) + gas mark">
      <SelectField label="Conversione" value={dir} onChange={setDir} options={OVEN_DIR} />
      <NumberField label="Temperatura (°C)" value={val} onChange={setVal} />
      <Result label="Convertita" value={out} muted={out === '—'} />
      <Result label="Equivale a" value={gas} muted={gas === '—'} />
    </UtilityCard>
  );
}

const YEAST_DIR = [
  { value: 'f2d', label: 'da fresco a secco' },
  { value: 'd2f', label: 'da secco a fresco' },
];

export function Lievito() {
  const [dir, setDir] = useState('f2d');
  const [val, setVal] = useState('');
  const n = toNum(val);
  const out = Number.isNaN(n)
    ? '—'
    : `${nf.format(dir === 'f2d' ? convertYeast(n, 'fresh', 'dry') : convertYeast(n, 'dry', 'fresh'))} g`;
  return (
    <UtilityCard icon={ChefHat} title="Lievito" hint="Birra fresco ↔ secco (fattore 3)">
      <SelectField label="Conversione" value={dir} onChange={setDir} options={YEAST_DIR} />
      <NumberField label="Grammi di partenza" value={val} onChange={setVal} />
      <Result value={out} muted={out === '—'} />
    </UtilityCard>
  );
}

export function RiscalaRicetta() {
  const [from, setFrom] = useState('4');
  const [to, setTo] = useState('6');
  const [qty, setQty] = useState('');
  const nf2 = toNum(from);
  const nt = toNum(to);
  const nq = toNum(qty);
  let factor = '—';
  let scaled = '—';
  try {
    if (!Number.isNaN(nf2) && !Number.isNaN(nt)) {
      const f = recipeScaleFactor(nf2, nt);
      factor = `× ${nf.format(f)}`;
      if (!Number.isNaN(nq)) scaled = nf.format(nq * f);
    }
  } catch {
    /* porzioni = 0 → — */
  }
  return (
    <UtilityCard icon={Users} title="Riscala ricetta" hint="Adatta le dosi al numero di porzioni">
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Da (porzioni)" value={from} onChange={setFrom} />
        <NumberField label="A (porzioni)" value={to} onChange={setTo} />
      </div>
      <NumberField label="Quantità ingrediente (facolt.)" value={qty} onChange={setQty} />
      <Result label="Fattore" value={factor} muted={factor === '—'} />
      {scaled !== '—' && <Result label="Quantità adattata" value={scaled} />}
    </UtilityCard>
  );
}

const FOODS = Object.entries(SERVING_GRAMS).map(([value, s]) => ({ value, label: s.label }));

export function PerPersona() {
  const [food, setFood] = useState('pasta');
  const [people, setPeople] = useState('4');
  const n = toNum(people);
  const out = Number.isNaN(n) ? '—' : `${nf.format(servingAmount(food, n))} g`;
  return (
    <UtilityCard icon={CakeSlice} title="Quanto cucinare" hint="Grammi consigliati per N persone">
      <SelectField label="Alimento" value={food} onChange={setFood} options={FOODS} />
      <NumberField label="Persone" value={people} onChange={setPeople} />
      <Result label="Totale" value={out} muted={out === '—'} />
    </UtilityCard>
  );
}
