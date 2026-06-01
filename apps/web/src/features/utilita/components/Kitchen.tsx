import { useState } from 'react';

import { INGREDIENT_DENSITY, SERVING_GRAMS } from '../../../lib/calc/data.ts';
import {
  bakersPercentage,
  celsiusToGasMark,
  convertYeast,
  ovenConvert,
  panScaleFactor,
  recipeScaleFactor,
  servingAmount,
  volumeToWeight,
  weightToVolume,
} from '../../../lib/calc/kitchen.ts';
import { NumberField, nf, Result, SelectField, ToolBody, toNum } from './kit.tsx';

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
    <ToolBody>
      <SelectField label="Ingrediente" value={ing} onChange={setIng} options={INGREDIENTS} />
      <SelectField label="Conversione" value={dir} onChange={setDir} options={VP_DIR} />
      <NumberField label={dir === 'v2w' ? 'Millilitri' : 'Grammi'} value={val} onChange={setVal} />
      <Result value={out} muted={out === '—'} />
    </ToolBody>
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
    <ToolBody>
      <SelectField label="Conversione" value={dir} onChange={setDir} options={OVEN_DIR} />
      <NumberField label="Temperatura (°C)" value={val} onChange={setVal} />
      <Result label="Convertita" value={out} muted={out === '—'} />
      <Result label="Equivale a" value={gas} muted={gas === '—'} />
    </ToolBody>
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
    <ToolBody>
      <SelectField label="Conversione" value={dir} onChange={setDir} options={YEAST_DIR} />
      <NumberField label="Grammi di partenza" value={val} onChange={setVal} />
      <Result value={out} muted={out === '—'} />
    </ToolBody>
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
    <ToolBody>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Da (porzioni)" value={from} onChange={setFrom} />
        <NumberField label="A (porzioni)" value={to} onChange={setTo} />
      </div>
      <NumberField label="Quantità ingrediente (facolt.)" value={qty} onChange={setQty} />
      <Result label="Fattore" value={factor} muted={factor === '—'} />
      {scaled !== '—' && <Result label="Quantità adattata" value={scaled} />}
    </ToolBody>
  );
}

const FOODS = Object.entries(SERVING_GRAMS).map(([value, s]) => ({ value, label: s.label }));

export function PerPersona() {
  const [food, setFood] = useState('pasta');
  const [people, setPeople] = useState('4');
  const n = toNum(people);
  const out = Number.isNaN(n) ? '—' : `${nf.format(servingAmount(food, n))} g`;
  return (
    <ToolBody>
      <SelectField label="Alimento" value={food} onChange={setFood} options={FOODS} />
      <NumberField label="Persone" value={people} onChange={setPeople} />
      <Result label="Totale" value={out} muted={out === '—'} />
    </ToolBody>
  );
}

export function AdattaStampo() {
  const [from, setFrom] = useState('20');
  const [to, setTo] = useState('24');
  const [qty, setQty] = useState('');
  const [nf2, nt, nq] = [toNum(from), toNum(to), toNum(qty)];
  let factor = '—';
  let scaled = '—';
  try {
    if (!Number.isNaN(nf2) && !Number.isNaN(nt)) {
      const f = panScaleFactor({ shape: 'round', diameter: nf2 }, { shape: 'round', diameter: nt });
      factor = `× ${nf.format(f)}`;
      if (!Number.isNaN(nq)) scaled = nf.format(nq * f);
    }
  } catch {
    /* diametro 0 → — */
  }
  return (
    <ToolBody>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Da Ø (cm)" value={from} onChange={setFrom} />
        <NumberField label="A Ø (cm)" value={to} onChange={setTo} />
      </div>
      <NumberField label="Quantità ingrediente (facolt.)" value={qty} onChange={setQty} />
      <Result label="Fattore" value={factor} muted={factor === '—'} />
      {scaled !== '—' && <Result label="Quantità adattata" value={scaled} />}
    </ToolBody>
  );
}

export function Impasto() {
  const [flour, setFlour] = useState('500');
  const [hyd, setHyd] = useState('65');
  const [salt, setSalt] = useState('2');
  const [yeast, setYeast] = useState('1');
  const vals = [flour, hyd, salt, yeast].map(toNum);
  let r: ReturnType<typeof bakersPercentage> | null = null;
  if (!vals.some(Number.isNaN)) {
    const [f, h, s, y] = vals as [number, number, number, number];
    r = bakersPercentage(f, { hydration: h, salt: s, yeast: y });
  }
  return (
    <ToolBody>
      <NumberField label="Farina (g)" value={flour} onChange={setFlour} />
      <div className="grid grid-cols-3 gap-2">
        <NumberField label="Acqua %" value={hyd} onChange={setHyd} />
        <NumberField label="Sale %" value={salt} onChange={setSalt} />
        <NumberField label="Lievito %" value={yeast} onChange={setYeast} />
      </div>
      <Result label="Acqua" value={r ? `${nf.format(r.water)} g` : '—'} muted={!r} />
      <Result
        label="Sale / lievito"
        value={r ? `${nf.format(r.salt)} g / ${nf.format(r.yeast)} g` : '—'}
        muted={!r}
      />
    </ToolBody>
  );
}
