// Asset URLs for the 3D Landing Page
export const ASSETS = {
  // 3D Models
  airplane: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/jvef3c12_airplane.glb',
  creditCard: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/wcblo2y6_credit_card.glb',
  usdt: 'https://customer-assets.emergentagent.com/job_28ffec3b-f08f-4672-88c0-712bcb54d2bb/artifacts/5ctlcnq1_usdt.glb',

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
  sloganAr: 'خدمات مالية آمنة وسريعة للمسافرين والشركات',
  sloganEn: 'Secure and Fast Financial Services for Travelers and Businesses'
};

// Partners list
export const PARTNERS = [
  { id: 'zaincash', nameAr: 'زين كاش', nameEn: 'Zain Cash', logo: ASSETS.partners.zaincash },
  { id: 'fib', nameAr: 'المصرف العراقي الأول', nameEn: 'First Iraqi Bank', logo: ASSETS.partners.fib },
  { id: 'tbi', nameAr: 'المصرف العراقي للتجارة', nameEn: 'Trade Bank of Iraq', logo: ASSETS.partners.tbi },
  { id: 'altayf', nameAr: 'مصرف الطيف الإسلامي', nameEn: 'Al-Tayf Islamic Bank', logo: ASSETS.partners.altayf },
  { id: 'rasheed', nameAr: 'مصرف الرشيد', nameEn: 'Rasheed Bank', logo: ASSETS.partners.rasheed },
  { id: 'rafidain', nameAr: 'مصرف الرافدين', nameEn: 'Rafidain Bank', logo: ASSETS.partners.rafidain }
];

// Services
export const SERVICES = [
  {
    id: 'usd-booking',
    titleAr: 'حجز الدولار للمسافرين',
    titleEn: 'USD Booking for Travelers',
    descAr: 'احجز دولاراتك بسهولة قبل السفر',
    descEn: 'Book your dollars easily before traveling',
    icon: 'plane',
    link: '/traveler-booking'
  },
  {
    id: 'transfers',
    titleAr: 'التحويلات المالية',
    titleEn: 'Money Transfers',
    descAr: 'تحويلات محلية ودولية سريعة وآمنة',
    descEn: 'Fast and secure local and international transfers',
    icon: 'send',
    link: '/transfers'
  },
  {
    id: 'card-topup',
    titleAr: 'تعبئة البطاقات',
    titleEn: 'Card Top-up',
    descAr: 'اشحن بطاقاتك المصرفية بسهولة',
    descEn: 'Top up your bank cards easily',
    icon: 'credit-card',
    link: '/card-topup'
  },
  {
    id: 'usdt',
    titleAr: 'شحن USDT',
    titleEn: 'USDT Recharge',
    descAr: 'خدمات العملات الرقمية',
    descEn: 'Digital currency services',
    icon: 'coins',
    link: '/usdt'
  }
];
