import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { COMPANY } from '@/config/assets';
import { useBranding } from '@/context/BrandingContext';
import { Shield, Zap, Globe, Plane, CreditCard, Search, Send, Wallet, ArrowLeftRight, MapPin, Package } from 'lucide-react';

// Hero background videos - using local assets
const HERO_ASSETS = {
  dark: '/assets/hero-dark.mp4',
  light: '/assets/hero-light.mp4'
};

const CBI_LOGO_URL = '/assets/external/cbi-logo.png';

// USDT Icon Component
const USDTIcon = ({ className }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor">
    <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm0 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" />
    <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" />
  </svg>
);

const content = {
  ar: {
    name: COMPANY.nameAr,
    slogan: COMPANY.sloganAr,
    licensed: 'مرخصة رسمياً',
    instant: 'خدمة فورية',
    countries: '+50 دولة',
    cbiTitle: 'مرخصة من البنك المركزي العراقي - شركة دبي العالمية للصرافة',
    trackOrder: 'تتبع طلبك'
  },
  en: {
    name: COMPANY.nameEn,
    slogan: COMPANY.sloganEn,
    licensed: 'Licensed',
    instant: 'Instant Service',
    countries: '50+ Countries',
    cbiTitle: 'Licensed by Central Bank of Iraq',
    trackOrder: 'Track Your Order'
  },
  ku: {
    name: COMPANY.nameKu,
    slogan: COMPANY.sloganKu,
    licensed: 'مۆڵەتپێدراو',
    instant: 'خزمەتگوزاري يەکجار',
    countries: '+٥٠ وڵات',
    cbiTitle: 'مۆڵەتدار لە بانکی ناوەندیی عێراق',
    trackOrder: 'بەدواداچوونی داواکاری'
  }
};

export const HeroSection3D = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const { logoLight, logoDark } = useBranding();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const lucideIconMap = {
    Plane: Plane,
    Send: Send,
    CreditCard: CreditCard,
    Globe: Globe,
    Wallet: Wallet,
    ArrowLeftRight: ArrowLeftRight,
    MapPin: MapPin,
    Package: Package,
    USDTIcon: USDTIcon // Add custom icon to the map
  };

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/cms/services?active_only=true&t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          // Filter only hero pinned services
          const pinned = data.filter(s => s.is_hero_pinned);

          // Map to the format needed for Hero icons and animations
          const mapped = pinned.map((s, index) => {
            const gradients = [
              'from-amber-500 to-yellow-600',
              'from-blue-500 to-indigo-600',
              'from-teal-500 to-emerald-600',
              'from-purple-500 to-violet-600'
            ];
            const glows = [
              'hover:shadow-amber-500/50',
              'hover:shadow-blue-500/50',
              'hover:shadow-teal-500/50',
              'hover:shadow-purple-500/50'
            ];

            return {
              id: s.service_id,
              icon: lucideIconMap[s.icon] || Plane, // Default to Plane if icon not found
              labelAr: s.name_ar,
              labelEn: s.name_en,
              labelKu: s.name_ku,
              link: s.route,
              gradient: gradients[index % gradients.length],
              hoverGlow: glows[index % glows.length],
              floatDelay: index * 0.5,
              floatDuration: 3 + Math.random()
            };
          });
          setServices(mapped);
        }
      } catch (err) {
        console.error('Error fetching hero services:', err);
      }
      setLoading(false);
    };

    fetchServices();
  }, [API_URL]);

  const handleHeroServiceClick = (e, link) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!link) return;

    // Normalize link
    let finalLink = link;
    if (!link.startsWith('http') && !link.startsWith('/')) {
      finalLink = '/' + link;
    }

    if (finalLink.startsWith('http')) {
      window.open(finalLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(finalLink);
    }
  };

  const t = content[currentLanguage] || content.ar;

  const getLabel = (service) => {
    if (currentLanguage === 'ar') return service.labelAr;
    if (currentLanguage === 'ku') return service.labelKu;
    return service.labelEn;
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background Image/Video Container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Hero Background - Using images (easy to swap with video later) */}
        <div className={`absolute inset-0 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
          {/* Dark Mode Background Video */}
          <video
            src={HERO_ASSETS.dark}
            autoPlay
            muted
            loop
            playsInline
            fetchpriority="high"
            className={`absolute top-0 right-0 w-full h-1/2 lg:h-full object-cover lg:object-right object-right transition-opacity duration-700 scale-100 lg:scale-100 origin-right-top ${isDark ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Light Mode Background Video */}
          <video
            src={HERO_ASSETS.light}
            autoPlay
            muted
            loop
            playsInline
            fetchpriority="high"
            className={`absolute top-0 right-0 w-full h-1/2 lg:h-full object-cover lg:object-right object-right transition-opacity duration-700 scale-100 lg:scale-100 origin-right-top ${isDark ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* Gradient Overlay for text readability */}
        <div className={`absolute inset-0 ${isDark
          ? 'bg-gradient-to-l from-transparent via-slate-900/40 to-slate-900/80'
          : 'bg-gradient-to-l from-transparent via-white/30 to-white/70'
          }`} />
      </div>

      {/* Content Container - Desktop: Two-column grid with content LEFT-aligned for ALL languages */}
      <div className="relative z-10 min-h-screen" dir="ltr">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 min-h-screen">
          {/* Desktop: Grid layout | Mobile: Flex centered */}
          <div className="min-h-[calc(100vh-7rem)] flex items-center lg:grid lg:grid-cols-[minmax(420px,560px)_1fr]">
            {/* Content Column - Always on LEFT for desktop, regardless of RTL/LTR */}
            <div className="w-full lg:max-w-[560px]">
              {/* Inner content wrapper - respects text direction for Arabic/Kurdish */}
              <div className={isArabic || isKurdish ? 'text-right' : 'text-left'} dir={isArabic || isKurdish ? 'rtl' : 'ltr'}>
                {/* CBI Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border mb-8 ${isDark
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'
                    : 'bg-amber-100/80 border-amber-300 text-amber-800'
                    }`}
                >
                  <img
                    src={CBI_LOGO_URL}
                    alt="البنك المركزي العراقي - ترخيص شركة دبي العالمية للصرافة"
                    loading="eager"
                    fetchpriority="high"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-semibold text-sm">{t.cbiTitle}</span>
                </motion.div>

                {/* Company Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 hidden sm:block"
                >
                  <img
                    src={isDark ? logoDark : logoLight}
                    alt="شعار شركة دبي العالمية للصرافة والتحويل المالي"
                    className="h-16 object-contain"
                    style={!isDark ? { filter: 'sepia(30%) saturate(150%)' } : {}}
                  />
                </motion.div>

                {/* Company Name */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'
                    }`}
                >
                  {t.name}
                </motion.h1>

                {/* Slogan */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`text-lg md:text-xl mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                >
                  {t.slogan}
                </motion.p>

                {/* ==========================================================
                    ORIGINAL ANIMATED TRACK ORDER BUTTON (Commented out)
                    To restore animation: uncomment this and remove the static button below
                <motion.button
                  onClick={() => navigate('/track-order')}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: [0, -15, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{
                    opacity: { delay: 0.6, duration: 0.5 },
                    y: {
                      delay: 0,
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    scale: {
                      delay: 0,
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -20,
                    transition: { type: "spring", stiffness: 400, damping: 15 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative w-full flex items-center justify-center gap-4 px-6 py-5 mb-6 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${isDark
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 hover:shadow-[#D4AF37]/50'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 hover:shadow-amber-500/50'
                    } shadow-xl hover:shadow-2xl`}
                  style={{ zIndex: 30 }}
                  data-testid="hero-track-order"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      opacity: [0, 0.4, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  <div className="w-12 h-12 rounded-xl bg-slate-900/20 flex items-center justify-center">
                    <Search className="w-6 h-6" />
                  </div>

                  <span className="relative z-10">{t.trackOrder}</span>

                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-slate-900"
                  >
                    →
                  </motion.div>
                </motion.button>
                ========================================================== */}

                {/* Static Track Order Button */}
                <button
                  onClick={() => navigate('/track-order')}
                  className={`group relative w-full flex items-center justify-center gap-4 px-6 py-5 mb-6 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden ${isDark
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 hover:shadow-[#D4AF37]/50'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 hover:shadow-amber-500/50'
                    } shadow-xl hover:shadow-2xl`}
                  style={{ zIndex: 30 }}
                  data-testid="hero-track-order"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-slate-900/20 flex items-center justify-center">
                    <Search className="w-6 h-6" />
                  </div>

                  <span className="relative z-10">{t.trackOrder}</span>

                  {/* Shimmer Effect (Hover only) */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

                  {/* Static Arrow */}
                  <div className="text-slate-900 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </button>


                {/* Main Service Buttons with Strong Floating Effect - Now supports more than 4 */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-10 relative z-20">
                  {loading ? (
                    // Loading skeleton
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="h-24 rounded-2xl bg-slate-800/50 animate-pulse" />
                    ))
                  ) : (
                    services.map((service, index) => (
                      <React.Fragment key={service.id}>
                        {/* ==========================================================
                            ORIGINAL ANIMATED SERVICE BUTTON (Commented out)
                            To restore animation: uncomment this and remove the static button below
                        <motion.button
                          onClick={(e) => handleHeroServiceClick(e, service.link)}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{
                            opacity: 1,
                            y: [0, -12, 0, -8, 0],
                            scale: [1, 1.02, 1, 1.01, 1],
                            rotate: [0, 1, 0, -1, 0]
                          }}
                          transition={{
                            opacity: { delay: 0.8 + index * 0.1, duration: 0.5 },
                            y: {
                              delay: index * 0.3,
                              duration: 2.5 + index * 0.3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            },
                            scale: {
                              delay: index * 0.3,
                              duration: 2.5 + index * 0.3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            },
                            rotate: {
                              delay: index * 0.3,
                              duration: 3 + index * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                          whileHover={{
                            scale: 1.1,
                            y: -20,
                            rotate: 0,
                            transition: { type: "spring", stiffness: 400, damping: 15 }
                          }}
                          whileTap={{ scale: 0.92 }}
                          className={`group relative flex flex-col items-center gap-3 px-4 py-5 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${isDark
                            ? 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/50'
                            : 'bg-white/90 hover:bg-white text-slate-900 border border-slate-200'
                            } backdrop-blur-md shadow-xl hover:shadow-2xl ${service.hoverGlow}`}
                          style={{
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                            cursor: 'pointer',
                            zIndex: 30
                          }}
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

                          <div className="absolute inset-0 pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${service.gradient}`}
                                style={{
                                  left: `${20 + i * 15}%`,
                                  top: `${30 + (i % 3) * 20}%`
                                }}
                                animate={{
                                  y: [-10, -30, -10],
                                  opacity: [0, 1, 0],
                                  scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  delay: i * 0.2,
                                  repeat: Infinity
                                }}
                              />
                            ))}
                          </div>

                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg flex-shrink-0 relative`}>
                            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <service.icon className="w-7 h-7 text-white relative z-10" />
                          </div>

                          <span className="text-sm font-bold relative z-10 text-center">
                            {getLabel(service)}
                          </span>

                          <motion.div
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} rounded-b-2xl`}
                            initial={{ scaleX: 0, opacity: 0 }}
                            whileHover={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.button>
                        ========================================================== */}

                        {/* Static Service Button */}
                        <button
                          onClick={(e) => handleHeroServiceClick(e, service.link)}
                          className={`group relative flex flex-col items-center gap-3 px-4 py-5 rounded-2xl font-bold transition-all duration-300 overflow-hidden ${isDark
                            ? 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/50'
                            : 'bg-white/90 hover:bg-white text-slate-900 border border-slate-200'
                            } backdrop-blur-md shadow-xl hover:-translate-y-2 hover:shadow-2xl ${service.hoverGlow}`}
                          style={{
                            cursor: 'pointer',
                            zIndex: 30
                          }}
                        >
                          {/* Shimmer Effect (Hover only) */}
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

                          {/* Static particles (just for decoration, no animation) */}
                          <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${service.gradient}`}
                                style={{
                                  left: `${30 + i * 20}%`,
                                  top: `${40 + (i % 2) * 20}%`
                                }}
                              />
                            ))}
                          </div>

                          {/* Icon Container */}
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg flex-shrink-0 relative transition-transform group-hover:scale-110`}>
                            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <service.icon className="w-7 h-7 text-white relative z-10" />
                          </div>

                          <span className="text-sm font-bold relative z-10 text-center">
                            {getLabel(service)}
                          </span>

                          {/* Bottom Border */}
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300`}
                          />
                        </button>
                      </React.Fragment>
                    ))
                  )}
                </div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="flex flex-wrap items-center gap-4 lg:gap-6"
                >
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-white/60 text-slate-700'
                    } backdrop-blur-sm`}>
                    <Shield className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <span className="text-sm font-medium">{t.licensed}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-white/60 text-slate-700'
                    } backdrop-blur-sm`}>
                    <Zap className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-amber-600'}`} />
                    <span className="text-sm font-medium">{t.instant}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-slate-800/60 text-slate-300' : 'bg-white/60 text-slate-700'
                    } backdrop-blur-sm`}>
                    <Globe className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className="text-sm font-medium">{t.countries}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right column - Empty space for hero visual (the background image) */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${isDark ? 'border-slate-600' : 'border-slate-400'
          }`}>
          <div className={`w-1.5 h-3 rounded-full ${isDark ? 'bg-[#D4AF37]' : 'bg-amber-500'
            }`} />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection3D;
