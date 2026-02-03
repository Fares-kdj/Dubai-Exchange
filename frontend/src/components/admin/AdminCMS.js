import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, Edit2, Check, X, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminCMS = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [editingKey, setEditingKey] = useState(null);
  const [language, setLanguage] = useState('ar');

  const [content, setContent] = useState({
    hero: {
      title: { ar: 'خير بغداد للصرافة', en: 'Khair Baghdad Exchange' },
      subtitle: { ar: 'شريكك الموثوق في التحويلات المالية', en: 'Your trusted partner in money transfers' },
      cta: { ar: 'احجز الآن', en: 'Book Now' }
    },
    services: {
      title: { ar: 'خدماتنا', en: 'Our Services' },
      traveler: { ar: 'حجز الدولار للمسافرين', en: 'Traveler USD Booking' },
      local: { ar: 'تحويل محلي', en: 'Local Transfer' },
      international: { ar: 'تحويل دولي', en: 'International Transfer' }
    },
    trust: {
      title: { ar: 'لماذا نحن؟', en: 'Why Us?' },
      licensed: { ar: 'شركة مرخصة رسمياً', en: 'Officially licensed company' },
      fast: { ar: 'تحويلات سريعة وآمنة', en: 'Fast and secure transfers' },
      support: { ar: 'دعم على مدار الساعة', en: '24/7 Support' }
    },
    terms: {
      title: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
      content: { 
        ar: 'يجب على العميل تقديم جواز سفر ساري المفعول وتذكرة سفر مؤكدة. الحد الأقصى للحجز 10,000 دولار.', 
        en: 'Customer must provide valid passport and confirmed travel ticket. Maximum booking $10,000.' 
      }
    },
    payment: {
      title: { ar: 'تعليمات الدفع', en: 'Payment Instructions' },
      content: { 
        ar: 'يمكنك الدفع نقداً في أحد فروعنا أو عبر التحويل البنكي. احتفظ بإيصال الدفع وارفعه عبر الموقع.', 
        en: 'Pay cash at our branches or via bank transfer. Keep your receipt and upload it via the website.' 
      }
    },
    contact: {
      phone: { ar: '+964 770 123 4567', en: '+964 770 123 4567' },
      email: { ar: 'info@khairbaghdad.com', en: 'info@khairbaghdad.com' },
      address: { ar: 'بغداد، شارع الرشيد', en: 'Baghdad, Al-Rasheed Street' }
    }
  });

  const sections = [
    { key: 'hero', label: 'القسم الرئيسي', icon: Globe },
    { key: 'services', label: 'الخدمات', icon: FileText },
    { key: 'trust', label: 'لماذا نحن', icon: Check },
    { key: 'terms', label: 'الشروط والأحكام', icon: FileText },
    { key: 'payment', label: 'تعليمات الدفع', icon: FileText },
    { key: 'contact', label: 'التواصل', icon: Globe },
  ];

  const handleSave = (section, key, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...prev[section][key],
          [language]: value
        }
      }
    }));
    setEditingKey(null);
  };

  const saveAll = () => {
    alert('تم حفظ جميع التغييرات بنجاح!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المحتوى</h1>
          <p className="text-slate-600">تعديل نصوص الموقع بجميع اللغات</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
            <button 
              onClick={() => setLanguage('ar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${language === 'ar' ? 'bg-[#D4AF37] text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              العربية
            </button>
            <button 
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${language === 'en' ? 'bg-[#D4AF37] text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              English
            </button>
          </div>
          <button 
            onClick={saveAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-lg hover:bg-[#c9a431]"
          >
            <Save className="w-4 h-4" />
            حفظ الكل
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map(section => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            {/* Section Header */}
            <button
              onClick={() => setActiveSection(activeSection === section.key ? null : section.key)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-slate-600" />
                </div>
                <span className="font-bold text-slate-900">{section.label}</span>
              </div>
              {activeSection === section.key ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Section Content */}
            {activeSection === section.key && (
              <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                {Object.entries(content[section.key]).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-4">
                    <div className="flex-1">
                      <Label className="text-sm text-slate-500 mb-2 block capitalize">
                        {key.replace(/_/g, ' ')}
                      </Label>
                      {editingKey === `${section.key}-${key}` ? (
                        <div className="flex items-center gap-2">
                          <Input
                            defaultValue={value[language]}
                            className="flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(section.key, key, e.target.value);
                              if (e.key === 'Escape') setEditingKey(null);
                            }}
                            autoFocus
                          />
                          <button 
                            onClick={(e) => handleSave(section.key, key, e.target.previousSibling.value)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingKey(null)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <p className="flex-1 p-3 bg-slate-50 rounded-lg text-slate-900">
                            {value[language]}
                          </p>
                          <button 
                            onClick={() => setEditingKey(`${section.key}-${key}`)}
                            className="p-2 text-slate-400 hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-sm text-amber-800">
          💡 <strong>نصيحة:</strong> تأكد من تحديث النصوص بجميع اللغات المدعومة (العربية والإنجليزية) للحفاظ على تجربة مستخدم متسقة.
        </p>
      </div>
    </div>
  );
};

export default AdminCMS;
