import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import ar from './ar.json';

export const resources = {
    en: { translation: en },
    ar: { translation: ar },
} as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'ar'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
        },
    });

// Get current direction based on language
export const getDirection = (lang?: string): 'ltr' | 'rtl' => {
    const currentLang = lang || i18n.language;
    return currentLang === 'ar' ? 'rtl' : 'ltr';
};

// Check if current language is RTL
export const isRTL = (lang?: string): boolean => {
    return getDirection(lang) === 'rtl';
};

export default i18n;
