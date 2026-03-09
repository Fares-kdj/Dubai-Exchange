import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, TrendingUp, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CurrencyConverter = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IQD');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState('150000');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [converting, setConverting] = useState(false);

  const currencies = [
    { code: 'USD', countryCode: 'US', symbol: '$', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', nameKu: 'دۆلاری ئەمریکی' },
    { code: 'IQD', countryCode: 'IQ', symbol: 'د.ع', nameAr: 'دينار عراقي', nameEn: 'Iraqi Dinar', nameKu: 'دیناری عێراقی' },
    { code: 'EUR', countryCode: 'EU', symbol: '€', nameAr: 'يورو', nameEn: 'Euro', nameKu: 'یۆرۆ' },
    { code: 'GBP', countryCode: 'GB', symbol: '£', nameAr: 'جنيه إسترليني', nameEn: 'British Pound', nameKu: 'پاوەندی بەریتانی' },
    { code: 'TRY', countryCode: 'TR', symbol: '₺', nameAr: 'ليرة تركية', nameEn: 'Turkish Lira', nameKu: 'لیرەی تورکی' },
    { code: 'AED', countryCode: 'AE', symbol: 'د.إ', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham', nameKu: 'درهەمی ئیماراتی' },
    { code: 'SAR', countryCode: 'SA', symbol: 'ر.س', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', nameKu: 'ڕیاڵی سعودی' }
  ];

  const getFlag = (code) => {
    const currency = currencies.find(c => c.code === code);
    if (currency) return currency.countryCode.toLowerCase();

    // Fallback common mappings
    const fallbacks = {
      'USD': 'us', 'IQD': 'iq', 'EUR': 'eu', 'GBP': 'gb',
      'TRY': 'tr', 'AED': 'ae', 'SAR': 'sa', 'KWD': 'kw',
      'JOD': 'jo', 'LBP': 'lb', 'EGP': 'eg', 'QAR': 'qa',
      'IRR': 'ir'
    };
    return fallbacks[code] || code.substring(0, 2).toLowerCase() || 'un';
  };

  const getCurrencyName = (currency) => {
    if (currentLanguage === 'ar') return currency.nameAr;
    if (currentLanguage === 'ku') return currency.nameKu;
    return currency.nameEn;
  };

  const handleConvert = async (from = fromCurrency, to = toCurrency) => {
    if (!amount || parseFloat(amount) <= 0) return;

    setConverting(true);
    setLoading(true);

    // Simulate API call delay for animation
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const response = await axios.post(`${API}/convert`, null, {
        params: {
          from_currency: from,
          to_currency: to,
          amount: parseFloat(amount)
        }
      });

      setResult(response.data.result.toLocaleString());
      setLastUpdated(response.data.last_updated);
    } catch (error) {
      console.error('Conversion error:', error);
      // Fallback calculation with basic rates
      const fallbackRates = {
        'USD_IQD': 1500, 'IQD_USD': 0.00067,
        'EUR_IQD': 1620, 'IQD_EUR': 0.00062,
        'GBP_IQD': 1890, 'IQD_GBP': 0.00053,
        'USD_EUR': 0.92, 'EUR_USD': 1.08,
        'USD_GBP': 0.79, 'GBP_USD': 1.26,
        'EUR_GBP': 0.86, 'GBP_EUR': 1.16
      };
      const rateKey = `${from}_${to}`;
      const rate = fallbackRates[rateKey] || 1;
      const calculatedResult = parseFloat(amount) * rate;
      setResult(calculatedResult.toLocaleString());
    } finally {
      setLoading(false);
      setTimeout(() => setConverting(false), 300);
    }
  };

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      handleConvert(fromCurrency, toCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency, amount]);

  const swapCurrencies = () => {
    // Swap the currencies synchronously
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
  };

  return (
    <section id="converter" className={`py-20 md:py-32 relative overflow-hidden transition-colors duration-300 ${isDark
      ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900'
      : 'bg-gradient-to-b from-white via-slate-50 to-white'
      }`}>
      {/* Background Decoration */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/10 to-[#FCD34D]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl" />

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
            {t('converter.title')}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {currentLanguage === 'ar' ? 'احسب قيمة عملتك بدقة وسرعة' : 'Calculate your currency value accurately and quickly'}
          </p>
        </motion.div>

        {/* Converter Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
          data-testid="currency-converter"
        >
          {/* Glass Card */}
          <div className={`backdrop-blur-2xl border rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden ${isDark
            ? 'bg-slate-800/70 border-slate-700/60 shadow-slate-900/50'
            : 'bg-white/70 border-slate-200/60 shadow-slate-200/50'
            }`}>
            {/* Animated gradient overlay */}
            <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-gradient-to-br from-slate-700/40 to-transparent' : 'bg-gradient-to-br from-white/40 to-transparent'
              }`} />

            <div className="relative z-10">
              {/* Currency Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-8">
                {/* From Currency */}
                <motion.div
                  className="space-y-3"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t('converter.from')}
                  </label>
                  <div className={`border-2 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md ${isDark
                    ? 'bg-slate-700 border-slate-600 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37]'
                    : 'bg-white border-slate-200 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37]'
                    }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        key={fromCurrency}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-8 h-8 rounded-full overflow-hidden border shadow-sm"
                      >
                        <img
                          src={`https://flagcdn.com/w80/${getFlag(fromCurrency)}.png`}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
                        />
                      </motion.div>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className={`border-0 bg-transparent font-medium focus:ring-0 focus:ring-offset-0 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`border rounded-xl shadow-xl ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                              className={`rounded-lg py-3 ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-900 hover:bg-slate-50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full overflow-hidden border">
                                  <img
                                    src={`https://flagcdn.com/w40/${currency.countryCode.toLowerCase()}.png`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://flagcdn.com/w40/un.png'; }}
                                  />
                                </div>
                                <span className="font-semibold">{currency.code}</span>
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>- {getCurrencyName(currency)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`border-0 bg-transparent text-3xl font-bold focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 ${isDark ? 'text-white' : 'text-slate-900'}`}
                      placeholder="0.00"
                      data-testid="amount-input"
                    />
                  </div>
                </motion.div>

                {/* Swap Button */}
                <div className="flex items-center justify-center">
                  <motion.button
                    onClick={swapCurrencies}
                    whileHover={{ scale: 1.15, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    data-testid="swap-currencies"
                    className="p-4 bg-gradient-to-br from-[#D4AF37] to-[#FCD34D] rounded-full shadow-xl hover:shadow-2xl transition-all"
                  >
                    <ArrowRightLeft className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* To Currency */}
                <motion.div
                  className="space-y-3"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t('converter.to')}</label>
                  <div className={`border-2 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md ${isDark
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37]'
                    : 'bg-gradient-to-br from-slate-50 to-white border-slate-200 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37]'
                    }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        key={toCurrency}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-8 h-8 rounded-full overflow-hidden border shadow-sm"
                      >
                        <img
                          src={`https://flagcdn.com/w80/${getFlag(toCurrency)}.png`}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
                        />
                      </motion.div>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className={`border-0 bg-transparent font-medium focus:ring-0 focus:ring-offset-0 text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className={`border rounded-xl shadow-xl ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.code}
                              value={currency.code}
                              className={`rounded-lg py-3 ${isDark ? 'text-white hover:bg-slate-700' : 'text-slate-900 hover:bg-slate-50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full overflow-hidden border">
                                  <img
                                    src={`https://flagcdn.com/w40/${currency.countryCode.toLowerCase()}.png`}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://flagcdn.com/w40/un.png'; }}
                                  />
                                </div>
                                <span className="font-semibold">{currency.code}</span>
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>- {getCurrencyName(currency)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={result}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] bg-clip-text text-transparent"
                        data-testid="conversion-result"
                      >
                        {result}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Convert Button */}
              <motion.button
                onClick={() => handleConvert()}
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="convert-button"
                className={`w-full py-5 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${isDark
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900'
                  : 'bg-gradient-to-r from-slate-900 to-slate-700 text-white'
                  }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {currentLanguage === 'ar' ? 'جارٍ التحويل...' : 'Converting...'}
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {t('converter.convert')}
                  </>
                )}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'bg-gradient-to-r from-white/10 to-transparent' : 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent'
                  }`} />
              </motion.button>

              {/* Last Update Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`mt-6 text-center text-xs flex items-center justify-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
              >
                <RefreshCw className="w-3 h-3" />
                {t('converter.lastUpdate')}: {new Date(lastUpdated).toLocaleString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US')}
              </motion.div>
            </div>
          </div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className={`mt-6 text-center text-sm border rounded-xl p-4 ${isDark ? 'bg-blue-900/30 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-100 text-slate-500'
              }`}
          >
            💡 {currentLanguage === 'ar' ? 'الأسعار استرشادية وقابلة للتغيير حسب السوق' : 'Rates are indicative and subject to market changes'}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrencyConverter;
