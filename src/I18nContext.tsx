import React, { createContext, useContext } from 'react';
import { translations, Language } from './i18n';

type I18nContextType = {
  lang: Language;
  t: typeof translations.en;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ lang, children }: { lang: Language; children: React.ReactNode }) {
  const t = translations[lang];
  return (
    <I18nContext.Provider value={{ lang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
