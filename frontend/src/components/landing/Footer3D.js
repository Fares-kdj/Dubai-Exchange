import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS, COMPANY } from '@/config/assets';
import { useBranding } from '@/context/BrandingContext';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Footer3D = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const { logoLight, logoDark } = useBranding();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const lang = currentLanguage || 'ar';

  const [cmsContact, setCmsContact] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cms/contact`);
        if (res.ok) {
          const data = await res.json();
          const hasData = data && (
            (data.ar && (data.ar.phone || data.ar.email || data.ar.address)) ||
            (data.en && (data.en.phone || data.en.email || data.en.address))
          );
          if (hasData) setCmsContact(data);
        }
      } catch { /* use defaults */ }
    };
    fetchContact();
  }, []);

  const text = {
    ar: {
      quickLinks: 'روابط سريعة',
      legalLinks: 'روابط قانونية',
      contactUs: 'اتصل بنا',
      rights: 'جميع الحقوق محفوظة.',
      cbiLicense: 'مرخص من البنك المركزي',
      about: 'شركة دبي العالمية للصرافة - خدمات مالية موثوقة ومرخصة من البنك المركزي العراقي. نقدم أفضل خدمات الصرافة والتحويلات المالية.',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الاستخدام',
      legal: 'إشعار قانوني'
    },
    en: {
      quickLinks: 'Quick Links',
      legalLinks: 'Legal',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      cbiLicense: 'Licensed by CBI',
      about: 'Dubai International Exchange - Trusted financial services licensed by the Central Bank of Iraq. We provide the best exchange and money transfer services.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      legal: 'Legal Notice'
    },
    ku: {
      quickLinks: 'بەستەرە خێراکان',
      legalLinks: 'یاسایی',
      contactUs: 'پەیوەندیمان پێوە بکە',
      rights: 'هەموو مافەکان پارێزراون.',
      cbiLicense: 'مۆڵەتدار لە بانکی ناوەندی',
      about: 'کۆمپانیای خێر بەغداد بۆ ئاڵوگۆڕی دراو - خزمەتگوزارییە دارایییە متمانەپێکراوەکان مۆڵەتدارن لە بانکی ناوەندیی عێراق.',
      privacy: 'سیاسەتی تایبەتمەندی',
      terms: 'مەرجەکانی بەکارهێنان',
      legal: 'ئاگاداری یاسایی'
    }
  };

  const t = text[currentLanguage] || text.ar;

  const quickLinks = [
    { labelAr: 'حجز الدولار', labelEn: 'USD Booking', labelKu: 'نۆرەکردنی دۆلار', href: '/traveler-booking' },
    { labelAr: 'التحويلات', labelEn: 'Transfers', labelKu: 'گواستنەوەکان', href: '/transfers' },
    { labelAr: 'تتبع الطلب', labelEn: 'Track Order', labelKu: 'بەدواداچوونی داواکاری', href: '/track-order' },
    { labelAr: 'الشروط والأحكام', labelEn: 'Terms', labelKu: 'مەرج و ڕێککەوتن', href: '/terms' }
  ];

  const legalLinks = [
    { label: t.privacy, href: '/privacy-policy' },
    { label: t.terms, href: '/terms-of-use' },
    { label: t.legal, href: '/legal-notice' }
  ];

  const getLabel = (link) => isKurdish ? link.labelKu : isArabic ? link.labelAr : link.labelEn;

  // Helper to get localized field from CMS
  const getContactField = (field) => {
    if (!cmsContact) return null;
    const langData = cmsContact[lang] || cmsContact['ar'] || {};
    return langData[field] || null;
  };

  const phone = getContactField('phone') || '+964 780 123 4567';
  const email = getContactField('email') || 'info@dubai-exchange.com';
  const address = getContactField('address') || (isKurdish ? 'بەغداد، عێراق' : isArabic ? 'بغداد، العراق' : 'Baghdad, Iraq');

  const contactInfo = [
    { icon: Phone, value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: MessageCircle, value: 'WhatsApp', href: `https://wa.me/${phone.replace(/[^0-9]/g, '')}` },
    { icon: Mail, value: email, href: `mailto:${email}` },
    { icon: MapPin, value: address, href: null }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className={`border-t transition-colors duration-500 ${isDark
      ? 'bg-slate-900 border-slate-800'
      : 'bg-slate-100 border-slate-200'
      }`} >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <img
              src={isDark ? logoDark : logoLight}
              alt="شعار الشركة"
              className="h-12 mb-6"
            />
            <p className={`mb-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.about}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDark
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
                  <Link
                    to={link.href}
                    className={`text-sm transition-colors ${isDark
                      ? 'text-slate-400 hover:text-[#D4AF37]'
                      : 'text-slate-600 hover:text-[#B8860B]'
                      }`}
                  >
                    {getLabel(link)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className={`font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.legalLinks}
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className={`text-sm transition-colors ${isDark
                      ? 'text-slate-400 hover:text-[#D4AF37]'
                      : 'text-slate-600 hover:text-[#B8860B]'
                      }`}
                  >
                    {link.label}
                  </Link>
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
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-slate-200'
                    }`}>
                    <info.icon className={`w-4 h-4 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`} />
                  </div>
                  {info.href ? (
                    <a
                      href={info.href}
                      className={`text-sm transition-colors ${isDark
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

        {/* Legal Links Row (Mobile-friendly) */}
        <div className={`py-4 border-t flex flex-wrap justify-center gap-x-6 gap-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
          <Link
            to="/privacy-policy"
            className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-[#D4AF37]' : 'text-slate-500 hover:text-[#B8860B]'}`}
          >
            {t.privacy}
          </Link>
          <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
          <Link
            to="/terms-of-use"
            className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-[#D4AF37]' : 'text-slate-500 hover:text-[#B8860B]'}`}
          >
            {t.terms}
          </Link>
          <span className={isDark ? 'text-slate-700' : 'text-slate-300'}>|</span>
          <Link
            to="/legal-notice"
            className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-[#D4AF37]' : 'text-slate-500 hover:text-[#B8860B]'}`}
          >
            {t.legal}
          </Link>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className={`py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
          <p className={`text-sm text-center sm:text-left ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            © 2026 Dubai International Company LLC. {t.rights}
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
