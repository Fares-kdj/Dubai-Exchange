import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const contactInfo = [
    {
      icon: Phone,
      titleKey: 'contact.phone',
      value: '+964 XXX XXX XXXX',
      link: 'tel:+964XXXXXXXXX',
      color: 'from-blue-500 to-cyan-500',
      bgColor: isDark ? 'bg-blue-900/30' : 'bg-blue-50'
    },
    {
      icon: MessageCircle,
      titleKey: 'contact.whatsapp',
      value: '+964 XXX XXX XXXX',
      link: 'https://wa.me/964XXXXXXXXX',
      color: 'from-green-500 to-emerald-500',
      bgColor: isDark ? 'bg-green-900/30' : 'bg-green-50'
    },
    {
      icon: Mail,
      titleKey: 'contact.email',
      value: 'info@khairbaghdad.com',
      link: 'mailto:info@khairbaghdad.com',
      color: 'from-purple-500 to-pink-500',
      bgColor: isDark ? 'bg-purple-900/30' : 'bg-purple-50'
    },
    {
      icon: MapPin,
      titleKey: 'contact.address',
      value: 'بغداد، العراق',
      link: null,
      color: 'from-amber-500 to-orange-500',
      bgColor: isDark ? 'bg-amber-900/30' : 'bg-amber-50'
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-500' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-600' }
  ];

  return (
    <section id="contact" className={`py-20 md:py-32 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-cyan-100/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('contact.title')}
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            نحن هنا لخدمتك دائماً
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                data-testid={`contact-card-${index}`}
              >
                <div className={`border-2 rounded-2xl p-6 hover:shadow-xl transition-all h-full ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}>
                  <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <motion.div 
                      className={`w-16 h-16 ${info.bgColor} rounded-2xl flex items-center justify-center mb-4`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <info.icon className={`w-8 h-8 ${isDark ? 'text-slate-200' : 'text-slate-700'}`} />
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t(info.titleKey)}
                    </h3>
                    
                    {/* Value */}
                    {info.link ? (
                      <a
                        href={info.link}
                        className={`text-sm font-medium transition-colors ${
                          isDark ? 'text-white hover:text-slate-300' : 'text-slate-900 hover:text-slate-700'
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{info.value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              تابعنا على مواقع التواصل
            </h3>
            <div className="flex justify-center items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center hover:text-white ${social.color} transition-all duration-300 ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                  aria-label={social.label}
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
