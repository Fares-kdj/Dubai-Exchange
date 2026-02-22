// Payment methods configuration - easily configurable from Admin Panel later
export const PAYMENT_METHODS = [
  { 
    value: 'zain_cash', 
    labelAr: 'زين كاش', 
    labelEn: 'Zain Cash',
    labelKu: 'زەین کاش',
    icon: '📱',
    active: true
  },
  { 
    value: 'mastercard_rafidain', 
    labelAr: 'ماستركارد الرافدين', 
    labelEn: 'Mastercard Al-Rafidain',
    labelKu: 'ماستەرکارد الڕافدین',
    icon: '💳',
    active: true
  },
  { 
    value: 'fib', 
    labelAr: 'FIB', 
    labelEn: 'FIB',
    labelKu: 'FIB',
    icon: '🏦',
    active: true
  }
];

// Service fees configuration
export const SERVICE_FEES = {
  traveler_booking: 0,      // No fee for traveler booking
  local_transfer: 2,        // 2%
  international_transfer: 2, // 2%
  western_union: 2,         // 2%
  moneygram: 2,            // 2%
  country_based: 2,        // 2%
  usdt_recharge: 2,        // 2%
  card_recharge: 2         // 2%
};

// Get payment method label based on language
export const getPaymentMethodLabel = (method, language = 'ar') => {
  const found = PAYMENT_METHODS.find(m => m.value === method);
  if (!found) return method;
  
  switch (language) {
    case 'en': return found.labelEn;
    case 'ku': return found.labelKu;
    default: return found.labelAr;
  }
};

// Get service fee by type
export const getServiceFee = (serviceType) => {
  return SERVICE_FEES[serviceType] || 2;
};

// Calculate fee amount
export const calculateFee = (amount, serviceType) => {
  const feePercent = getServiceFee(serviceType);
  return Math.round(amount * feePercent / 100);
};

// Calculate total with fee
export const calculateTotal = (amount, serviceType) => {
  return amount + calculateFee(amount, serviceType);
};

export default {
  PAYMENT_METHODS,
  SERVICE_FEES,
  getPaymentMethodLabel,
  getServiceFee,
  calculateFee,
  calculateTotal
};
