
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'sw';

// Define localization data structure
export interface LocalizationData {
  [key: string]: {
    [key: string]: string;
  };
}

// Define context interface
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number) => string;
}

// Create the context with default values
const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  formatCurrency: (amount) => `KSh ${amount}`
});

// Define props for the I18nProvider
interface I18nProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Get saved language from localStorage or use 'en' as default
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang === 'sw' ? 'sw' : 'en';
  });

  // Define localization data for English and Swahili
  const [translations, setTranslations] = useState<LocalizationData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Load translation files based on the selected language
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const enTranslations = await import('../locales/en.json');
        const swTranslations = await import('../locales/sw.json');
        
        setTranslations({
          en: enTranslations,
          sw: swTranslations
        });
      } catch (error) {
        console.error('Failed to load translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  // Translation function that supports placeholders
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Default to English if translations aren't loaded yet
    if (isLoading) return key;
    
    const keys = key.split('.');
    let value = translations[language];
    
    // Navigate through the nested keys
    for (const k of keys) {
      if (!value) return key;
      value = value[k];
    }
    
    // Return the key if translation not found
    if (!value) return key;
    
    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce((acc, [param, replacement]) => {
        return acc.replace(new RegExp(`{{${param}}}`, 'g'), String(replacement));
      }, value as string);
    }
    
    return value as string;
  };

  // Format currency in Kenyan Shillings (KSh X,XXX)
  const formatCurrency = (amount: number): string => {
    // Format without decimal places as per requirement
    return `KSh ${Math.round(amount).toLocaleString('en-KE')}`;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, formatCurrency }}>
      {children}
    </I18nContext.Provider>
  );
};

// Create a hook for easy access to the I18n context
export const useI18n = () => useContext(I18nContext);
