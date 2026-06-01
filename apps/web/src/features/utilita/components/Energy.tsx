import { Droplets, Flame, Fuel, Snowflake, Zap } from 'lucide-react';
import { useState } from 'react';

import {
  applianceCost,
  drippingTap,
  gasCost,
  gasM3ToKwh,
  recommendedBtu,
  tripFuelCost,
} from '../../../lib/calc/energy.ts';
import { eur, NumberField, nf, Result, toNum, UtilityCard } from './kit.tsx';

export function CostoElettrodomestico() {
  const [watts, setWatts] = useState('');
  const [hours, setHours] = useState('');
  const [price, setPrice] = useState('0.25');
  const vals = [watts, hours, price].map(toNum);
  const valid = !vals.some(Number.isNaN);
  const r = valid
    ? applianceCost({
        watts: vals[0] as number,
        hoursPerDay: vals[1] as number,
        pricePerKwh: vals[2] as number,
      })
    : null;
  return (
    <UtilityCard icon={Zap} title="Costo elettrodomestico" hint="Quanto consuma in bolletta">
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Potenza (W)" value={watts} onChange={setWatts} />
        <NumberField label="Ore al giorno" value={hours} onChange={setHours} />
      </div>
      <NumberField label="€/kWh" value={price} onChange={setPrice} />
      <Result label="Al mese" value={r ? eur.format(r.costMonth) : '—'} muted={!r} />
      <Result label="All'anno" value={r ? eur.format(r.costYear) : '—'} muted={!r} />
    </UtilityCard>
  );
}

export function Gas() {
  const [m3, setM3] = useState('');
  const [price, setPrice] = useState('');
  const [nm, np] = [toNum(m3), toNum(price)];
  const valid = !Number.isNaN(nm);
  return (
    <UtilityCard icon={Flame} title="Gas m³ → kWh / €" hint="Coefficiente PCS ≈ 10,69">
      <NumberField label="Consumo (m³)" value={m3} onChange={setM3} />
      <NumberField label="€/kWh (facolt.)" value={price} onChange={setPrice} />
      <Result
        label="Energia"
        value={valid ? `${nf.format(gasM3ToKwh(nm))} kWh` : '—'}
        muted={!valid}
      />
      {valid && !Number.isNaN(np) && <Result label="Costo" value={eur.format(gasCost(nm, np))} />}
    </UtilityCard>
  );
}

export function RubinettoCheGocciola() {
  const [drops, setDrops] = useState('10');
  const [price, setPrice] = useState('1.5');
  const [nd, np] = [toNum(drops), toNum(price)];
  const r = !Number.isNaN(nd) && !Number.isNaN(np) ? drippingTap(nd, np) : null;
  return (
    <UtilityCard
      icon={Droplets}
      title="Rubinetto che gocciola"
      hint="Acqua e € sprecati in un anno"
    >
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Gocce/minuto" value={drops} onChange={setDrops} />
        <NumberField label="€/m³ acqua" value={price} onChange={setPrice} />
      </div>
      <Result label="Litri/anno" value={r ? nf.format(r.litersPerYear) : '—'} muted={!r} />
      <Result label="Spreco/anno" value={r ? eur.format(r.costPerYear) : '—'} muted={!r} />
    </UtilityCard>
  );
}

export function Condizionatore() {
  const [mq, setMq] = useState('');
  const n = toNum(mq);
  const out = Number.isNaN(n) ? '—' : `${nf.format(recommendedBtu(n))} BTU`;
  return (
    <UtilityCard
      icon={Snowflake}
      title="BTU condizionatore"
      hint="Potenza consigliata per la stanza"
    >
      <NumberField label="Superficie stanza (m²)" value={mq} onChange={setMq} />
      <Result label="Consigliati" value={out} muted={out === '—'} />
    </UtilityCard>
  );
}

export function Carburante() {
  const [km, setKm] = useState('');
  const [cons, setCons] = useState('6');
  const [price, setPrice] = useState('1.8');
  const vals = [km, cons, price].map(toNum);
  const valid = !vals.some(Number.isNaN);
  const out = valid
    ? eur.format(tripFuelCost(vals[0] as number, vals[1] as number, vals[2] as number))
    : '—';
  return (
    <UtilityCard icon={Fuel} title="Costo tragitto" hint="Carburante per i km percorsi">
      <NumberField label="Distanza (km)" value={km} onChange={setKm} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Consumo (l/100km)" value={cons} onChange={setCons} />
        <NumberField label="€/litro" value={price} onChange={setPrice} />
      </div>
      <Result label="Costo" value={out} muted={out === '—'} />
    </UtilityCard>
  );
}
