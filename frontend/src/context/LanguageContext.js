import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('ar');
  const [direction, setDirection] = useState('rtl');

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'ar';
    changeLanguage(lang);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    
    const dir = lang === 'ar' || lang === 'ku' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, direction, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
