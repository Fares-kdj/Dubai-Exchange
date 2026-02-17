// Asset URLs for the Landing Page
export const ASSETS = {
  // Hero Images
  heroAirplane: 'https://static.prod-images.emergentagent.com/jobs/88687776-cef9-451a-ac8a-aacc94344da7/images/7314ba8b91b5f4b4836cf6ff75f48969acd464ef67f61e137f36d941651eee88.png',
  heroCardHand: 'https://static.prod-images.emergentagent.com/jobs/88687776-cef9-451a-ac8a-aacc94344da7/images/87915492b24dcf06c1d9cce0bde468a26f3dba1bd4fcd125f9595931f35b209c.png',
  
  // USDT Image
  usdtCoin: 'https://customer-assets.emergentagent.com/job_money-transfer-149/artifacts/232ggie3_3D%20RENDER_.png',

  // Company Logos
  logoColor: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/hhjmh7ag_logo_color.svg',
  logoWhite: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/uoze1awx_logo_white.svg',
  logoBlack: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/13lpi34u_logo_black.svg',
  iconmarkWhite: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/0tukplwt_iconmark_white.svg',
  iconmarkBlack: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/f1y0egt0_iconmark_black.svg',

  // Partner Logos
  partners: {
    altayf: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/1u4b8k3g_altayf.png',
    fib: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/yjqyzxwg_fib.png',
    rasheed: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/7r0xdqpf_rasheed.png',
    tbi: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/ssg7bube_tbi.png',
    rafidain: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/ssdr8yqt_rafidain.svg',
    zaincash: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/bz9sfr3h_zaincash.jpg'
  },

  // Payment Card
  cardSvg: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/1s7j0q54_card.svg',
  cardTexture: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/igka9bm5_card_texture.png',

  // Central Bank of Iraq
  cbiLogo: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/996lnrr7_cbi_logo.png',
  cbiBuilding1: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/yyjprz90_cbi_building_01.webp',
  cbiBuilding2: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/v643842a_cbi_building_02.webp',
  cbiBuilding3: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/sdqwizpc_cbi_building_03.jpg'
};

// Company Info
export const COMPANY = {
  nameAr: 'شركة دبي العالمية للصرافة',
  nameEn: 'Dubai International for Exchange',
  nameKu: 'کۆمپانیای دوبەی نێودەوڵەتی بۆ ئاڵوگۆڕی دراو',
  sloganAr: 'خدمات مالية آمنة وسريعة للمسافرين والشركات',
  sloganEn: 'Secure and Fast Financial Services for Travelers and Businesses',
  sloganKu: 'خزمەتگوزارییە دارایییە پارێزراو و خێراکان بۆ گەشتیاران و کۆمپانیاکان'
};

// Partners list
export const PARTNERS = [
  { id: 'zaincash', nameAr: 'زين كاش', nameEn: 'Zain Cash', nameKu: 'زین کاش', logo: ASSETS.partners.zaincash },
  { id: 'fib', nameAr: 'المصرف العراقي الأول', nameEn: 'First Iraqi Bank', nameKu: 'بانکی یەکەمی عێراق', logo: ASSETS.partners.fib },
  { id: 'tbi', nameAr: 'المصرف العراقي للتجارة', nameEn: 'Trade Bank of Iraq', nameKu: 'بانکی بازرگانیی عێراق', logo: ASSETS.partners.tbi },
  { id: 'altayf', nameAr: 'مصرف الطيف الإسلامي', nameEn: 'Al-Tayf Islamic Bank', nameKu: 'بانکی ئیسلامیی ئەلتەیف', logo: ASSETS.partners.altayf },
  { id: 'rasheed', nameAr: 'مصرف الرشيد', nameEn: 'Rasheed Bank', nameKu: 'بانکی ڕەشید', logo: ASSETS.partners.rasheed },
  { id: 'rafidain', nameAr: 'مصرف الرافدين', nameEn: 'Rafidain Bank', nameKu: 'بانکی ڕافیدەین', logo: ASSETS.partners.rafidain }
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
    descKu: 'خزمەتگوزارییەکانی دراوی دیجیتاڵ',
    icon: 'coins',
    link: '/usdt'
  }
];
