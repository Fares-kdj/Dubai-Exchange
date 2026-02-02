import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Zap, HeadphonesIcon, Award } from 'lucide-react';

const TrustSection = () => {
  const { t } = useTranslation();

  const trustPoints = [
    {
      icon: Award,
      titleKey: 'trust.licensed.title',
      descKey: 'trust.licensed.description',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    {
      icon: Shield,
      titleKey: 'trust.secure.title',
      descKey: 'trust.secure.description',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Zap,
      titleKey: 'trust.fast.title',
      descKey: 'trust.fast.description',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: HeadphonesIcon,
      titleKey: 'trust.support.title',
      descKey: 'trust.support.description',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.1),transparent_70%)]" />
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
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-slate-900">
            {t('trust.title')}
          </h2>
        </motion.div>

        {/* Trust Points Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
              data-testid={`trust-point-${index}`}
            >
              <div className="text-center bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300">
                {/* Animated Icon Container */}
                <motion.div
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, -5, 0]
                  }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl ${point.bgColor} relative overflow-hidden`}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <point.icon className="w-10 h-10 relative z-10 text-slate-700" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
                  {t(point.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t(point.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.5 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] bg-clip-text text-transparent mb-2"
              >
                10,000+
              </motion.div>
              <div className="text-slate-300 text-sm">عميل راضٍ</div>
            </div>
            <div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.6 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] bg-clip-text text-transparent mb-2"
              >
                15+
              </motion.div>
              <div className="text-slate-300 text-sm">سنوات خبرة</div>
            </div>
            <div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.7 }}
                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] bg-clip-text text-transparent mb-2"
              >
                50+
              </motion.div>
              <div className="text-slate-300 text-sm">دولة</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
