import React, { useState, useEffect } from 'react';
import {
  Save, RefreshCw, ChevronDown, ChevronUp, Edit2, Check, X, Plus,
  Globe, Type, FileText, Phone, Mail, MapPin, Settings,
  Zap, Clock, AlertCircle, Plane
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const AdminCMS = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  // Terms State
  const [terms, setTerms] = useState({
    ku: { title: '', sections: [] }
  });

  // Traveler Terms State
  const [travelerTerms, setTravelerTerms] = useState({
    ar: { title: '', sections: [] },
    en: { title: '', sections: [] },
    ku: { title: '', sections: [] }
  });

  // Contact State
  const [contact, setContact] = useState({
    ar: { address: '', phone: '', whatsapp: '', email: '', working_hours: '' },
    en: { address: '', phone: '', whatsapp: '', email: '', working_hours: '' },
    ku: { address: '', phone: '', whatsapp: '', email: '', working_hours: '' }
  });

  // Rate Mode State
  const [rateMode, setRateMode] = useState({
    mode: 'manual',
    api_source: 'exchangerate-api',
    update_interval_minutes: 60
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  };

  // Load all data
  const loadData = async () => {
    setLoading(true);
    try {
      const [termsRes, travelerTermsRes, contactRes, rateModeRes] = await Promise.all([
        fetch(`${API_URL}/api/cms/terms?t=${Date.now()}`),
        fetch(`${API_URL}/api/cms/traveler-terms?t=${Date.now()}`),
        fetch(`${API_URL}/api/cms/contact?t=${Date.now()}`),
        fetch(`${API_URL}/api/rates/settings/mode?t=${Date.now()}`)
      ]);

      const termsData = await termsRes.json();
      const travelerTermsData = await travelerTermsRes.json();
      const contactData = await contactRes.json();
      const rateModeData = await rateModeRes.json();

      // Terms: merge with defaults (API may return null or partial data)
      setTerms({
        ku: { title: 'مەرج و رێساکان', sections: [], ...(termsData?.ku || {}) }
      });

      // Traveler Terms
      setTravelerTerms({
        ar: { title: 'شروط حجز المسافرين', sections: [], ...(travelerTermsData?.ar || {}) },
        en: { title: 'Traveler Booking Terms', sections: [], ...(travelerTermsData?.en || {}) },
        ku: { title: 'مەرجەکانی حجزکردنی گەشتیار', sections: [], ...(travelerTermsData?.ku || {}) }
      });

      // Contact: merge with defaults
      setContact({
        ar: { address: '', phone: '', whatsapp: '', email: '', working_hours: '', ...(contactData?.ar || {}) },
        en: { address: '', phone: '', whatsapp: '', email: '', working_hours: '', ...(contactData?.en || {}) },
        ku: { address: '', phone: '', whatsapp: '', email: '', working_hours: '', ...(contactData?.ku || {}) }
      });

      if (rateModeData) {
        setRateMode({
          mode: rateModeData.mode || 'manual',
          api_source: rateModeData.api_source || 'exchangerate-api',
          update_interval_minutes: rateModeData.update_interval_minutes || 60
        });
      }
    } catch (err) {
      console.error('Error loading data:', err);
      showMessage('error', 'حدث خطأ في تحميل البيانات');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Save Terms
  const saveTerms = async () => {
    setSaving(true);
    try {
      const res = await fetch(API_URL + '/api/cms/terms', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(terms)
      });
      if (res.ok) {
        showMessage('success', 'تم حفظ الشروط العامة بنجاح');
      } else {
        showMessage('error', 'حدث خطأ في الحفظ');
      }
    } catch (err) {
      showMessage('error', 'حدث خطأ في الاتصال');
    }
    setSaving(false);
  };

  // Save Traveler Terms
  const saveTravelerTerms = async () => {
    setSaving(true);
    try {
      const res = await fetch(API_URL + '/api/cms/traveler-terms', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(travelerTerms)
      });
      if (res.ok) {
        showMessage('success', 'تم حفظ شروط حجز المسافرين بنجاح');
      } else {
        showMessage('error', 'حدث خطأ في الحفظ');
      }
    } catch (err) {
      showMessage('error', 'حدث خطأ في الاتصال');
    }
    setSaving(false);
  };

  // Save Contact
  const saveContact = async () => {
    setSaving(true);
    try {
      const res = await fetch(API_URL + '/api/cms/contact', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(contact)
      });
      if (res.ok) {
        showMessage('success', 'تم حفظ معلومات الاتصال بنجاح');
      } else {
        showMessage('error', 'حدث خطأ في الحفظ');
      }
    } catch (err) {
      showMessage('error', 'حدث خطأ في الاتصال');
    }
    setSaving(false);
  };

  // Save Rate Mode
  const saveRateMode = async () => {
    setSaving(true);
    try {
      const res = await fetch(API_URL + '/api/rates/settings/mode', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(rateMode)
      });
      if (res.ok) {
        showMessage('success', 'تم حفظ إعدادات الأسعار بنجاح');
      } else {
        showMessage('error', 'حدث خطأ في الحفظ');
      }
    } catch (err) {
      showMessage('error', 'حدث خطأ في الاتصال');
    }
    setSaving(false);
  };

  // Sync Live Rates
  const syncLiveRates = async () => {
    setSaving(true);
    try {
      const res = await fetch(API_URL + '/api/rates/live/sync', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        showMessage('success', `تم مزامنة ${data.synced} سعر من API`);
      } else {
        showMessage('error', 'حدث خطأ في المزامنة');
      }
    } catch (err) {
      showMessage('error', 'حدث خطأ في الاتصال');
    }
    setSaving(false);
  };

  // Add section to terms
  const addTermsSection = (lang) => {
    setTerms(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        sections: [...(prev[lang].sections || []), { title: '', content: '' }]
      }
    }));
  };

  // Update terms section
  const updateTermsSection = (lang, index, field, value) => {
    setTerms(prev => {
      const newSections = [...(prev[lang].sections || [])];
      newSections[index] = { ...newSections[index], [field]: value };
      return {
        ...prev,
        [lang]: { ...prev[lang], sections: newSections }
      };
    });
  };

  // Remove terms section
  const removeTermsSection = (lang, index) => {
    setTerms(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        sections: prev[lang].sections.filter((_, i) => i !== index)
      }
    }));
  };

  // Update contact field
  const updateContact = (lang, field, value) => {
    setContact(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value }
    }));
  };

  const tabs = [
    { id: 'terms', label: 'الشروط العامة', icon: FileText },
    { id: 'traveler_terms', label: 'شروط المسافرين', icon: Plane },
    { id: 'contact', label: 'معلومات الاتصال', icon: Phone },
    { id: 'rates', label: 'إعدادات الأسعار', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0" data-testid="admin-cms-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المحتوى</h1>
          <p className="text-slate-600">تعديل محتوى الموقع والإعدادات</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 w-full sm:w-auto border border-slate-300 text-slate-700 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50"
          data-testid="refresh-btn"
        >
          <RefreshCw className="w-4 h-4" />تحديث
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          'bg-red-50 text-red-700 border border-red-200'
          }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`tab-${tab.id}`}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === tab.id
              ? 'bg-amber-500 text-white'
              : 'text-slate-600 hover:bg-slate-100'
              } text-sm sm:text-base whitespace-nowrap`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Terms Tab */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-6" data-testid="terms-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              الشروط والأحكام
            </h2>
            <button
              onClick={saveTerms}
              disabled={saving}
              data-testid="save-terms-btn"
              className="px-4 py-2 w-full sm:w-auto bg-amber-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-amber-600"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>

          {/* Language Sections */}
          {['ar', 'en', 'ku'].map(lang => (
            <div key={lang} className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className={`font-bold flex items-center gap-2 ${lang === 'ar' ? 'text-amber-600' : lang === 'en' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                  <Globe className="w-4 h-4" />
                  {lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'کوردی'}
                </h3>
                <button
                  onClick={() => addTermsSection(lang)}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 font-medium"
                >
                  <Plus className="w-4 h-4" /> إضافة قسم
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <Label className="text-sm text-slate-500">العنوان الرئيسي</Label>
                <Input
                  value={terms[lang]?.title || ''}
                  onChange={e => setTerms(prev => ({
                    ...prev,
                    [lang]: { ...prev[lang], title: e.target.value }
                  }))}
                  dir={lang === 'en' ? 'ltr' : 'rtl'}
                  data-testid={`terms-title-${lang}`}
                />
              </div>

              {/* Sections */}
              {(terms[lang]?.sections || []).map((section, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">القسم {idx + 1}</span>
                    <button
                      onClick={() => removeTermsSection(lang, idx)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                  <Input
                    placeholder="عنوان القسم"
                    value={section.title || ''}
                    onChange={e => updateTermsSection(lang, idx, 'title', e.target.value)}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                  />
                  <Textarea
                    placeholder="محتوى القسم"
                    value={section.content || ''}
                    onChange={e => updateTermsSection(lang, idx, 'content', e.target.value)}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    rows={4}
                  />
                </div>
              ))}

              {(!terms[lang]?.sections || terms[lang].sections.length === 0) && (
                <p className="text-center text-slate-500 py-4 italic font-medium">لا توجد أقسام. انقر "إضافة قسم" لإضافة قسم جديد.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Traveler Terms Tab */}
      {activeTab === 'traveler_terms' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-6" data-testid="traveler-terms-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plane className="w-5 h-5 text-amber-500" />
              شروط وأحكام حجز المسافرين
            </h2>
            <button
              onClick={saveTravelerTerms}
              disabled={saving}
              data-testid="save-traveler-terms-btn"
              className="px-4 py-2 w-full sm:w-auto bg-amber-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-amber-600"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>

          {/* Language Sections */}
          {['ar', 'en', 'ku'].map(lang => (
            <div key={lang} className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className={`font-bold flex items-center gap-2 ${lang === 'ar' ? 'text-amber-600' : lang === 'en' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                  <Globe className="w-4 h-4" />
                  {lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'کوردی'}
                </h3>
                <button
                  onClick={() => {
                    setTravelerTerms(prev => ({
                      ...prev,
                      [lang]: { ...prev[lang], sections: [...(prev[lang].sections || []), { title: '', content: '' }] }
                    }));
                  }}
                  className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 font-medium"
                >
                  <Plus className="w-4 h-4" /> إضافة قسم
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <Label className="text-sm text-slate-500">العنوان الرئيسي</Label>
                <Input
                  value={travelerTerms[lang]?.title || ''}
                  onChange={e => setTravelerTerms(prev => ({
                    ...prev,
                    [lang]: { ...prev[lang], title: e.target.value }
                  }))}
                  dir={lang === 'en' ? 'ltr' : 'rtl'}
                />
              </div>

              {/* Sections */}
              {(travelerTerms[lang]?.sections || []).map((section, idx) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">القسم {idx + 1}</span>
                    <button
                      onClick={() => {
                        setTravelerTerms(prev => ({
                          ...prev,
                          [lang]: { ...prev[lang], sections: prev[lang].sections.filter((_, i) => i !== idx) }
                        }));
                      }}
                      className="p-1 text-red-500 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                  <Input
                    placeholder="عنوان القسم"
                    value={section.title || ''}
                    onChange={e => {
                      const newSections = [...travelerTerms[lang].sections];
                      newSections[idx].title = e.target.value;
                      setTravelerTerms(prev => ({
                        ...prev,
                        [lang]: { ...prev[lang], sections: newSections }
                      }));
                    }}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                  />
                  <Textarea
                    placeholder="محتوى القسم"
                    value={section.content || ''}
                    onChange={e => {
                      const newSections = [...travelerTerms[lang].sections];
                      newSections[idx].content = e.target.value;
                      setTravelerTerms(prev => ({
                        ...prev,
                        [lang]: { ...prev[lang], sections: newSections }
                      }));
                    }}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    rows={4}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-6" data-testid="contact-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-amber-500" />
              معلومات الاتصال
            </h2>
            <button
              onClick={saveContact}
              disabled={saving}
              data-testid="save-contact-btn"
              className="px-4 py-2 w-full sm:w-auto bg-amber-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-amber-600"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>

          {/* Language Sections */}
          {['ar', 'en', 'ku'].map(lang => (
            <div key={lang} className="border border-slate-200 rounded-xl p-4 space-y-4">
              <h3 className={`font-bold flex items-center gap-2 ${lang === 'ar' ? 'text-amber-600' : lang === 'en' ? 'text-blue-600' : 'text-green-600'
                }`}>
                <Globe className="w-4 h-4" />
                {lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'کوردی'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> العنوان
                  </Label>
                  <Input
                    value={contact[lang]?.address || ''}
                    onChange={e => updateContact(lang, 'address', e.target.value)}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    data-testid={`contact-address-${lang}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> الهاتف
                  </Label>
                  <Input
                    value={contact[lang]?.phone || ''}
                    onChange={e => updateContact(lang, 'phone', e.target.value)}
                    dir="ltr"
                    data-testid={`contact-phone-${lang}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> واتساب
                  </Label>
                  <Input
                    value={contact[lang]?.whatsapp || ''}
                    onChange={e => updateContact(lang, 'whatsapp', e.target.value)}
                    dir="ltr"
                    data-testid={`contact-whatsapp-${lang}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> البريد الإلكتروني
                  </Label>
                  <Input
                    value={contact[lang]?.email || ''}
                    onChange={e => updateContact(lang, 'email', e.target.value)}
                    dir="ltr"
                    data-testid={`contact-email-${lang}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ساعات العمل
                  </Label>
                  <Input
                    value={contact[lang]?.working_hours || ''}
                    onChange={e => updateContact(lang, 'working_hours', e.target.value)}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                    data-testid={`contact-hours-${lang}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rate Settings Tab */}
      {activeTab === 'rates' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-6" data-testid="rates-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-500" />
              إعدادات أسعار الصرف
            </h2>
            <button
              onClick={saveRateMode}
              disabled={saving}
              data-testid="save-rates-btn"
              className="px-4 py-2 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50 hover:bg-amber-600"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>

          {/* Mode Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-slate-700">وضع تحديث الأسعار</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setRateMode(prev => ({ ...prev, mode: 'manual' }))}
                data-testid="mode-manual"
                className={`p-4 rounded-xl border-2 text-right transition-all ${rateMode.mode === 'manual'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rateMode.mode === 'manual' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">يدوي</p>
                    <p className="text-sm text-slate-500">تحديث الأسعار يدوياً من صفحة الأسعار</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setRateMode(prev => ({ ...prev, mode: 'auto' }))}
                data-testid="mode-auto"
                className={`p-4 rounded-xl border-2 text-right transition-all ${rateMode.mode === 'auto'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rateMode.mode === 'auto' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">تلقائي (API)</p>
                    <p className="text-sm text-slate-500">جلب الأسعار من مصدر خارجي</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Auto Mode Settings */}
          {rateMode.mode === 'auto' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-bold text-blue-800 flex items-center gap-2">
                <Zap className="w-4 h-4" /> إعدادات الوضع التلقائي
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-blue-700">مصدر API</Label>
                  <Input
                    value={rateMode.api_source}
                    onChange={e => setRateMode(prev => ({ ...prev, api_source: e.target.value }))}
                    className="bg-white"
                    data-testid="api-source"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-blue-700">فترة التحديث (دقائق)</Label>
                  <Input
                    type="number"
                    value={rateMode.update_interval_minutes}
                    onChange={e => setRateMode(prev => ({ ...prev, update_interval_minutes: parseInt(e.target.value) || 60 }))}
                    className="bg-white"
                    data-testid="update-interval"
                  />
                </div>
              </div>

              <button
                onClick={syncLiveRates}
                disabled={saving}
                data-testid="sync-rates-btn"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                مزامنة الأسعار الآن
              </button>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>ملاحظة:</strong> في الوضع اليدوي، يتم عرض الأسعار التي تدخلها يدوياً من صفحة "أسعار الصرف".
              في الوضع التلقائي، يتم جلب الأسعار الحية من API خارجي (exchangerate-api.com).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCMS;
