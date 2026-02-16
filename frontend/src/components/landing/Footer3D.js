import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS, COMPANY } from '@/config/assets';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer3D = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const currentYear = new Date().getFullYear();

  const text = {
    ar: {
      quickLinks: 'روابط سريعة',
      contactUs: 'اتصل بنا',
      rights: 'جميع الحقوق محفوظة.',
      cbiLicense: 'مرخص من البنك المركزي',
      about: 'شركة دبي العالمية للصرافة - خدمات مالية موثوقة ومرخصة من البنك المركزي العراقي. نقدم أفضل خدمات الصرافة والتحويلات المالية.'
    },
    en: {
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      cbiLicense: 'Licensed by CBI',
      about: 'Dubai International Exchange - Trusted financial services licensed by the Central Bank of Iraq. We provide the best exchange and money transfer services.'
    },
    ku: {
      quickLinks: 'بەستەرە خێراکان',
      contactUs: 'پەیوەندیمان پێوە بکە',
      rights: 'هەموو مافەکان پارێزراون.',
      cbiLicense: 'مۆڵەتدار لە بانکی ناوەندی',
      about: 'کۆمپانیای دوبەی نێودەوڵەتی بۆ ئاڵوگۆڕی دراو - خزمەتگوزارییە دارایییە متمانەپێکراوەکان مۆڵەتدارن لە بانکی ناوەندیی عێراق.'
    }
  };

  const t = text[currentLanguage] || text.ar;

  const quickLinks = [
    { labelAr: 'حجز الدولار', labelEn: 'USD Booking', labelKu: 'نۆرەکردنی دۆلار', href: '/traveler-booking' },
    { labelAr: 'التحويلات', labelEn: 'Transfers', labelKu: 'گواستنەوەکان', href: '/transfers' },
    { labelAr: 'تتبع الطلب', labelEn: 'Track Order', labelKu: 'بەدواداچوونی داواکاری', href: '/track-order' },
    { labelAr: 'الشروط والأحكام', labelEn: 'Terms', labelKu: 'مەرج و ڕێککەوتن', href: '/terms' }
  ];

  const getLabel = (link) => isKurdish ? link.labelKu : isArabic ? link.labelAr : link.labelEn;

  const contactInfo = [
    { icon: Phone, value: '+964 XXX XXX XXXX', href: 'tel:+964XXXXXXXXX' },
    { icon: MessageCircle, value: 'WhatsApp', href: 'https://wa.me/964XXXXXXXXX' },
    { icon: Mail, value: 'info@dubaiexchange.iq', href: 'mailto:info@dubaiexchange.iq' },
    { icon: MapPin, value: isKurdish ? 'بەغداد، عێراق' : isArabic ? 'بغداد، العراق' : 'Baghdad, Iraq', href: null }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className={`border-t transition-colors duration-500 ${
      isDark 
        ? 'bg-slate-900 border-slate-800'
        : 'bg-slate-100 border-slate-200'
    }`} id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <img 
              src={isDark ? ASSETS.logoWhite : ASSETS.logoColor}
              alt="Dubai International Exchange"
              className="h-12 mb-6"
            />
            <p className={`mb-6 max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.about}
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/10 text-slate-400 hover:bg-[#D4AF37] hover:text-slate-900'
                      : 'bg-slate-200 text-slate-600 hover:bg-[#D4AF37] hover:text-white'
                  }`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.quickLinks}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isDark 
                        ? 'text-slate-400 hover:text-[#D4AF37]'
                        : 'text-slate-600 hover:text-[#B8860B]'
                    }`}
                  >
                    {getLabel(link)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.contactUs}
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-white/10' : 'bg-slate-200'
                  }`}>
                    <info.icon className={`w-4 h-4 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`} />
                  </div>
                  {info.href ? (
                    <a 
                      href={info.href}
                      className={`text-sm transition-colors ${
                        isDark 
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{info.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <p className={`text-sm text-center sm:text-left ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            © {currentYear} {isKurdish ? COMPANY.nameKu || COMPANY.nameAr : isArabic ? COMPANY.nameAr : COMPANY.nameEn}. 
            {' '}{t.rights}
          </p>
          
          <div className="flex items-center gap-4">
            <img 
              src={ASSETS.cbiLogo}
              alt="Central Bank of Iraq"
              className="h-8 opacity-50 hover:opacity-100 transition-opacity"
            />
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {t.cbiLicense}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer3D;
