import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRightLeft, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const CurrencyConverter = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IQD');
  const [amount, setAmount] = useState('100');
  const [result, setResult] = useState('150000');

  const currencies = [
    { code: 'USD', symbol: '$', name: currentLanguage === 'ar' ? 'دولار أمريكي' : 'US Dollar' },
    { code: 'IQD', symbol: 'د.ع', name: currentLanguage === 'ar' ? 'دينار عراقي' : 'Iraqi Dinar' },
    { code: 'EUR', symbol: '€', name: currentLanguage === 'ar' ? 'يورو' : 'Euro' },
    { code: 'GBP', symbol: '£', name: currentLanguage === 'ar' ? 'جنيه إسترليني' : 'British Pound' }
  ];

  const handleConvert = () => {
    // Placeholder logic - will be connected to backend API
    const rate = 1500; // Example rate
    const calculatedResult = parseFloat(amount) * rate;
    setResult(calculatedResult.toLocaleString());
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <section id="converter" className="py-20 bg-gradient-to-b from-black via-zinc-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              {t('converter.title')}
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Converter Card */}
          <div className="bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-2xl border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Glassmorphism Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* From Currency */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400">{t('converter.from')}</label>
                  <div className="bg-black/50 border border-[#D4AF37]/20 rounded-xl p-4 hover:border-[#D4AF37]/40 transition-all">
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-[#D4AF37]/30">
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code} className="text-white hover:bg-[#D4AF37]/10">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{currency.symbol}</span>
                              <span>{currency.code}</span>
                              <span className="text-xs text-gray-400">- {currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-3">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border-0 bg-transparent text-2xl font-bold text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="hidden lg:flex items-center justify-center">
                  <motion.button
                    onClick={swapCurrencies}
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 border border-[#D4AF37]/30 rounded-full hover:from-[#D4AF37]/30 hover:to-[#FFD700]/30 transition-all"
                  >
                    <ArrowRightLeft className="w-6 h-6 text-[#D4AF37]" />
                  </motion.button>
                </div>

                {/* To Currency */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-400">{t('converter.to')}</label>
                  <div className="bg-black/50 border border-[#D4AF37]/20 rounded-xl p-4 hover:border-[#D4AF37]/40 transition-all">
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="border-0 bg-transparent text-white focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-[#D4AF37]/30">
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code} className="text-white hover:bg-[#D4AF37]/10">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{currency.symbol}</span>
                              <span>{currency.code}</span>
                              <span className="text-xs text-gray-400">- {currency.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-[#D4AF37]">
                        {result}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <motion.button
                onClick={handleConvert}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-xl shadow-lg shadow-[#D4AF37]/40 hover:shadow-[#D4AF37]/60 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                {t('converter.convert')}
              </motion.button>

              {/* Last Update Info */}
              <div className="mt-4 text-center text-xs text-gray-500">
                {t('converter.lastUpdate')}: {new Date().toLocaleString(currentLanguage === 'ar' ? 'ar-IQ' : 'en-US')}
              </div>
            </div>
          </div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            {currentLanguage === 'ar' ? 'الأسعار استرشادية وقابلة للتغيير' : 'Rates are indicative and subject to change'}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrencyConverter;
