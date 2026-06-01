import { useState } from 'react';

import {
  addVat,
  applyDiscount,
  compareAppliances,
  costOverTime,
  homemadeVsBought,
  multiBuyUnitPrice,
  type Period,
  removeVat,
  splitEven,
} from '../../../lib/calc/money.ts';
import { eur, NumberField, Result, SelectField, ToolBody, toNum } from './kit.tsx';

export function Sconto() {
  const [price, setPrice] = useState('');
  const [pct, setPct] = useState('');
  const np = toNum(price);
  const npct = toNum(pct);
  const valid = !Number.isNaN(np) && !Number.isNaN(npct);
  const outOfRange = !Number.isNaN(npct) && (npct < 0 || npct > 100);
  return (
    <ToolBody>
      <NumberField label="Prezzo (€)" value={price} onChange={setPrice} />
      <NumberField label="Sconto (%)" value={pct} onChange={setPct} />
      {outOfRange && (
        <p className="text-destructive text-xs">Lo sconto dovrebbe essere tra 0 e 100%.</p>
      )}
      <Result
        label="Prezzo finale"
        value={valid ? eur.format(applyDiscount(np, npct)) : '—'}
        muted={!valid}
      />
      {valid && <Result label="Risparmi" value={eur.format(np - applyDiscount(np, npct))} />}
    </ToolBody>
  );
}

export function OffertaMultipla() {
  const [price, setPrice] = useState('');
  const [buy, setBuy] = useState('3');
  const [pay, setPay] = useState('2');
  const [np, nb, npay] = [toNum(price), toNum(buy), toNum(pay)];
  let out = '—';
  try {
    if (![np, nb, npay].some(Number.isNaN)) out = eur.format(multiBuyUnitPrice(np, nb, npay));
  } catch {
    /* compra 0 → — */
  }
  return (
    <ToolBody>
      <NumberField label="Prezzo a pezzo (€)" value={price} onChange={setPrice} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Ne prendi" value={buy} onChange={setBuy} />
        <NumberField label="Ne paghi" value={pay} onChange={setPay} />
      </div>
      <Result label="Prezzo effettivo/pezzo" value={out} muted={out === '—'} />
    </ToolBody>
  );
}

const VAT_RATES = [
  { value: '22', label: '22%' },
  { value: '10', label: '10%' },
  { value: '5', label: '5%' },
  { value: '4', label: '4%' },
];
const VAT_DIR = [
  { value: 'add', label: 'aggiungi IVA (da imponibile)' },
  { value: 'remove', label: 'scorpora IVA (da lordo)' },
];

export function Iva() {
  const [dir, setDir] = useState('add');
  const [rate, setRate] = useState('22');
  const [amount, setAmount] = useState('');
  const n = toNum(amount);
  const r = Number(rate);
  const valid = !Number.isNaN(n);
  const res = dir === 'add' ? addVat(n, r) : null;
  const rem = dir === 'remove' ? removeVat(n, r) : null;
  return (
    <ToolBody>
      <SelectField label="Operazione" value={dir} onChange={setDir} options={VAT_DIR} />
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Aliquota" value={rate} onChange={setRate} options={VAT_RATES} />
        <NumberField label="Importo (€)" value={amount} onChange={setAmount} />
      </div>
      {dir === 'add' ? (
        <>
          <Result label="IVA" value={valid && res ? eur.format(res.vat) : '—'} muted={!valid} />
          <Result
            label="Totale"
            value={valid && res ? eur.format(res.gross) : '—'}
            muted={!valid}
          />
        </>
      ) : (
        <>
          <Result
            label="Imponibile"
            value={valid && rem ? eur.format(rem.net) : '—'}
            muted={!valid}
          />
          <Result label="IVA" value={valid && rem ? eur.format(rem.vat) : '—'} muted={!valid} />
        </>
      )}
    </ToolBody>
  );
}

const PERIODS = [
  { value: 'day', label: 'al giorno' },
  { value: 'week', label: 'a settimana' },
  { value: 'month', label: 'al mese' },
  { value: 'year', label: "all'anno" },
];

export function CostoNelTempo() {
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('day');
  const n = toNum(amount);
  const proj = Number.isNaN(n) ? null : costOverTime(n, period as Period);
  return (
    <ToolBody>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Importo (€)" value={amount} onChange={setAmount} />
        <SelectField label="Ogni" value={period} onChange={setPeriod} options={PERIODS} />
      </div>
      <Result label="Al mese" value={proj ? eur.format(proj.month) : '—'} muted={!proj} />
      <Result label="All'anno" value={proj ? eur.format(proj.year) : '—'} muted={!proj} />
    </ToolBody>
  );
}

export function FattoInCasa() {
  const [ing, setIng] = useState('');
  const [servings, setServings] = useState('');
  const [bought, setBought] = useState('');
  const [ni, ns, nb] = [toNum(ing), toNum(servings), toNum(bought)];
  let res: ReturnType<typeof homemadeVsBought> | null = null;
  try {
    if (![ni, ns, nb].some(Number.isNaN)) res = homemadeVsBought(ni, ns, nb);
  } catch {
    /* porzioni 0 → — */
  }
  return (
    <ToolBody>
      <NumberField label="Costo ingredienti (€)" value={ing} onChange={setIng} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Porzioni" value={servings} onChange={setServings} />
        <NumberField label="Prezzo pronto (€)" value={bought} onChange={setBought} />
      </div>
      <Result
        label="In casa / porzione"
        value={res ? eur.format(res.homemadePerServing) : '—'}
        muted={!res}
      />
      <Result
        label="Risparmio / porzione"
        value={res ? eur.format(res.savingPerServing) : '—'}
        muted={!res}
      />
    </ToolBody>
  );
}

export function DividiConto() {
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState('2');
  const [nt, npl] = [toNum(total), toNum(people)];
  let out = '—';
  try {
    if (![nt, npl].some(Number.isNaN)) out = eur.format(splitEven(nt, npl));
  } catch {
    /* 0 persone → — */
  }
  return (
    <ToolBody>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Totale (€)" value={total} onChange={setTotal} />
        <NumberField label="Persone" value={people} onChange={setPeople} />
      </div>
      <Result label="A testa" value={out} muted={out === '—'} />
    </ToolBody>
  );
}

export function Ammortamento() {
  const [oldKwh, setOldKwh] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newKwh, setNewKwh] = useState('');
  const [price, setPrice] = useState('0.25');
  const [years, setYears] = useState('10');
  const vals = [oldKwh, newPrice, newKwh, price, years].map(toNum);
  let res: ReturnType<typeof compareAppliances> | null = null;
  if (!vals.some(Number.isNaN)) {
    const [oK, nP, nK, pk, y] = vals as [number, number, number, number, number];
    res = compareAppliances({ price: 0, yearlyKwh: oK }, { price: nP, yearlyKwh: nK }, pk, y);
  }
  return (
    <ToolBody>
      <NumberField label="kWh/anno attuale" value={oldKwh} onChange={setOldKwh} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Prezzo nuovo (€)" value={newPrice} onChange={setNewPrice} />
        <NumberField label="kWh/anno nuovo" value={newKwh} onChange={setNewKwh} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="€/kWh" value={price} onChange={setPrice} />
        <NumberField label="Anni" value={years} onChange={setYears} />
      </div>
      <Result
        label={res && res.saving >= 0 ? 'Risparmi (sostituendo)' : 'Costo extra'}
        value={res ? eur.format(Math.abs(res.saving)) : '—'}
        muted={!res}
      />
    </ToolBody>
  );
}
