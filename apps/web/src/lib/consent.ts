/**
 * Cookie consent (vanilla-cookieconsent), 2 categorie:
 * - `necessary`: tecnici di prima parte (consent manager, auth Clerk), readOnly
 * - `analytics`: GA4 (caricato post-consenso via loadGA4)
 *
 * Conforme alle Linee Guida del Garante 10/06/2021: "Accetta tutti" e
 * "Rifiuta tutti" ugualmente prominenti, nessun dark pattern, riapertura
 * preferenze dal footer via `data-cc="show-preferencesModal"`.
 */

import * as CookieConsent from 'vanilla-cookieconsent';

import { loadGA4, revokeGA4 } from './analytics.ts';

export const consentConfig: CookieConsent.CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'bar',
      position: 'bottom',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  categories: {
    necessary: { enabled: true, readOnly: true },
    analytics: {
      autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }] },
      services: {
        ga4: {
          label: 'Google Analytics 4',
          onAccept: () => loadGA4(),
          onReject: () => revokeGA4(),
          cookies: [{ name: /^_ga/ }, { name: '_gid' }],
        },
      },
    },
  },

  language: {
    default: 'it',
    translations: {
      it: {
        consentModal: {
          title: 'Cookie e privacy',
          description:
            'Risparmio Casa usa cookie tecnici necessari al funzionamento del sito e, previo consenso, cookie di terze parti per misurare in forma aggregata l\'utilizzo del sito. Dettagli nella <a href="/privacy">privacy policy</a> e nella <a href="/cookie">cookie policy</a>. Puoi modificare le scelte dalla voce "Preferenze cookie" nel footer.',
          acceptAllBtn: 'Accetta tutti',
          acceptNecessaryBtn: 'Rifiuta tutti',
          showPreferencesBtn: 'Personalizza',
        },
        preferencesModal: {
          title: 'Preferenze cookie',
          acceptAllBtn: 'Accetta tutti',
          acceptNecessaryBtn: 'Rifiuta tutti',
          savePreferencesBtn: 'Salva preferenze',
          closeIconLabel: 'Chiudi',
          serviceCounterLabel: 'Servizio|Servizi',
          sections: [
            {
              title: 'Le tue preferenze',
              description:
                'Qui controlli ogni categoria di cookie. I cookie strettamente necessari non si possono disattivare perché servono al funzionamento del sito.',
            },
            {
              title: 'Cookie strettamente necessari',
              description:
                'Cookie tecnici di prima parte (banner consenso, autenticazione). Non raccolgono dati identificativi a fini di marketing.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Statistiche',
              description:
                'Cookie di Google Analytics 4 (terze parti) per capire come gli utenti usano il sito, in forma aggregata.',
              linkedCategory: 'analytics',
            },
            {
              title: 'Maggiori informazioni',
              description:
                'Per domande sul trattamento dei dati consulta la <a href="/privacy">privacy policy</a> o scrivici dai <a href="/contatti">contatti</a>.',
            },
          ],
        },
      },
    },
  },
};

export function initConsent(): void {
  void CookieConsent.run(consentConfig);
}
