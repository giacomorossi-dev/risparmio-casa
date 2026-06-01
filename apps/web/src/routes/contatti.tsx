import { Button } from '@rc/ui/components/button';
import { Checkbox } from '@rc/ui/components/checkbox';
import { Input } from '@rc/ui/components/input';
import { Label } from '@rc/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rc/ui/components/select';
import { Textarea } from '@rc/ui/components/textarea';
import { createFileRoute, Link } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';

import { canonical } from '../lib/site.ts';

export const Route = createFileRoute('/contatti')({
  head: () => ({
    meta: [
      { title: 'Contatti · Risparmio Casa' },
      {
        name: 'description',
        content:
          'Scrivici per feedback, segnalazioni di bug, richieste di informazioni o proposte: compila il modulo e ti rispondiamo al più presto.',
      },
    ],
    links: canonical('/contatti'),
  }),
  component: ContattiPage,
});

// Una decina di argomenti che coprono i casi tipici di richiesta contatto.
const SUBJECTS = [
  'Informazioni generali',
  'Segnalazione di un bug',
  'Feedback e suggerimenti',
  'Proposta di una nuova app o funzione',
  'Errore in un calcolo o nei dati',
  'Segnalazione di un contenuto',
  'Privacy e dati personali',
  'Collaborazioni e partnership',
  'Richiesta stampa / media',
  'Altro',
] as const;

type FormState = { nome: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof FormState | 'terms', string | undefined>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContattiPage() {
  const [form, setForm] = useState<FormState>({ nome: '', email: '', subject: '', message: '' });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const setField = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.nome.trim()) e.nome = 'Inserisci il tuo nome.';
    if (!form.email.trim()) e.email = 'Inserisci la tua email.';
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Inserisci un indirizzo email valido.';
    if (!form.subject) e.subject = 'Scegli un argomento.';
    if (!form.message.trim()) e.message = 'Scrivi un messaggio.';
    else if (form.message.trim().length < 10)
      e.message = 'Il messaggio è troppo breve (almeno 10 caratteri).';
    if (!accepted) e.terms = 'Devi accettare i termini per inviare il messaggio.';
    return e;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    // TODO: invio al backend (endpoint API non ancora disponibile).
    setSent(true);
  };

  return (
    <div className="space-y-8">
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1.5 text-muted-foreground text-sm"
      >
        <Link to="/" className="transition-colors hover:text-foreground hover:underline">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Contatti</span>
      </nav>

      <header className="space-y-3">
        <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">Contatti</h1>
        <div className="max-w-2xl space-y-3 text-muted-foreground leading-relaxed">
          <p>
            Hai una domanda, un'idea o hai trovato qualcosa che non torna? Siamo a tua disposizione.
            Risparmio Casa è un progetto pensato per essere utile davvero, e il tuo riscontro ci
            aiuta a migliorarlo.
          </p>
          <p>
            Usa il modulo qui sotto: scegli l'argomento più adatto così possiamo indirizzare la tua
            richiesta nel modo giusto. Cerchiamo di rispondere entro pochi giorni lavorativi. Per le
            segnalazioni di un bug, descrivi se puoi cosa stavi facendo e cosa è successo: ci fai
            risparmiare tempo e ci aiuti a risolvere prima.
          </p>
        </div>
      </header>

      {sent ? (
        <div className="max-w-xl space-y-3 rounded-xl border bg-card p-6">
          <h2 className="font-semibold text-lg">Messaggio inviato 🎉</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Grazie per averci scritto: abbiamo ricevuto la tua richiesta e ti risponderemo al più
            presto all'indirizzo che ci hai indicato.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => setSent(false)}>
            Invia un altro messaggio
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                autoComplete="name"
                value={form.nome}
                onChange={(ev) => setField('nome', ev.target.value)}
                aria-invalid={!!errors.nome}
                aria-describedby={errors.nome ? 'nome-error' : undefined}
              />
              {errors.nome && (
                <p id="nome-error" className="text-destructive text-sm">
                  {errors.nome}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(ev) => setField('email', ev.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-destructive text-sm">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="oggetto">Oggetto</Label>
            <Select
              value={form.subject}
              onValueChange={(v) => {
                if (typeof v === 'string') setField('subject', v);
              }}
            >
              <SelectTrigger
                id="oggetto"
                className="w-full"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'oggetto-error' : undefined}
              >
                <SelectValue placeholder="Scegli un argomento" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p id="oggetto-error" className="text-destructive text-sm">
                {errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="messaggio">Messaggio</Label>
            <Textarea
              id="messaggio"
              name="messaggio"
              rows={8}
              className="min-h-44"
              placeholder="Scrivi qui la tua richiesta…"
              value={form.message}
              onChange={(ev) => setField('message', ev.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'messaggio-error' : undefined}
            />
            {errors.message && (
              <p id="messaggio-error" className="text-destructive text-sm">
                {errors.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-start gap-2.5">
              <Checkbox
                id="terms"
                checked={accepted}
                onCheckedChange={(c) => {
                  setAccepted(c === true);
                  if (c === true) setErrors((e) => ({ ...e, terms: undefined }));
                }}
                aria-invalid={!!errors.terms}
                className="mt-0.5"
              />
              <Label
                htmlFor="terms"
                className="font-normal text-muted-foreground text-sm leading-snug"
              >
                Ho letto e accetto i{' '}
                <Link to="/termini" className="text-foreground underline hover:no-underline">
                  Termini di servizio
                </Link>{' '}
                e la{' '}
                <Link to="/privacy" className="text-foreground underline hover:no-underline">
                  Privacy policy
                </Link>
                .
              </Label>
            </div>
            {errors.terms && <p className="text-destructive text-sm">{errors.terms}</p>}
          </div>

          <Button type="submit">Invia messaggio</Button>
        </form>
      )}
    </div>
  );
}
