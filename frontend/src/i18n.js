import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        services: 'خدماتنا',
        converter: 'محول العملات',
        track: 'تتبع الطلب',
        contact: 'تواصل معنا'
      },
      hero: {
        title: 'خير بغداد للصرافة',
        subtitle: 'خدمات صرافة موثوقة وسريعة',
        description: 'نوفر لك أفضل خدمات التحويلات المالية وحجز العملات بكل أمان وشفافية',
        ctaBooking: 'حجز دولار للمسافرين',
        ctaTransfer: 'التحويلات المالية'
      },
      converter: {
        title: 'محول العملات',
        from: 'من',
        to: 'إلى',
        amount: 'المبلغ',
        result: 'النتيجة',
        lastUpdate: 'آخر تحديث',
        convert: 'تحويل'
      },
      services: {
        title: 'خدماتنا',
        subtitle: 'نقدم مجموعة متكاملة من الخدمات المالية',
        travelerBooking: {
          title: 'حجز دولار للمسافرين',
          description: 'احجز الدولار الأمريكي لسفرك بأسعار تنافسية وبطريقة آمنة'
        },
        moneyTransfers: {
          title: 'التحويلات المالية',
          description: 'تحويلات محلية ودولية سريعة وآمنة لجميع أنحاء العالم'
        },
        trackOrder: {
          title: 'تتبع الطلبات',
          description: 'تابع حالة طلبك في أي وقت ومن أي مكان'
        },
        comingSoon: {
          title: 'خدمات قادمة',
          description: 'المزيد من الخدمات المالية المتميزة قريباً'
        }
      },
      trust: {
        title: 'لماذا تختارنا',
        licensed: {
          title: 'مرخصة ورسمية',
          description: 'شركة مرخصة ومعتمدة'
        },
        secure: {
          title: 'أمان عالي',
          description: 'حماية كاملة لمعاملاتك'
        },
        fast: {
          title: 'معالجة سريعة',
          description: 'خدمات فورية وفعالة'
        },
        support: {
          title: 'دعم العملاء',
          description: 'فريق دعم متاح دائماً'
        }
      },
      contact: {
        title: 'تواصل معنا',
        phone: 'الهاتف',
        whatsapp: 'واتساب',
        email: 'البريد الإلكتروني',
        address: 'العنوان'
      },
      footer: {
        rights: 'جميع الحقوق محفوظة',
        privacy: 'سياسة الخصوصية',
        terms: 'الشروط والأحكام'
      },
      common: {
        getStarted: 'ابدأ الآن',
        learnMore: 'اعرف المزيد',
        readMore: 'قراءة المزيد'
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: 'Home',
        services: 'Services',
        converter: 'Currency Converter',
        track: 'Track Order',
        contact: 'Contact Us'
      },
      hero: {
        title: 'Khair Baghdad for Exchange',
        subtitle: 'Trusted and Fast Exchange Services',
        description: 'We provide the best money transfer and currency booking services with complete security and transparency',
        ctaBooking: 'Traveler USD Booking',
        ctaTransfer: 'Money Transfers'
      },
      converter: {
        title: 'Currency Converter',
        from: 'From',
        to: 'To',
        amount: 'Amount',
        result: 'Result',
        lastUpdate: 'Last Update',
        convert: 'Convert'
      },
      services: {
        title: 'Our Services',
        subtitle: 'We offer a complete set of financial services',
        travelerBooking: {
          title: 'Traveler USD Booking',
          description: 'Book US dollars for your trip at competitive rates with complete security'
        },
        moneyTransfers: {
          title: 'Money Transfers',
          description: 'Fast and secure local and international transfers worldwide'
        },
        trackOrder: {
          title: 'Track Orders',
          description: 'Track your order status anytime, anywhere'
        },
        comingSoon: {
          title: 'Coming Soon',
          description: 'More premium financial services coming soon'
        }
      },
      trust: {
        title: 'Why Choose Us',
        licensed: {
          title: 'Licensed & Official',
          description: 'Licensed and certified company'
        },
        secure: {
          title: 'High Security',
          description: 'Complete protection for your transactions'
        },
        fast: {
          title: 'Fast Processing',
          description: 'Instant and efficient services'
        },
        support: {
          title: 'Customer Support',
          description: 'Support team always available'
        }
      },
      contact: {
        title: 'Contact Us',
        phone: 'Phone',
        whatsapp: 'WhatsApp',
        email: 'Email',
        address: 'Address'
      },
      footer: {
        rights: 'All Rights Reserved',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions'
      },
      common: {
        getStarted: 'Get Started',
        learnMore: 'Learn More',
        readMore: 'Read More'
      }
    }
  },
  ku: {
    translation: {
      nav: {
        home: 'سەرەکی',
        services: 'خزمەتگوزاریەکان',
        converter: 'گۆڕینی دراو',
        track: 'بەدواداچوونی داواکاری',
        contact: 'پەیوەندی'
      },
      hero: {
        title: 'خەیر بەغداد بۆ گۆڕینەوە',
        subtitle: 'خزمەتگوزاریی گۆڕینەوەی متمانەپێکراو و خێرا',
        description: 'باشترین خزمەتگوزاریی گواستنەوەی پارە و حیجزکردنی دراو پێشکەش دەکەین',
        ctaBooking: 'حیجزکردنی دۆلار بۆ گەشتیاران',
        ctaTransfer: 'گواستنەوەی پارە'
      },
      converter: {
        title: 'گۆڕینی دراو',
        from: 'لە',
        to: 'بۆ',
        amount: 'بڕ',
        result: 'ئەنجام',
        lastUpdate: 'دوایین نوێکردنەوە',
        convert: 'گۆڕین'
      },
      services: {
        title: 'خزمەتگوزاریەکانمان',
        subtitle: 'کۆمەڵێک تەواوی خزمەتگوزاری دارایی پێشکەش دەکەین',
        travelerBooking: {
          title: 'حیجزکردنی دۆلار بۆ گەشتیاران',
          description: 'دۆلار حیجز بکە بۆ گەشتەکەت بە نرخی کێبڕکێ'
        },
        moneyTransfers: {
          title: 'گواستنەوەی پارە',
          description: 'گواستنەوەی خێرا و پارێزراو لە ناوخۆ و نێودەوڵەتی'
        },
        trackOrder: {
          title: 'بەدواداچوونی داواکاری',
          description: 'بەدواداچوونی داواکاریەکەت لە هەر کات و شوێنێک'
        },
        comingSoon: {
          title: 'بەم زووانە',
          description: 'خزمەتگوزاریی زیاتری دارایی بەم زووانە'
        }
      },
      trust: {
        title: 'بۆچی ئێمە هەڵدەبژێریت',
        licensed: {
          title: 'مۆڵەتدار و فەرمی',
          description: 'کۆمپانیای مۆڵەتدار و پشتڕاستکراو'
        },
        secure: {
          title: 'پاراستنی بەرز',
          description: 'پاراستنی تەواو بۆ مامەڵەکانت'
        },
        fast: {
          title: 'پرۆسەی خێرا',
          description: 'خزمەتگوزاری خێرا و کارا'
        },
        support: {
          title: 'پشتگیری کڕیار',
          description: 'تیمی پشتگیری هەمیشە ئامادەیە'
        }
      },
      contact: {
        title: 'پەیوەندی',
        phone: 'تەلەفۆن',
        whatsapp: 'واتساپ',
        email: 'ئیمەیڵ',
        address: 'ناونیشان'
      },
      footer: {
        rights: 'هەموو مافەکان پارێزراون',
        privacy: 'سیاسەتی تایبەتێتی',
        terms: 'مەرج و ڕێککەوتن'
      },
      common: {
        getStarted: 'دەست پێبکە',
        learnMore: 'زیاتر بزانە',
        readMore: 'زیاتر بخوێنەوە'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
