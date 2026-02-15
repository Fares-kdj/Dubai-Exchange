import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';

const Header3D = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isArabic = currentLanguage === 'ar';
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '/', labelAr: 'الرئيسية', labelEn: 'Home' },
    { key: 'services', href: '/#services', labelAr: 'الخدمات', labelEn: 'Services' },
    { key: 'partners', href: '/#partners', labelAr: 'الشركاء', labelEn: 'Partners' },
    { key: 'track', href: '/track-order', labelAr: 'تتبع الطلب', labelEn: 'Track Order' },
    { key: 'contact', href: '/#contact', labelAr: 'اتصل بنا', labelEn: 'Contact' }
  ];

  const languages = [
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' },
    { code: 'ku', name: 'کوردی' }
  ];

  const handleNavClick = (href) => {
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(href.replace('/#', ''));
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById(href.replace('/#', ''));
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isLandingPage
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            data-testid="header-logo"
          >
            <img 
              src={ASSETS.logoWhite}
              alt="Dubai International Exchange" 
              className="h-10 md:h-12 object-contain"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.href)}
                data-testid={`nav-${item.key}`}
                className="text-slate-300 hover:text-white transition-colors duration-300 text-sm font-medium relative group"
              >
                {isArabic ? item.labelAr : item.labelEn}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
          </div>

          {/* Language, Theme Toggle & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              data-testid="theme-toggle"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Language Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                data-testid="language-switcher"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm text-white font-medium">
                  {languages.find(l => l.code === currentLanguage)?.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full mt-2 right-0 bg-slate-800 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-xl min-w-[140px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        data-testid={`lang-${lang.code}`}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          currentLanguage === lang.code 
                            ? 'text-[#D4AF37] bg-slate-700 font-medium' 
                            : 'text-slate-200 hover:bg-slate-700'
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
              onClick={() => navigate('/traveler-booking')}
              data-testid="cta-get-started"
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 font-bold rounded-full shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isArabic ? 'ابدأ الآن' : 'Get Started'}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white hover:bg-white/10"
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
              className="p-2 text-white hover:bg-white/10 transition-colors rounded-lg"
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
              className="lg:hidden border-t border-slate-700 py-4"
            >
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.href)}
                    className="text-slate-300 hover:text-white transition-colors py-2 text-sm font-medium text-left"
                  >
                    {isArabic ? item.labelAr : item.labelEn}
                  </button>
                ))}
                
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-700">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left py-2 text-sm ${
                        currentLanguage === lang.code ? 'text-[#D4AF37] font-medium' : 'text-slate-400'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => { navigate('/traveler-booking'); setMobileMenuOpen(false); }}
                  className="w-full mt-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 font-bold rounded-full shadow-lg"
                >
                  {isArabic ? 'ابدأ الآن' : 'Get Started'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header3D;
