import { useState } from 'react';

import { paintLiters, roomVolume, tilesNeeded } from '../../../lib/calc/home.ts';
import { NumberField, nf, Result, ToolBody, toNum } from './kit.tsx';

export function Vernice() {
  const [area, setArea] = useState('');
  const [coats, setCoats] = useState('2');
  const [ded, setDed] = useState('0');
  const vals = [area, coats, ded].map(toNum);
  const valid = !Number.isNaN(vals[0] as number);
  const out = valid
    ? `${nf.format(paintLiters({ wallArea: vals[0] as number, coats: vals[1] as number, deductions: vals[2] as number }))} l`
    : '—';
  return (
    <ToolBody>
      <NumberField label="Pareti (m²)" value={area} onChange={setArea} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Mani" value={coats} onChange={setCoats} />
        <NumberField label="Porte/finestre (m²)" value={ded} onChange={setDed} />
      </div>
      <Result label="Vernice" value={out} muted={out === '—'} />
    </ToolBody>
  );
}

export function Piastrelle() {
  const [area, setArea] = useState('');
  const [tile, setTile] = useState('');
  const [waste, setWaste] = useState('10');
  const [perBox, setPerBox] = useState('');
  const [na, nt, nw, npb] = [toNum(area), toNum(tile), toNum(waste), toNum(perBox)];
  let r: ReturnType<typeof tilesNeeded> | null = null;
  try {
    if (!Number.isNaN(na) && !Number.isNaN(nt)) {
      r = tilesNeeded({
        area: na,
        tileArea: nt,
        wastePercent: Number.isNaN(nw) ? 10 : nw,
        ...(Number.isNaN(npb) ? {} : { perBox: npb }),
      });
    }
  } catch {
    /* misura piastrella 0 → — */
  }
  return (
    <ToolBody>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Superficie (m²)" value={area} onChange={setArea} />
        <NumberField label="1 piastrella (m²)" value={tile} onChange={setTile} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Sfrido (%)" value={waste} onChange={setWaste} />
        <NumberField label="Pezzi/scatola" value={perBox} onChange={setPerBox} />
      </div>
      <Result label="Pezzi" value={r ? nf.format(r.tiles) : '—'} muted={!r} />
      {r?.boxes !== undefined && <Result label="Scatole" value={nf.format(r.boxes)} />}
    </ToolBody>
  );
}

export function StanzaAreaVolume() {
  const [w, setW] = useState('');
  const [l, setL] = useState('');
  const [h, setH] = useState('2.7');
  const [nw, nl, nh] = [toNum(w), toNum(l), toNum(h)];
  const areaOk = !Number.isNaN(nw) && !Number.isNaN(nl);
  const volOk = areaOk && !Number.isNaN(nh);
  return (
    <ToolBody>
      <div className="grid grid-cols-3 gap-2">
        <NumberField label="Larg. (m)" value={w} onChange={setW} />
        <NumberField label="Lung. (m)" value={l} onChange={setL} />
        <NumberField label="Alt. (m)" value={h} onChange={setH} />
      </div>
      <Result label="Area" value={areaOk ? `${nf.format(nw * nl)} m²` : '—'} muted={!areaOk} />
      <Result
        label="Volume"
        value={volOk ? `${nf.format(roomVolume(nw, nl, nh))} m³` : '—'}
        muted={!volOk}
      />
    </ToolBody>
  );
}
