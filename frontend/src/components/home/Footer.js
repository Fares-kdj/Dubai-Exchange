import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';

const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { key: 'privacy', href: '#' },
    { key: 'terms', href: '#' }
  ];

  return (
    <footer className="bg-black border-t border-[#D4AF37]/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Company Name */}
          <div className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_7efbc9ce-8094-4873-885a-2d609c6c609c/artifacts/lmq1ukzi_%D8%B4%D8%B9%D8%A7%D8%B1_%D8%AE%D8%AA%D9%85_%D8%B5%D8%A7%D9%81%D9%8A-removebg-preview.png" 
              alt="Khair Baghdad Logo" 
              className="h-10 w-10 object-contain"
            />
            <div>
              <div className="text-[#D4AF37] font-bold text-sm">
                {currentLanguage === 'ar' ? 'خير بغداد للصرافة' : currentLanguage === 'ku' ? 'خەیر بەغداد بۆ گۆڕینەوە' : 'Khair Baghdad for Exchange'}
              </div>
              <div className="text-gray-500 text-xs">
                © {currentYear} {t('footer.rights')}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm"
              >
                {t(`footer.${link.key}`)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
