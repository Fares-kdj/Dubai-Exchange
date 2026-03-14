// Asset URLs for the Landing Page
export const ASSETS = {
  // Hero Images
  heroAirplane: '/assets/external/hero-airplane.png',
  heroCardHand: '/assets/external/hero-card-hand.png',

  // USDT Image
  usdtCoin: '/assets/external/usdt-coin-opt.png',

  // Real Device Screenshots - Dark Mode
  devicePhoneDark: '/assets/device-phone-dark.webp',
  deviceTabletDark: '/assets/device-tablet-dark.webp',
  deviceLaptopDark: '/assets/device-laptop-dark.webp',

  // Real Device Screenshots - Light Mode
  devicePhoneLight: '/assets/device-phone-light.png',
  deviceTabletLight: '/assets/device-tablet-light.png',
  deviceLaptopLight: '/assets/device-laptop-light.png',

  // Global Network
  globalNetwork: '/assets/external/global-network.webp',

  // Company Logos
  logoColor: '/assets/external/logo-black.svg',
  logoWhite: '/assets/external/logo-white.svg',
  logoBlack: '/assets/external/logo-black.svg',
  iconmarkWhite: '/assets/external/iconmark-white.svg',
  iconmarkBlack: '/assets/external/iconmark-black.svg',

  // Partner Logos
  partners: {
    altayf: '/assets/external/altayf.png',
    fib: '/assets/external/fib.png',
    rasheed: '/assets/external/rasheed.png',
    tbi: '/assets/external/tbi.webp',
    rafidain: '/assets/external/rafidain.svg',
    zaincash: '/assets/external/zaincash.webp'
  },

  // Payment Card
  cardSvg: '/assets/external/card.svg',
  cardTexture: '/assets/external/card-texture.png',

  // Central Bank of Iraq
  cbiLogo: '/assets/external/cbi-logo.png',
  cbiBuilding1: '/assets/external/cbi-building-01.webp',
  cbiBuilding2: '/assets/external/cbi-building-02.webp',
  cbiBuilding3: '/assets/external/cbi-building-03.jpg'
};

// Company Info
export const COMPANY = {
  nameAr: 'شركة دبي العالمية للصرافة',
  nameEn: 'Dubai International for Exchange',
  nameKu: 'کۆمپانیای دوبەی نێودەوڵەتی بۆ ئاڵوگۆڕی دراو',
  sloganAr: 'خدمات مالية آمنة وسريعة للمسافرين والشركات',
  sloganEn: 'Secure and Fast Financial Services for Travelers and Businesses',
  sloganKu: 'خزمەتگوزارییە دارایییە پارێزراو و خێراکان بۆ گەشتیاران و کۆمپانياكان'
};

// Partners list
export const PARTNERS = [
  { id: 'zaincash', nameAr: 'زين كاش', nameEn: 'Zain Cash', nameKu: 'زین کاش', logo: ASSETS.partners.zaincash },
  { id: 'fib', nameAr: 'المصرف العراقي الأول', nameEn: 'First Iraqi Bank', nameKu: 'بانکی یەکەمی عێراق', logo: ASSETS.partners.fib },
  { id: 'tbi', nameAr: 'المصرف العراقي للتجارة', nameEn: 'Trade Bank of Iraq', nameKu: 'بانکی بازرگانیی عێراق', logo: ASSETS.partners.tbi },
  { id: 'altayf', nameAr: 'مصرف الطيف الإسلامي', nameEn: 'Al-Tayf Islamic Bank', nameKu: 'بانکی ئیسلامیی ئەلتەیف', logo: ASSETS.partners.altayf },
  { id: 'rasheed', nameAr: 'مصرف الرشيد', nameEn: 'Rasheed Bank', nameKu: 'بانکی ڕەشيد', logo: ASSETS.partners.rasheed },
  { id: 'rafidain', nameAr: 'مصرف الرافدين', nameEn: 'Rafidain Bank', nameKu: 'بانکی ڕافيدەين', logo: ASSETS.partners.rafidain }
];

// Services
export const SERVICES = [
  {
    id: 'usd-booking',
    titleAr: 'حجز الدولار للمسافرين',
    titleEn: 'USD Booking for Travelers',
    titleKu: 'نۆرەکردنی دۆلار بۆ گەشتیاران',
    descAr: 'احجز دولاراتك بسهولة قبل السفر',
    descEn: 'Book your dollars easily before traveling',
    descKu: 'بە ئاسانی دۆلارەکانت نۆرە بکە پێش گەشتکردن',
    icon: 'plane',
    link: '/traveler-booking'
  },
  {
    id: 'transfers',
    titleAr: 'التحويلات المالية',
    titleEn: 'Money Transfers',
    titleKu: 'گواستنەوەی پارە',
    descAr: 'تحويلات محلية ودولية سريعة وآمنة',
    descEn: 'Fast and secure local and international transfers',
    descKu: 'گواستنەوەی خێرا و پارێزراو لە ناوخۆ و نێودەوڵەتی',
    icon: 'send',
    link: '/transfers'
  },
  {
    id: 'card-topup',
    titleAr: 'تعبئة البطاقات',
    titleEn: 'Card Top-up',
    titleKu: 'پڕکردنەوەی کارت',
    descAr: 'اشحن بطاقاتك المصرفية بسهولة',
    descEn: 'Top up your bank cards easily',
    descKu: 'بە ئاسانی کارتە بانکییەکانت پڕبکەوە',
    icon: 'credit-card',
    link: '/card-topup'
  },
  {
    id: 'usdt',
    titleAr: 'شحن USDT',
    titleEn: 'USDT Recharge',
    titleKu: 'پڕکردنەوەی USDT',
    descAr: 'خدمات العملات الرقمية',
    descEn: 'Digital currency services',
    descKu: 'خزمەتگوزارییەکانی دراوی ديجيتاڵ',
    icon: 'coins',
    link: '/usdt'
  }
];
