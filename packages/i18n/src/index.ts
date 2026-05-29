import i18next, { type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import itCommon from './locales/it/common.json' with { type: 'json' };

export const DEFAULT_LOCALE = 'it' as const;
export const SUPPORTED_LOCALES = ['it'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export type Resources = {
  common: typeof itCommon;
};

export const createI18n = (locale: Locale = DEFAULT_LOCALE): I18nInstance => {
  const instance = i18next.createInstance();

  void instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    defaultNS: 'common',
    ns: ['common'],
    resources: {
      it: { common: itCommon },
    },
    interpolation: { escapeValue: false },
    returnNull: false,
  });

  return instance;
};

export { I18nextProvider, Trans, useTranslation } from 'react-i18next';
