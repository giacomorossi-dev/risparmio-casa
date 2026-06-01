import { Input } from '@rc/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rc/ui/components/select';
import type { LucideIcon } from 'lucide-react';
import { type ReactNode, useId } from 'react';

// Mattoncini condivisi per le card-utility: shell, campi e formattazione.

export const nf = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 2 });
export const eur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
/** Formato a cifre significative: evita che le conversioni piccole (es. 1 g → kg)
 *  vengano arrotondate a "0". */
export const nfPrecise = new Intl.NumberFormat('it-IT', { maximumSignificantDigits: 6 });

/** Parsa un input numerico accettando la virgola decimale (NaN se vuoto). */
export function toNum(s: string): number {
  const t = s.trim().replace(',', '.');
  return t === '' ? Number.NaN : Number(t);
}

/** Card-utility: titolo + icona + corpo interattivo. */
export function UtilityCard({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" />
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      {hint && <p className="text-muted-foreground text-xs leading-snug">{hint}</p>}
      <div className="flex flex-1 flex-col gap-3">{children}</div>
    </div>
  );
}

/** Campo numerico etichettato (stato come stringa, virgola ammessa). */
export function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="text-muted-foreground">
        {label}
      </label>
      {/* text + inputMode=decimal: la tastiera resta numerica ma si può digitare
          la virgola (type=number la rifiuterebbe); il parsing lo fa toNum. */}
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
}

/** Select etichettato (Base UI). */
export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useId();
  // `items` (valore→etichetta) fa sì che il trigger mostri l'etichetta italiana
  // invece del valore grezzo (id).
  const items = Object.fromEntries(options.map((o) => [o.value, o.label]));
  return (
    <div className="flex flex-col gap-1 text-sm">
      <label htmlFor={id} className="text-muted-foreground">
        {label}
      </label>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => {
          if (typeof v === 'string') onChange(v);
        }}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Riga risultato evidenziata. `muted` quando l'input non è ancora valido. */
export function Result({
  label,
  value,
  muted,
}: {
  label?: string;
  value: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="mt-auto rounded-lg bg-muted/50 px-3 py-2 text-sm">
      {label && <span className="text-muted-foreground">{label}: </span>}
      <strong className={`tabular-nums ${muted ? 'text-muted-foreground' : 'text-foreground'}`}>
        {value}
      </strong>
    </div>
  );
}
