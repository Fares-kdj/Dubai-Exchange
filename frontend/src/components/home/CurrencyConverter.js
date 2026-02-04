import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, TrendingUp, RefreshCw } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CurrencyConverter = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IQD');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState('150000');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [converting, setConverting] = useState(false);

  const currencies = [
    { code: 'USD', countryCode: 'US', symbol: '$', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', nameKu: 'دۆلاری ئەمریکی' },
    { code: 'IQD', countryCode: 'IQ', symbol: 'د.ع', nameAr: 'دينار عراقي', nameEn: 'Iraqi Dinar', nameKu: 'دیناری عێراقی' },
    { code: 'EUR', countryCode: 'EU', symbol: '€', nameAr: 'يورو', nameEn: 'Euro', nameKu: 'یۆرۆ' },
    { code: 'GBP', countryCode: 'GB', symbol: '£', nameAr: 'جنيه إسترليني', nameEn: 'British Pound', nameKu: 'پاوەندی بەریتانی' }
  ];

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
    <section id="converter" className="py-20 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
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
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-slate-900">
            {t('converter.title')}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
          <div className="bg-white/70 backdrop-blur-2xl border border-slate-200/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              {/* Currency Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-8">
                {/* From Currency */}
                <motion.div 
                  className="space-y-3"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    {t('converter.from')}
                  </label>
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37] transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        key={fromCurrency}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <ReactCountryFlag
                          countryCode={currencies.find(c => c.code === fromCurrency)?.countryCode || 'US'}
                          svg
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      </motion.div>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="border-0 bg-transparent text-slate-900 font-medium focus:ring-0 focus:ring-offset-0 text-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 rounded-xl shadow-xl">
                          {currencies.map((currency) => (
                            <SelectItem 
                              key={currency.code} 
                              value={currency.code} 
                              className="text-slate-900 hover:bg-slate-50 rounded-lg py-3"
                            >
                              <div className="flex items-center gap-3">
                                <ReactCountryFlag
                                  countryCode={currency.countryCode}
                                  svg
                                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                />
                                <span className="font-semibold">{currency.code}</span>
                                <span className="text-sm text-slate-500">- {getCurrencyName(currency)}</span>
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
                      className="border-0 bg-transparent text-3xl font-bold text-slate-900 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
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
                  <label className="text-sm font-semibold text-slate-700">{t('converter.to')}</label>
                  <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-5 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37] transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        key={toCurrency}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                      >
                        <ReactCountryFlag
                          countryCode={currencies.find(c => c.code === toCurrency)?.countryCode || 'IQ'}
                          svg
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      </motion.div>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="border-0 bg-transparent text-slate-900 font-medium focus:ring-0 focus:ring-offset-0 text-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 rounded-xl shadow-xl">
                          {currencies.map((currency) => (
                            <SelectItem 
                              key={currency.code} 
                              value={currency.code} 
                              className="text-slate-900 hover:bg-slate-50 rounded-lg py-3"
                            >
                              <div className="flex items-center gap-3">
                                <ReactCountryFlag
                                  countryCode={currency.countryCode}
                                  svg
                                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                />
                                <span className="font-semibold">{currency.code}</span>
                                <span className="text-sm text-slate-500">- {getCurrencyName(currency)}</span>
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
                onClick={handleConvert}
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="convert-button"
                className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              {/* Last Update Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2"
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
            className="mt-6 text-center text-sm text-slate-500 bg-blue-50 border border-blue-100 rounded-xl p-4"
          >
            💡 {currentLanguage === 'ar' ? 'الأسعار استرشادية وقابلة للتغيير حسب السوق' : 'Rates are indicative and subject to market changes'}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrencyConverter;
