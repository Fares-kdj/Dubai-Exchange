import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
    { code: 'ku', name: 'کوردی' }
  ];

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'services', href: '#services' },
    { key: 'converter', href: '#converter' },
    { key: 'track', href: '#track' },
    { key: 'contact', href: '#contact' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            data-testid="header-logo"
          >
            <img 
              src="https://customer-assets.emergentagent.com/job_7efbc9ce-8094-4873-885a-2d609c6c609c/artifacts/lmq1ukzi_%D8%B4%D8%B9%D8%A7%D8%B1_%D8%AE%D8%AA%D9%85_%D8%B5%D8%A7%D9%81%D9%8A-removebg-preview.png" 
              alt="Khair Baghdad Logo" 
              className="h-12 w-12 object-contain"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] bg-clip-text text-transparent">
              {currentLanguage === 'ar' ? 'خير بغداد' : currentLanguage === 'ku' ? 'خەیر بەغداد' : 'Khair Baghdad'}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                data-testid={`nav-${item.key}`}
                className="text-slate-600 hover:text-slate-900 transition-colors duration-300 text-sm font-medium relative group"
              >
                {t(`nav.${item.key}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Language & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                data-testid="language-switcher"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm text-slate-700 font-medium">
                  {languages.find(l => l.code === currentLanguage)?.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full mt-2 right-0 bg-white backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden shadow-xl min-w-[140px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        data-testid={`lang-${lang.code}`}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors ${
                          currentLanguage === lang.code ? 'text-[#D4AF37] bg-slate-50 font-medium' : 'text-slate-700'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.button
              data-testid="cta-get-started"
              className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-full shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('common.getStarted')}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 py-4"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-slate-600 hover:text-slate-900 transition-colors py-2 text-sm font-medium"
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ))}
                
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left py-2 text-sm ${
                        currentLanguage === lang.code ? 'text-[#D4AF37] font-medium' : 'text-slate-600'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <button className="w-full mt-2 px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-full shadow-lg">
                  {t('common.getStarted')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
