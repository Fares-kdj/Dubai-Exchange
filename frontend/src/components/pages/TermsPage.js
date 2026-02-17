import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { ASSETS } from '@/config/assets';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';
import { FileText, Shield, AlertTriangle, Users, Globe, CreditCard, Phone, ChevronDown } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Default terms content if CMS not available
const defaultTerms = {
  ar: {
    title: 'الشروط والأحكام',
    subtitle: 'يرجى قراءة الشروط والأحكام بعناية قبل استخدام خدماتنا',
    lastUpdate: 'آخر تحديث: يناير 2025',
    sections: [
      {
        icon: 'FileText',
        title: 'مقدمة',
        content: 'مرحباً بكم في شركة دبي العالمية للصرافة. باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. تنظم هذه الشروط استخدامك لجميع الخدمات المقدمة من قبلنا بما في ذلك خدمات الصرافة والتحويلات المالية وحجز العملات.'
      },
      {
        icon: 'Shield',
        title: 'الترخيص والتنظيم',
        content: 'شركة دبي العالمية للصرافة مرخصة من قبل البنك المركزي العراقي ونعمل وفقاً للقوانين واللوائح المحلية والدولية المتعلقة بالخدمات المالية. رقم الترخيص: XXXX-XXXX.'
      },
      {
        icon: 'CreditCard',
        title: 'خدمات الصرافة والتحويلات',
        content: 'تشمل خدماتنا صرف العملات الأجنبية، التحويلات المحلية والدولية، حجز الدولار للمسافرين، وتعبئة البطاقات المصرفية. تخضع جميع المعاملات لأسعار الصرف السائدة وقت إتمام العملية والتي قد تختلف عن الأسعار المعروضة مسبقاً.'
      },
      {
        icon: 'Users',
        title: 'التزامات العميل',
        content: 'يلتزم العميل بتقديم معلومات صحيحة ودقيقة، وتقديم الوثائق المطلوبة للتحقق من الهوية، والامتثال لجميع القوانين المحلية والدولية المتعلقة بالتحويلات المالية، وعدم استخدام الخدمات لأي أغراض غير قانونية.'
      },
      {
        icon: 'AlertTriangle',
        title: 'سياسة الإلغاء والاسترجاع',
        content: 'يمكن إلغاء المعاملات قبل معالجتها مع خصم رسوم إدارية. بعد معالجة المعاملة، لا يمكن إلغاؤها أو استرجاع المبلغ إلا في حالات محددة وبموافقة الإدارة. تخضع عمليات الاسترجاع لفترة معالجة تصل إلى 7 أيام عمل.'
      },
      {
        icon: 'Globe',
        title: 'القيود والمحظورات',
        content: 'قد تكون بعض الخدمات غير متاحة لبعض الدول أو العملات بسبب القوانين المحلية أو الدولية. يحتفظ البنك المركزي والشركة بحق رفض أي معاملة دون إبداء الأسباب. تخضع الحدود القصوى للمعاملات للقوانين المحلية ويتم تحديثها دورياً.'
      },
      {
        icon: 'Shield',
        title: 'الخصوصية وحماية البيانات',
        content: 'نلتزم بحماية خصوصية عملائنا وبياناتهم الشخصية. يتم استخدام المعلومات فقط لأغراض تقديم الخدمات والامتثال للمتطلبات القانونية. لن نشارك بياناتك مع أطراف ثالثة إلا بموافقتك أو حسب ما يقتضيه القانون.'
      },
      {
        icon: 'Phone',
        title: 'التواصل والدعم',
        content: 'فريق الدعم متاح للإجابة على استفساراتكم من السبت إلى الخميس. يمكنكم التواصل معنا عبر الهاتف أو البريد الإلكتروني أو زيارة فرعنا الرئيسي. نسعى للرد على جميع الاستفسارات خلال 24 ساعة عمل.'
      }
    ],
    acceptance: 'باستخدامك لخدماتنا، فإنك تقر بأنك قرأت وفهمت ووافقت على هذه الشروط والأحكام.'
  },
  en: {
    title: 'Terms and Conditions',
    subtitle: 'Please read the terms and conditions carefully before using our services',
    lastUpdate: 'Last updated: January 2025',
    sections: [
      {
        icon: 'FileText',
        title: 'Introduction',
        content: 'Welcome to Dubai International Exchange. By using our services, you agree to be bound by these terms and conditions. These terms govern your use of all services provided by us, including exchange services, money transfers, and currency booking.'
      },
      {
        icon: 'Shield',
        title: 'License and Regulation',
        content: 'Dubai International Exchange is licensed by the Central Bank of Iraq and operates in accordance with local and international laws and regulations relating to financial services. License number: XXXX-XXXX.'
      },
      {
        icon: 'CreditCard',
        title: 'Exchange and Transfer Services',
        content: 'Our services include foreign currency exchange, local and international transfers, USD booking for travelers, and bank card top-up. All transactions are subject to prevailing exchange rates at the time of completion, which may differ from previously displayed rates.'
      },
      {
        icon: 'Users',
        title: 'Customer Obligations',
        content: 'Customers are required to provide accurate and correct information, submit required documents for identity verification, comply with all local and international laws relating to money transfers, and not use services for any illegal purposes.'
      },
      {
        icon: 'AlertTriangle',
        title: 'Cancellation and Refund Policy',
        content: 'Transactions can be cancelled before processing with an administrative fee deducted. After processing, transactions cannot be cancelled or refunded except in specific cases with management approval. Refunds are subject to a processing period of up to 7 business days.'
      },
      {
        icon: 'Globe',
        title: 'Restrictions and Prohibitions',
        content: 'Some services may not be available for certain countries or currencies due to local or international laws. The Central Bank and the company reserve the right to refuse any transaction without giving reasons. Maximum transaction limits are subject to local laws and are updated periodically.'
      },
      {
        icon: 'Shield',
        title: 'Privacy and Data Protection',
        content: 'We are committed to protecting our customers\' privacy and personal data. Information is used only for the purposes of providing services and complying with legal requirements. We will not share your data with third parties except with your consent or as required by law.'
      },
      {
        icon: 'Phone',
        title: 'Communication and Support',
        content: 'Our support team is available to answer your inquiries from Saturday to Thursday. You can contact us by phone, email, or visit our main branch. We strive to respond to all inquiries within 24 business hours.'
      }
    ],
    acceptance: 'By using our services, you acknowledge that you have read, understood, and agreed to these terms and conditions.'
  },
  ku: {
    title: 'مەرج و مەرجەکان',
    subtitle: 'تکایە مەرج و مەرجەکان بە وریایی بخوێنەوە پێش بەکارهێنانی خزمەتگوزارییەکانمان',
    lastUpdate: 'کۆتا نوێکردنەوە: کانوونی دووەم ٢٠٢٥',
    sections: [
      {
        icon: 'FileText',
        title: 'پێشەکی',
        content: 'بەخێربێن بۆ کۆمپانیای دوبەی نێودەوڵەتی بۆ ئاڵوگۆڕی دراو. بە بەکارهێنانی خزمەتگوزارییەکانمان، ڕازی دەبیت بەم مەرج و مەرجانە.'
      },
      {
        icon: 'Shield',
        title: 'مۆڵەت و ڕێکخستن',
        content: 'کۆمپانیای دوبەی نێودەوڵەتی بۆ ئاڵوگۆڕی دراو مۆڵەتی لە بانکی ناوەندیی عێراقەوە وەرگرتووە.'
      },
      {
        icon: 'CreditCard',
        title: 'خزمەتگوزارییەکانی ئاڵوگۆڕ و گواستنەوە',
        content: 'خزمەتگوزارییەکانمان دەگرێتەوە ئاڵوگۆڕی دراوی بیانی، گواستنەوەی ناوخۆ و نێودەوڵەتی، نۆرەکردنی دۆلار بۆ گەشتیاران، و پڕکردنەوەی کارتی بانکی.'
      }
    ],
    acceptance: 'بە بەکارهێنانی خزمەتگوزارییەکانمان، دانت دەنێیت کە ئەم مەرج و مەرجانەت خوێندووەتەوە و تێگەیشتوویت و ڕازییت.'
  }
};

const iconMap = {
  FileText: FileText,
  Shield: Shield,
  AlertTriangle: AlertTriangle,
  Users: Users,
  Globe: Globe,
  CreditCard: CreditCard,
  Phone: Phone
};

const TermsPage = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';
  
  const [terms, setTerms] = useState(null);
  const [expandedSection, setExpandedSection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/cms/terms`);
        if (response.ok) {
          const data = await response.json();
          setTerms(data);
        } else {
          setTerms(defaultTerms);
        }
      } catch {
        setTerms(defaultTerms);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const content = terms?.[currentLanguage] || defaultTerms[currentLanguage] || defaultTerms.ar;

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <Header3D />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer3D />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <Header3D />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            {/* CBI Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6"
              style={{
                background: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`
              }}
            >
              <img src={ASSETS.cbiLogo} alt="CBI" className="w-8 h-8" />
              <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {isKurdish ? 'مۆڵەتدار لە بانکی ناوەندی' : isArabic ? 'مرخصة من البنك المركزي' : 'Licensed by Central Bank'}
              </span>
            </motion.div>

            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {content.title}
            </h1>
            
            <p className={`text-lg max-w-2xl mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {content.subtitle}
            </p>

            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              {content.lastUpdate}
            </p>
          </motion.div>

          {/* Terms Sections - Accordion Style */}
          <div className="max-w-4xl mx-auto space-y-4">
            {content.sections?.map((section, index) => {
              const Icon = iconMap[section.icon] || FileText;
              const isExpanded = expandedSection === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    isDark 
                      ? 'bg-white/5 border-white/10 hover:border-[#D4AF37]/30'
                      : 'bg-white border-slate-200 hover:border-[#D4AF37]/50 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? -1 : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isDark ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37]/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`} />
                      </div>
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {section.title}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    </motion.div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-6 pb-6 pt-0 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <div className={`border-t pt-4 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                        <p className="leading-relaxed">{section.content}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Acceptance Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`max-w-4xl mx-auto mt-12 p-8 rounded-3xl text-center ${
              isDark 
                ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#FCD34D]/10 border border-[#D4AF37]/30'
                : 'bg-gradient-to-r from-[#D4AF37]/10 to-[#FCD34D]/5 border border-[#D4AF37]/20'
            }`}
          >
            <Shield className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-[#D4AF37]' : 'text-[#B8860B]'}`} />
            <p className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {content.acceptance}
            </p>
          </motion.div>

          {/* Company Info */}
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <img 
              src={isDark ? ASSETS.logoWhite : ASSETS.logoColor}
              alt="Dubai International Exchange"
              className="h-12 mx-auto mb-4"
            />
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              © {new Date().getFullYear()} {isKurdish ? 'کۆمپانیای دوبەی نێودەوڵەتی بۆ ئاڵوگۆڕی دراو' : isArabic ? 'شركة دبي العالمية للصرافة' : 'Dubai International for Exchange'}. 
              {isKurdish ? ' هەموو مافەکان پارێزراون.' : isArabic ? ' جميع الحقوق محفوظة.' : ' All rights reserved.'}
            </p>
          </div>
        </div>
      </main>

      <Footer3D />
    </div>
  );
};

export default TermsPage;
