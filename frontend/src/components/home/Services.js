import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Plane, Send, Search, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Plane,
      titleKey: 'services.travelerBooking.title',
      descKey: 'services.travelerBooking.description',
      gradient: 'from-[#D4AF37] to-[#FFD700]',
      delay: 0.2
    },
    {
      icon: Send,
      titleKey: 'services.moneyTransfers.title',
      descKey: 'services.moneyTransfers.description',
      gradient: 'from-[#FFD700] to-[#D4AF37]',
      delay: 0.3
    },
    {
      icon: Search,
      titleKey: 'services.trackOrder.title',
      descKey: 'services.trackOrder.description',
      gradient: 'from-[#D4AF37] to-[#C4A000]',
      delay: 0.4
    },
    {
      icon: Sparkles,
      titleKey: 'services.comingSoon.title',
      descKey: 'services.comingSoon.description',
      gradient: 'from-gray-600 to-gray-800',
      delay: 0.5,
      comingSoon: true
    }
  ];

  return (
    <section id="services" className="py-20 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMTIsIDE3NSwgNTUsIDAuMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              {t('services.title')}
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
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
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-zinc-900/90 to-black/90 border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-all duration-500 backdrop-blur-sm relative overflow-hidden">
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:to-transparent transition-all duration-500" />
                
                <CardContent className="p-6 relative z-10">
                  {/* Icon with 3D Effect */}
                  <motion.div
                    whileHover={{ 
                      rotateY: 15,
                      rotateX: 15,
                      scale: 1.1
                    }}
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-4 mb-6 shadow-lg shadow-${service.comingSoon ? 'gray' : '[#D4AF37]'}/30 group-hover:shadow-${service.comingSoon ? 'gray' : '[#D4AF37]'}/50 transition-all duration-500`}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >
                    <service.icon className="w-full h-full text-black" />
                  </motion.div>

                  {/* Coming Soon Badge */}
                  {service.comingSoon && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gray-700/80 backdrop-blur-sm rounded-full text-xs text-gray-300">
                      {t('services.comingSoon.title')}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {t(service.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {t(service.descKey)}
                  </p>

                  {/* Action Button */}
                  {!service.comingSoon && (
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="text-[#D4AF37] text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      {t('common.learnMore')}
                      <span className="text-lg">→</span>
                    </motion.button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
