// /metlife-TEN-Hackathon/frontend/src/components/LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-switcher">
      <button 
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('es')}
        className={i18n.language === 'es' ? 'active' : ''}
      >
        ES
      </button>
      <button 
        onClick={() => changeLanguage('vi')}
        className={i18n.language === 'vi' ? 'active' : ''}
      >
        VI
      </button>
    </div>
  );
};

export default LanguageSwitcher;
