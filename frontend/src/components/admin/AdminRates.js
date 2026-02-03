import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, RefreshCw, Settings, TrendingUp, TrendingDown, Plus, Trash2, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminRates = () => {
  const [mode, setMode] = useState('manual'); // 'auto' or 'manual'
  const [rates, setRates] = useState([
    { code: 'USD', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', buy: 1480, sell: 1520, flag: '🇺🇸' },
    { code: 'EUR', nameAr: 'يورو', nameEn: 'Euro', buy: 1580, sell: 1630, flag: '🇪🇺' },
    { code: 'GBP', nameAr: 'جنيه إسترليني', nameEn: 'British Pound', buy: 1850, sell: 1920, flag: '🇬🇧' },
    { code: 'AED', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham', buy: 400, sell: 420, flag: '🇦🇪' },
    { code: 'SAR', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', buy: 390, sell: 410, flag: '🇸🇦' },
    { code: 'TRY', nameAr: 'ليرة تركية', nameEn: 'Turkish Lira', buy: 42, sell: 48, flag: '🇹🇷' },
  ]);

  const [lastUpdate, setLastUpdate] = useState('2025-02-03 10:30');

  const handleRateChange = (code, field, value) => {
    setRates(prev => prev.map(r => 
      r.code === code ? { ...r, [field]: parseFloat(value) || 0 } : r
    ));
  };

  const addCurrency = () => {
    const code = prompt('أدخل رمز العملة (مثال: JPY)');
    if (code && !rates.find(r => r.code === code.toUpperCase())) {
      setRates(prev => [...prev, {
        code: code.toUpperCase(),
        nameAr: code.toUpperCase(),
        nameEn: code.toUpperCase(),
        buy: 0,
        sell: 0,
        flag: '🏳️'
      }]);
    }
  };

  const removeCurrency = (code) => {
    if (confirm(`هل تريد حذف عملة ${code}؟`)) {
      setRates(prev => prev.filter(r => r.code !== code));
    }
  };

  const saveRates = () => {
    setLastUpdate(new Date().toLocaleString('ar-IQ'));
    alert('تم حفظ الأسعار بنجاح!');
  };

  const refreshRates = () => {
    alert('تم تحديث الأسعار من السوق العالمي');
    setLastUpdate(new Date().toLocaleString('ar-IQ'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">أسعار الصرف</h1>
          <p className="text-slate-600">آخر تحديث: {lastUpdate}</p>
        </div>
        <div className="flex items-center gap-3">
          {mode === 'auto' && (
            <button 
              onClick={refreshRates}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث من السوق
            </button>
          )}
          <button 
            onClick={saveRates}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-lg hover:bg-[#c9a431]"
          >
            <Save className="w-4 h-4" />
            حفظ
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">وضع التسعير</h3>
            <p className="text-sm text-slate-600">
              {mode === 'auto' 
                ? 'الأسعار متصلة بالسوق العالمي وتتحدث تلقائياً' 
                : 'أنت تتحكم بالأسعار يدوياً'}
            </p>
          </div>
          <button 
            onClick={() => setMode(mode === 'auto' ? 'manual' : 'auto')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'auto' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {mode === 'auto' ? (
              <><ToggleRight className="w-5 h-5" />تلقائي</>
            ) : (
              <><ToggleLeft className="w-5 h-5" />يدوي</>
            )}
          </button>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">العملات</h2>
          <button 
            onClick={addCurrency}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200"
          >
            <Plus className="w-4 h-4" />
            إضافة عملة
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">العملة</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">الرمز</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">سعر الشراء (د.ع)</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">سعر البيع (د.ع)</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">الفرق</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rates.map(rate => (
                <motion.tr
                  key={rate.code}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{rate.flag}</span>
                      <div>
                        <p className="font-medium text-slate-900">{rate.nameAr}</p>
                        <p className="text-xs text-slate-500">{rate.nameEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-900">{rate.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      value={rate.buy}
                      onChange={(e) => handleRateChange(rate.code, 'buy', e.target.value)}
                      disabled={mode === 'auto'}
                      className="w-32 text-center"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      type="number"
                      value={rate.sell}
                      onChange={(e) => handleRateChange(rate.code, 'sell', e.target.value)}
                      disabled={mode === 'auto'}
                      className="w-32 text-center"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {rate.sell - rate.buy > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`font-medium ${rate.sell - rate.buy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {rate.sell - rate.buy}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => removeCurrency(rate.code)}
                      className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">ملاحظة</h4>
            <p className="text-sm text-blue-800">
              هذه الأسعار تؤثر على محول العملات في الصفحة الرئيسية وحسابات التحويلات. 
              تأكد من تحديث الأسعار بانتظام للحفاظ على دقة الحسابات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRates;
