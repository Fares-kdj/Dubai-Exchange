import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Plane, Send, Search, Sparkles, ArrowRight } from 'lucide-react';

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const services = [
    {
      icon: Plane,
      titleKey: 'services.travelerBooking.title',
      descKey: 'services.travelerBooking.description',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
      iconColor: isDark ? 'text-blue-400' : 'text-blue-600',
      delay: 0.2,
      link: '/traveler-booking'
    },
    {
      icon: Send,
      titleKey: 'services.moneyTransfers.title',
      descKey: 'services.moneyTransfers.description',
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50',
      iconColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
      delay: 0.3,
      link: '/transfers'
    },
    {
      icon: Search,
      titleKey: 'services.trackOrder.title',
      descKey: 'services.trackOrder.description',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: isDark ? 'bg-purple-900/30' : 'bg-purple-50',
      iconColor: isDark ? 'text-purple-400' : 'text-purple-600',
      delay: 0.4,
      link: '/track-order'
    },
    {
      icon: Sparkles,
      titleKey: 'services.comingSoon.title',
      descKey: 'services.comingSoon.description',
      gradient: 'from-amber-500 to-orange-500',
      bgColor: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
      iconColor: isDark ? 'text-amber-400' : 'text-amber-600',
      delay: 0.5,
      comingSoon: true
    }
  ];

  return (
    <section id="services" className={`py-20 md:py-32 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-800' : 'bg-white'
    }`}>
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className={`px-4 py-2 border rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-[#D4AF37]/20 border-[#D4AF37]/30 text-slate-200'
                : 'bg-gradient-to-r from-[#D4AF37]/10 to-[#FCD34D]/10 border-[#D4AF37]/20 text-slate-700'
            }`}>
              {t('services.subtitle')}
            </span>
          </motion.div>
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('services.title')}
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: service.delay }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
              data-testid={`service-card-${index}`}
            >
              {/* Card */}
              <div className={`h-full border-2 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden ${
                isDark 
                  ? 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}>
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Coming Soon Badge */}
                {service.comingSoon && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t('services.comingSoon.title')}
                  </div>
                )}

                <div className="relative z-10">
                  {/* Animated Icon */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -10, 10, -10, 0]
                    }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow duration-300`}
                  >
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </motion.div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-3 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {t(service.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t(service.descKey)}
                  </p>

                  {/* Action Link */}
                  {!service.comingSoon && (
                    <motion.button
                      onClick={() => navigate(service.link)}
                      className={`flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all cursor-pointer ${
                        isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                      whileHover={{ x: 5 }}
                      data-testid={`service-link-${index}`}
                    >
                      {t('common.learnMore')}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
