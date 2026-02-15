import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { ASSETS, COMPANY } from '@/config/assets';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer3D = () => {
  const { currentLanguage } = useLanguage();
  const isArabic = currentLanguage === 'ar';
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { labelAr: 'حجز الدولار', labelEn: 'USD Booking', href: '/traveler-booking' },
    { labelAr: 'التحويلات', labelEn: 'Transfers', href: '/transfers' },
    { labelAr: 'تتبع الطلب', labelEn: 'Track Order', href: '/track-order' },
    { labelAr: 'الشروط والأحكام', labelEn: 'Terms', href: '/terms' }
  ];

  const contactInfo = [
    { icon: Phone, value: '+964 XXX XXX XXXX', href: 'tel:+964XXXXXXXXX' },
    { icon: MessageCircle, value: 'WhatsApp', href: 'https://wa.me/964XXXXXXXXX' },
    { icon: Mail, value: 'info@dubaiexchange.iq', href: 'mailto:info@dubaiexchange.iq' },
    { icon: MapPin, value: isArabic ? 'بغداد، العراق' : 'Baghdad, Iraq', href: null }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800" id="contact">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <img 
              src={ASSETS.logoWhite}
              alt="Dubai International Exchange"
              className="h-12 mb-6"
            />
            <p className="text-slate-400 mb-6 max-w-md">
              {isArabic 
                ? 'شركة دبي العالمية للصرافة - خدمات مالية موثوقة ومرخصة من البنك المركزي العراقي. نقدم أفضل خدمات الصرافة والتحويلات المالية.'
                : 'Dubai International Exchange - Trusted financial services licensed by the Central Bank of Iraq. We provide the best exchange and money transfer services.'
              }
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
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-400 hover:bg-[#D4AF37] hover:text-slate-900 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {isArabic ? link.labelAr : link.labelEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">
              {isArabic ? 'اتصل بنا' : 'Contact Us'}
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  {info.href ? (
                    <a 
                      href={info.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <span className="text-slate-400 text-sm">{info.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {currentYear} {isArabic ? COMPANY.nameAr : COMPANY.nameEn}. 
            {isArabic ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
          </p>
          
          <div className="flex items-center gap-4">
            <img 
              src={ASSETS.cbiLogo}
              alt="Central Bank of Iraq"
              className="h-8 opacity-50 hover:opacity-100 transition-opacity"
            />
            <span className="text-xs text-slate-500">
              {isArabic ? 'مرخص من البنك المركزي' : 'Licensed by CBI'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer3D;
