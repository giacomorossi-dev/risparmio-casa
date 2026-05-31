import { useEffect } from 'react';

import { initConsent } from '../lib/consent.ts';

// Monta il banner vanilla-cookieconsent (inietta il proprio DOM in body).
// Riapertura preferenze ovunque via <button data-cc="show-preferencesModal">.
export const CookieConsent = () => {
  useEffect(() => {
    initConsent();
  }, []);
  return null;
};
