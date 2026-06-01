import { useState } from 'react';

import { percentageOf, percentChange, ruleOfThree, whatPercent } from '../../../lib/calc/math.ts';
import { convert, type UnitCategory, unitsOf } from '../../../lib/calc/units.ts';
import { NumberField, nf, nfPrecise, Result, SelectField, ToolBody, toNum } from './kit.tsx';

const CATS = [
  { value: 'volume', label: 'Volume' },
  { value: 'mass', label: 'Peso' },
  { value: 'length', label: 'Lunghezza' },
  { value: 'temperature', label: 'Temperatura' },
  { value: 'area', label: 'Area' },
  { value: 'energy', label: 'Energia' },
];

export function UnitConverter() {
  const [cat, setCat] = useState('volume');
  const [from, setFrom] = useState('l');
  const [to, setTo] = useState('ml');
  const [val, setVal] = useState('1');
  const opts = unitsOf(cat as UnitCategory).map((u) => ({ value: u.id, label: u.label }));

  const onCat = (c: string) => {
    setCat(c);
    const u = unitsOf(c as UnitCategory);
    setFrom(u[0]?.id ?? '');
    setTo(u[1]?.id ?? u[0]?.id ?? '');
  };

  const n = toNum(val);
  let out = '—';
  try {
    if (!Number.isNaN(n)) out = nfPrecise.format(convert(n, from, to));
  } catch {
    /* unità incompatibili → — */
  }

  return (
    <ToolBody>
      <SelectField label="Categoria" value={cat} onChange={onCat} options={CATS} />
      <NumberField label="Valore" value={val} onChange={setVal} />
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Da" value={from} onChange={setFrom} options={opts} />
        <SelectField label="A" value={to} onChange={setTo} options={opts} />
      </div>
      <Result value={out} muted={out === '—'} />
    </ToolBody>
  );
}

const PCT_MODES = [
  { value: 'of', label: '% di un valore' },
  { value: 'what', label: 'quanto % è A di B' },
  { value: 'change', label: 'variazione da A a B' },
];

export function Percentuali() {
  const [mode, setMode] = useState('of');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const na = toNum(a);
  const nb = toNum(b);
  const labelA = mode === 'of' ? 'Percentuale (%)' : mode === 'what' ? 'Parte' : 'Da';
  const labelB = mode === 'of' ? 'Valore' : mode === 'what' ? 'Totale' : 'A';

  let out = '—';
  try {
    if (!Number.isNaN(na) && !Number.isNaN(nb)) {
      if (mode === 'of') out = nf.format(percentageOf(na, nb));
      else if (mode === 'what') out = `${nf.format(whatPercent(na, nb))} %`;
      else out = `${nf.format(percentChange(na, nb))} %`;
    }
  } catch {
    /* divisione per zero → — */
  }

  return (
    <ToolBody>
      <SelectField label="Calcolo" value={mode} onChange={setMode} options={PCT_MODES} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label={labelA} value={a} onChange={setA} />
        <NumberField label={labelB} value={b} onChange={setB} />
      </div>
      <Result value={out} muted={out === '—'} />
    </ToolBody>
  );
}

export function RegolaDelTre() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [na, nb, nc] = [toNum(a), toNum(b), toNum(c)];
  let out = '—';
  try {
    if (![na, nb, nc].some(Number.isNaN)) out = nf.format(ruleOfThree(na, nb, nc));
  } catch {
    /* a = 0 → — */
  }
  return (
    <ToolBody>
      <p className="text-muted-foreground text-sm">A : B = C : ?</p>
      <div className="grid grid-cols-3 gap-2">
        <NumberField label="A" value={a} onChange={setA} />
        <NumberField label="B" value={b} onChange={setB} />
        <NumberField label="C" value={c} onChange={setC} />
      </div>
      <Result label="Risultato" value={out} muted={out === '—'} />
    </ToolBody>
  );
}
