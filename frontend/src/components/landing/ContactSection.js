import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const ContactSection = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [contactInfo, setContactInfo] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);

  const text = {
    ar: {
      badge: 'تواصل معنا',
      title: 'نحن هنا لمساعدتك',
      subtitle: 'فريقنا جاهز للإجابة على جميع استفساراتك على مدار الساعة',
      phone: 'الهاتف',
      whatsapp: 'واتساب',
      email: 'البريد الإلكتروني',
      address: 'العنوان',
      hours: 'ساعات العمل',
      formTitle: 'أرسل رسالة',
      name: 'الاسم',
      yourPhone: 'رقم الهاتف',
      message: 'الرسالة',
      send: 'إرسال',
      followUs: 'تابعنا على'
    },
    en: {
      badge: 'Contact Us',
      title: 'We Are Here to Help',
      subtitle: 'Our team is ready to answer all your inquiries around the clock',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      email: 'Email',
      address: 'Address',
      hours: 'Working Hours',
      formTitle: 'Send a Message',
      name: 'Name',
      yourPhone: 'Phone Number',
      message: 'Message',
      send: 'Send',
      followUs: 'Follow Us On'
    },
    ku: {
      badge: 'پەیوەندیمان پێوە بکە',
      title: 'ئێمە لێرەین بۆ یارمەتیدانت',
      subtitle: 'تیممان ئامادەیە بۆ وەڵامدانەوەی هەموو پرسیارەکانت بە درێژایی ڕۆژ',
      phone: 'تەلەفۆن',
      whatsapp: 'واتساپ',
      email: 'ئیمەیڵ',
      address: 'ناونیشان',
      hours: 'کاتژمێری کار',
      formTitle: 'نامەیەک بنێرە',
      name: 'ناو',
      yourPhone: 'ژمارەی تەلەفۆن',
      message: 'نامە',
      send: 'ناردن',
      followUs: 'بەدوایماندا بێ لەسەر'
    }
  };

  const t = text[currentLanguage] || text.ar;

  // Default contact info (can be overridden by CMS)
  const defaultContact = {
    phone: '+964 780 123 4567',
    whatsapp: '+964 780 123 4567',
    email: 'info@dubaiexchange.iq',
    address: {
      ar: 'بغداد، شارع السعدون، مجمع الأعمال',
      en: 'Baghdad, Al-Sadoun Street, Business Complex',
      ku: 'بەغداد، شەقامی سەعدون، کۆمپلێکسی بازرگانی'
    },
    hours: {
      ar: 'السبت - الخميس: 9 صباحاً - 6 مساءً',
      en: 'Saturday - Thursday: 9 AM - 6 PM',
      ku: 'شەممە - پێنجشەممە: ٩ بەیانی - ٦ ئێوارە'
    },
    social: {
      facebook: '#',
      instagram: '#',
      twitter: '#',
      youtube: '#',
      linkedin: '#'
    }
  };

  useEffect(() => {
    // Try to fetch contact info from CMS
    const fetchContact = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cms/contact`);
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        } else {
          setContactInfo(defaultContact);
        }
      } catch {
        setContactInfo(defaultContact);
      }
    };
    fetchContact();
  }, []);

  // Helper to get localized data from CMS format or default format
  const getLocalizedField = (data, field) => {
    if (!data) return '';
    
    // CMS format: { ar: { address: "..." }, en: { address: "..." } }
    const lang = isKurdish ? 'ku' : isArabic ? 'ar' : 'en';
    if (data[lang] && data[lang][field]) {
      return data[lang][field];
    }
    
    // Fallback to ar if current lang not available
    if (data.ar && data.ar[field]) {
      return data.ar[field];
    }
    
    // Default format: { field: { ar: "...", en: "..." } }
    if (data[field]) {
      if (typeof data[field] === 'string') return data[field];
      return isKurdish ? data[field].ku : isArabic ? data[field].ar : data[field].en;
    }
    
    return '';
  };

  // Merge CMS data with defaults
  const info = contactInfo ? {
    phone: getLocalizedField(contactInfo, 'phone') || defaultContact.phone,
    whatsapp: getLocalizedField(contactInfo, 'phone') || defaultContact.whatsapp,
    email: getLocalizedField(contactInfo, 'email') || defaultContact.email,
    address: getLocalizedField(contactInfo, 'address') || (isKurdish ? defaultContact.address.ku : isArabic ? defaultContact.address.ar : defaultContact.address.en),
    hours: getLocalizedField(contactInfo, 'working_hours') || (isKurdish ? defaultContact.hours.ku : isArabic ? defaultContact.hours.ar : defaultContact.hours.en),
    social: defaultContact.social
  } : defaultContact;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // In a real implementation, this would send the message
    setTimeout(() => {
      setSending(false);
      setFormData({ name: '', phone: '', message: '' });
      alert(isArabic ? 'تم إرسال رسالتك بنجاح!' : isKurdish ? 'نامەکەت بە سەرکەوتوویی نێردرا!' : 'Your message has been sent!');
    }, 1000);
  };

  const getAddress = () => {
    if (!info.address) return '';
    if (typeof info.address === 'string') return info.address;
    return isKurdish ? info.address.ku : isArabic ? info.address.ar : info.address.en;
  };

  const getHours = () => {
    if (!info.hours) return '';
    if (typeof info.hours === 'string') return info.hours;
    return isKurdish ? info.hours.ku : isArabic ? info.hours.ar : info.hours.en;
  };

  const contactCards = [
    { icon: Phone, label: t.phone, value: info.phone, href: `tel:${info.phone}`, color: 'blue' },
    { icon: MessageCircle, label: t.whatsapp, value: info.whatsapp, href: `https://wa.me/${info.whatsapp?.replace(/[^0-9]/g, '')}`, color: 'green' },
    { icon: Mail, label: t.email, value: info.email, href: `mailto:${info.email}`, color: 'purple' },
    { icon: MapPin, label: t.address, value: getAddress(), href: null, color: 'red' },
    { icon: Clock, label: t.hours, value: getHours(), href: null, color: 'amber' }
  ];

  const socialIcons = [
    { icon: Facebook, href: info.social?.facebook, label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: Instagram, href: info.social?.instagram, label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: Twitter, href: info.social?.twitter, label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: Youtube, href: info.social?.youtube, label: 'YouTube', color: 'hover:text-red-500' },
    { icon: Linkedin, href: info.social?.linkedin, label: 'LinkedIn', color: 'hover:text-blue-600' }
  ];

  const colorMap = {
    blue: { bg: isDark ? 'bg-blue-500/20' : 'bg-blue-500/10', text: 'text-blue-500' },
    green: { bg: isDark ? 'bg-green-500/20' : 'bg-green-500/10', text: 'text-green-500' },
    purple: { bg: isDark ? 'bg-purple-500/20' : 'bg-purple-500/10', text: 'text-purple-500' },
    red: { bg: isDark ? 'bg-red-500/20' : 'bg-red-500/10', text: 'text-red-500' },
    amber: { bg: isDark ? 'bg-amber-500/20' : 'bg-amber-500/10', text: 'text-amber-500' }
  };

  return (
    <section 
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-slate-900'
          : 'bg-slate-100'
      }`}
      id="contact"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-[#D4AF37]/10' : 'bg-[#D4AF37]/20'}`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'}`} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className={`inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#FCD34D]'
                : 'bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#B8860B]'
            }`}
          >
            {t.badge}
          </motion.span>
          
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.title}
          </h2>
          
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {contactCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-white border-slate-200 hover:shadow-lg'
                } ${card.href ? 'cursor-pointer' : ''}`}
                onClick={() => card.href && window.open(card.href, '_blank')}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[card.color].bg}`}>
                  <card.icon className={`w-6 h-6 ${colorMap[card.color].text}`} />
                </div>
                <div>
                  <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {card.label}
                  </div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {card.value}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className={`p-5 rounded-2xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
              }`}
            >
              <div className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.followUs}
              </div>
              <div className="flex gap-3">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isDark 
                        ? 'bg-white/10 text-slate-400'
                        : 'bg-slate-100 text-slate-500'
                    } ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className={`p-8 rounded-3xl border ${
              isDark 
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t.formTitle}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white focus:border-[#D4AF37]'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#D4AF37]'
                    } outline-none`}
                    data-testid="contact-name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.yourPhone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white focus:border-[#D4AF37]'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#D4AF37]'
                    } outline-none`}
                    data-testid="contact-phone"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.message}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                      isDark 
                        ? 'bg-white/5 border-white/20 text-white focus:border-[#D4AF37]'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#D4AF37]'
                    } outline-none`}
                    data-testid="contact-message"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 font-bold rounded-xl shadow-lg shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all flex items-center justify-center gap-2"
                  data-testid="contact-submit"
                >
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t.send}</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
