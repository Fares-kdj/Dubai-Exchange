import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBranding } from '@/context/BrandingContext';

const Header = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { logoLight, logoDark } = useBranding();
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
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-sm transition-colors duration-300 ${isDark
        ? 'bg-slate-900/90 border-slate-700'
        : 'bg-white/80 border-slate-100'
        }`}
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
              src={isDark ? logoDark : logoLight}
              alt="Logo"
              className="h-12 w-12 object-contain"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] bg-clip-text text-transparent">
              {currentLanguage === 'ar' ? 'دبي العالمية' : currentLanguage === 'ku' ? 'دوبەی نێودەوڵەتی' : 'Dubai International'}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                data-testid={`nav-${item.key}`}
                className={`transition-colors duration-300 text-sm font-medium relative group ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {t(`nav.${item.key}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Language, Theme Toggle & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              data-testid="theme-toggle"
              className={`p-2.5 rounded-full transition-all duration-300 ${isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Language Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                data-testid="language-switcher"
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-medium">
                  {languages.find(l => l.code === currentLanguage)?.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`absolute top-full mt-2 right-0 backdrop-blur-xl border rounded-2xl overflow-hidden shadow-xl min-w-[140px] ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
                      }`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        data-testid={`lang-${lang.code}`}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${currentLanguage === lang.code
                          ? 'text-[#D4AF37] font-medium ' + (isDark ? 'bg-slate-700' : 'bg-slate-50')
                          : isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
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
              className={`px-6 py-2.5 font-semibold rounded-full shadow-lg transition-all duration-300 ${isDark
                ? 'bg-[#D4AF37] text-slate-900 hover:bg-[#FCD34D] shadow-[#D4AF37]/20'
                : 'bg-slate-900 text-white shadow-slate-900/20 hover:shadow-slate-900/40'
                }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('common.getStarted')}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'text-yellow-400 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Language Selector Mobile */}
            <div className="relative">
              <motion.button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                whileTap={{ scale: 0.9 }}
              >
                <Globe className="w-5 h-5 text-[#D4AF37]" />
              </motion.button>
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`absolute top-full mt-2 left-0 backdrop-blur-xl border rounded-2xl overflow-hidden shadow-xl min-w-[120px] ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'
                      }`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-right text-sm transition-colors ${currentLanguage === lang.code
                          ? 'text-[#D4AF37] font-medium ' + (isDark ? 'bg-slate-700' : 'bg-slate-50')
                          : isDark ? 'text-slate-200 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
              className={`p-2 transition-colors rounded-lg ${isDark ? 'text-slate-200 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t py-4 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`transition-colors py-2 text-sm font-medium ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {t(`nav.${item.key}`)}
                  </a>
                ))}


                <button className={`w-full mt-2 px-6 py-2.5 font-semibold rounded-full shadow-lg ${isDark
                  ? 'bg-[#D4AF37] text-slate-900'
                  : 'bg-slate-900 text-white'
                  }`}>
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
