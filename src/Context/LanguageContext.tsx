// context/LanguageContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define allowed languages type
type LanguageType = 'en' | 'fr';

// Update context type to match allowed languages
export const LanguageContext = createContext({
  language: 'en' as LanguageType,
  setLanguage: (lang: LanguageType) => {},
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Validate stored language or default to English
  const storedLang = localStorage.getItem('lang');
  const initialLang: LanguageType = (storedLang === 'en' || storedLang === 'fr') 
    ? storedLang 
    : 'en';
  
  const [language, setLanguage] = useState<LanguageType>(initialLang);

  const handleSetLanguage = (lang: LanguageType) => {
    // Only set if valid language
    if (lang === 'en' || lang === 'fr') {
      setLanguage(lang);
      localStorage.setItem('lang', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};