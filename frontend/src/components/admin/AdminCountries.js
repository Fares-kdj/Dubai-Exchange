import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ConfirmModal from './ConfirmModal';

const AdminCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCountry, setEditingCountry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showConfirm = (config) => setConfirmConfig({ ...config, isOpen: true });
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    country_code: '',
    name_ar: '',
    name_en: '',
    name_ku: '',
    flag: '',
    currency: '',
    is_active: true,
    transfer_methods: []
  });

  const [newMethod, setNewMethod] = useState({
    method_id: '',
    name_ar: '',
    name_en: '',
    name_ku: '',
    fee_type: 'percentage',
    fee_value: 2,
    exchange_rate: 1.0,
    duration: '',
    fields: [],
    is_active: true
  });
  const [predefinedMethods, setPredefinedMethods] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newField, setNewField] = useState({
    id: '',
    name_ar: '',
    name_en: '',
    name_ku: '',
    placeholder_ar: '',
    placeholder_en: '',
    placeholder_ku: '',
    field_type: 'text',
    required: true,
    options: ''
  });
  const [editingMethodId, setEditingMethodId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [countriesRes, templatesRes] = await Promise.all([
        fetch(API_URL + '/api/cms/countries'),
        fetch(API_URL + '/api/cms/predefined-methods')
      ]);
      const countriesData = await countriesRes.json();
      const templatesData = await templatesRes.json();
      setCountries(countriesData);
      setPredefinedMethods(templatesData);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };
  };

  const handleToggleActive = async (country) => {
    // التحديث الفوري (Optimistic Update)
    const originalCountries = [...countries];
    setCountries(countries.map(c => 
      c.country_code === country.country_code ? { ...c, is_active: !c.is_active } : c
    ));

    try {
      const response = await fetch(API_URL + '/api/cms/countries/' + country.country_code, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !country.is_active })
      });
      if (!response.ok) throw new Error('Failed');
      toast.success('تم تحديث حالة الدولة بنجاح');
    } catch (err) {
      console.error('Error:', err);
      setCountries(originalCountries); // Revert on error
      toast.error('حدث خطأ ما');
    }
  };

  const handleDelete = (code) => {
    showConfirm({
      title: 'حذف الدولة',
      message: 'هل أنت متأكد من حذف هذه الدولة؟ سيتم حذف جميع الربط الخاص بها.',
      onConfirm: async () => {
        const originalCountries = [...countries];
        setCountries(countries.filter(c => c.country_code !== code));
        if (expandedCountry === code) setExpandedCountry(null);

        try {
          const response = await fetch(API_URL + '/api/cms/countries/' + code, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          if (!response.ok) throw new Error('Failed');
          toast.success('تم حذف الدولة بنجاح');
        } catch (err) {
          console.error('Error:', err);
          setCountries(originalCountries);
          toast.error('حدث خطأ ما');
        }
      }
    });
  };

  const handleEdit = (country) => {
    const newFormData = {
      country_code: country.country_code,
      name_ar: country.name_ar,
      name_en: country.name_en,
      name_ku: country.name_ku || '',
      flag: country.flag,
      currency: country.currency,
      is_active: country.is_active,
      transfer_methods: country.transfer_methods || []
    };
    setFormData(newFormData);
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleNew = () => {
    setFormData({
      country_code: '',
      name_ar: '',
      name_en: '',
      name_ku: '',
      flag: '',
      currency: '',
      is_active: true,
      transfer_methods: []
    });
    setEditingCountry(null);
    setShowForm(true);
  };

  const handleAddMethod = () => {
    if (!newMethod.method_id || !newMethod.name_ar) return;

    let newMethods;
    if (editingMethodId) {
      newMethods = formData.transfer_methods.map(m =>
        m.method_id === editingMethodId ? Object.assign({}, newMethod) : m
      );
    } else {
      newMethods = [...formData.transfer_methods, Object.assign({}, newMethod)];
    }

    setFormData(Object.assign({}, formData, { transfer_methods: newMethods }));
    setNewMethod({
      method_id: '',
      name_ar: '',
      name_en: '',
      name_ku: '',
      fee_type: 'percentage',
      fee_value: 2,
      exchange_rate: 1.0,
      duration: '',
      fields: [],
      is_active: true
    });
    setEditingMethodId(null);
  };

  const handleEditMethod = (method) => {
    setNewMethod(method);
    setEditingMethodId(method.method_id);
  };

  const handleRemoveMethod = (id) => {
    const filtered = formData.transfer_methods.filter(function (m) {
      return m.method_id !== id;
    });
    setFormData(Object.assign({}, formData, { transfer_methods: filtered }));
  };

  const handleApplyTemplate = (templateId) => {
    if (!templateId) return;
    const template = predefinedMethods.find(m => m.method_id === templateId);
    if (template) {
      setNewMethod({ ...template });
      toast.success('تم تطبيق القالب بنجاح');
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!newMethod.name_ar || !newMethod.method_id) {
      toast.error('يرجى ملأ اسم ومعرف الطريقة أولاً');
      return;
    }
    try {
      const response = await fetch(API_URL + '/api/cms/predefined-methods', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newMethod)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'فشل في حفظ القالب');
      }
      toast.success('تم حفظ الطريقة كقالب بنجاح');
      loadData();
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'حدث خطأ ما');
    }
  };

  const handleDeleteTemplate = (id) => {
    showConfirm({
      title: 'حذف القالب',
      message: 'هل أنت متأكد من حذف هذا القالب؟',
      onConfirm: async () => {
        try {
          await fetch(API_URL + '/api/cms/predefined-methods/' + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          loadData();
          toast.success('تم حذف القالب');
        } catch (err) {
          console.error('Error:', err);
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.country_code.length !== 2) {
      toast.error('يجب أن يتكون كود الدولة من حرفين بالضبط');
      return;
    }
    try {
      const url = editingCountry
        ? API_URL + '/api/cms/countries/' + editingCountry.country_code
        : API_URL + '/api/cms/countries';

      const response = await fetch(url, {
        method: editingCountry ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const detail = errorData.detail;
        if (detail === "Country already exists") {
          throw new Error('هذه الدولة موجودة بالفعل');
        }
        throw new Error(detail || 'فشل في حفظ الدولة');
      }

      const savedData = await response.json();
      toast.success(editingCountry ? 'تم تحديث الدولة بنجاح' : 'تم إضافة الدولة بنجاح');
      setShowForm(false);
      
      if (editingCountry) {
        setCountries(countries.map(c => c.country_code === editingCountry.country_code ? savedData : c));
      } else {
        setCountries([...countries, savedData]);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.message || 'حدث خطأ ما');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الدول</h1>
          <p className="text-slate-600">دول التحويل الدولي</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowTemplates(true)} className="flex-1 sm:flex-none justify-center px-4 py-2 border-2 border-slate-200 text-slate-700 font-medium rounded-xl flex items-center gap-2 hover:bg-slate-50">
            <RefreshCw className="w-5 h-5" />
            إدارة القوالب
          </button>
          <button onClick={handleNew} className="flex-1 sm:flex-none justify-center px-4 py-2 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20">
            <Plus className="w-5 h-5" />
            إضافة دولة
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-2">
        {countries.map(function (country) {
          const isActive = country.is_active;
          const isExpanded = expandedCountry === country.country_code;
          const methods = country.transfer_methods || [];

          return (
            <div key={country.country_code} className={isActive ? 'rounded-xl border-2 border-slate-200' : 'rounded-xl border-2 border-slate-100 opacity-60'}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 flex-shrink-0">
                    <img
                      src={country.flag && country.flag.startsWith('http') ? country.flag : `https://flagcdn.com/w80/${country.country_code.toLowerCase()}.png`}
                      alt={country.name_en}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{country.name_ar}</h3>
                    <p className="text-sm text-slate-500 truncate">{country.name_en} • {country.currency} • {methods.length} طرق</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-dashed sm:border-0 border-slate-200">
                  <button onClick={function () { setExpandedCountry(isExpanded ? null : country.country_code); }} className="p-2 hover:bg-slate-100 rounded-lg">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button onClick={function () { handleToggleActive(country); }} className={isActive ? 'p-2 rounded-lg text-green-600' : 'p-2 rounded-lg text-slate-400 hover:bg-red-50'}>
                    {isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <button onClick={function () { handleEdit(country); }} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={function () { handleDelete(country.country_code); }} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {isExpanded && methods.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    {methods.map(function (m) {
                      return (
                        <div key={m.method_id} className="text-sm bg-white p-3 rounded border border-slate-200 shadow-sm">
                          <div className="flex justify-between font-bold mb-1">
                            <span>{m.name_ar}</span>
                            <span dir="ltr" className="text-slate-500 font-normal">{m.exchange_rate} • {m.fee_value}% • {m.duration}</span>
                          </div>
                          {m.fields && m.fields.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {m.fields.map(f => (
                                <span key={f.field_id} className="px-2 py-0.5 bg-slate-100 text-[10px] rounded-full text-slate-600">
                                  {f.name_ar} ({f.field_type === 'file' ? 'صورة' : f.field_type})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingCountry ? 'تعديل' : 'إضافة دولة'}</h2>
              <button onClick={function () { setShowForm(false); }} className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors border-0" title="إغلاق">
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>كود الدولة</Label>
                  <Input
                    value={formData.country_code}
                    onChange={function (e) { setFormData(Object.assign({}, formData, { country_code: e.target.value.toUpperCase().replace(/[^A-Z]/g, '') })); }}
                    maxLength={2}
                    minLength={2}
                    required
                    disabled={!!editingCountry}
                    placeholder="e.g. TR"
                    className="text-slate-900 border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>العلم</Label>
                  <Input
                    value={formData.flag}
                    onChange={function (e) { setFormData(Object.assign({}, formData, { flag: e.target.value })); }}
                    placeholder="رابط صورة (اختياري)"
                    className="text-slate-900 border-slate-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربي</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={function (e) { setFormData(Object.assign({}, formData, { name_ar: e.target.value })); }}
                    required
                    className="text-slate-900 border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزي</Label>
                  <Input
                    value={formData.name_en}
                    onChange={function (e) { setFormData(Object.assign({}, formData, { name_en: e.target.value })); }}
                    required
                    className="text-slate-900 border-slate-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالكوردي</Label>
                  <Input
                    value={formData.name_ku}
                    onChange={function (e) { setFormData(Object.assign({}, formData, { name_ku: e.target.value })); }}
                    className="text-slate-900 border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>العملة</Label>
                  <Input
                    value={formData.currency}
                    onChange={function (e) { setFormData(Object.assign({}, formData, { currency: e.target.value.toUpperCase() })); }}
                    className="text-slate-900 border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-bold">طرق التحويل</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">استخدام قالب:</span>
                    <select
                      className="text-xs border rounded px-2 py-1 bg-white"
                      onChange={(e) => handleApplyTemplate(e.target.value)}
                      value=""
                    >
                      <option value="">اختر قالب...</option>
                      {predefinedMethods.map(m => (
                        <option key={m.method_id} value={m.method_id}>{m.name_ar}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {formData.transfer_methods.map(function (m) {
                  return (
                    <div key={m.method_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{m.name_ar}</p>
                        <p dir="ltr" className="text-sm text-slate-500">{m.exchange_rate} • {m.fee_value}% • {m.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={function () { handleEditMethod(m); }} className="text-blue-500 p-1 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={function () { handleRemoveMethod(m.method_id); }} className="text-red-500 p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="border-2 border-dashed rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">المعرف</Label>
                      <Input
                        value={newMethod.method_id}
                        onChange={function (e) { setNewMethod(Object.assign({}, newMethod, { method_id: e.target.value })); }}
                        placeholder="المعرف"
                        className="text-slate-900 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">الاسم بالعربي</Label>
                      <Input
                        value={newMethod.name_ar}
                        onChange={function (e) { setNewMethod(Object.assign({}, newMethod, { name_ar: e.target.value })); }}
                        placeholder="الاسم"
                        className="text-slate-900 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">الاسم بالإنجليزي</Label>
                      <Input
                        value={newMethod.name_en}
                        onChange={function (e) { setNewMethod(Object.assign({}, newMethod, { name_en: e.target.value })); }}
                        placeholder="Name"
                        className="text-slate-900 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">الاسم بالكوردي</Label>
                      <Input
                        value={newMethod.name_ku}
                        onChange={function (e) { setNewMethod(Object.assign({}, newMethod, { name_ku: e.target.value })); }}
                        placeholder="Nav"
                        className="text-slate-900 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">سعر الصرف</Label>
                      <Input
                        type="number"
                        step="0.00001"
                        value={newMethod.exchange_rate}
                        onChange={function (e) { setNewMethod(Object.assign({}, newMethod, { exchange_rate: parseFloat(e.target.value) || 0 })); }}
                        placeholder="1.0"
                        className="text-slate-900 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-slate-500">العمولة %</Label>
                      <Input
                        type="number"
                        value={newMethod.fee_value}
                        onChange={function (e) { setNewMethod(Object.assign({}, newMethod, { fee_value: parseFloat(e.target.value) || 0 })); }}
                        placeholder="%"
                        className="text-slate-900 border-slate-200"
                      />
                    </div>
                    <div className="col-span-2 p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                      <Label className="font-bold mb-3 block">الحقول المطلوبة (الديناميكية)</Label>
                      <div className="space-y-2 mb-3">
                        {newMethod.fields.map((f, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-lg border text-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold">{f.name_ar}</span>
                                <div className="flex gap-2 text-[10px] text-slate-400">
                                  {f.name_en && <span>EN: {f.name_en}</span>}
                                  {f.name_ku && <span>KU: {f.name_ku}</span>}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${f.required ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                  {f.required ? 'إلزامي' : 'اختياري'}
                                </span>
                                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{f.field_type}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedFields = newMethod.fields.filter((_, i) => i !== idx);
                                    setNewMethod({ ...newMethod, fields: updatedFields });
                                  }}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {f.options && f.options.length > 0 && (
                              <p className="text-[10px] text-slate-500">
                                الخيارات: {f.options.map(o => o.label).join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 p-3 bg-white rounded-lg border">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px]">المعرف</Label>
                            <Input
                              placeholder="e.g. rip"
                              className="text-xs h-9"
                              value={newField.id}
                              onChange={(e) => setNewField({ ...newField, id: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">الاسم بالعربي</Label>
                            <Input
                              placeholder="الاسم بالعربي"
                              className="text-xs h-9"
                              value={newField.name_ar}
                              onChange={(e) => setNewField({ ...newField, name_ar: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">الاسم بالإنجليزي</Label>
                            <Input
                              placeholder="English Name"
                              className="text-xs h-9"
                              value={newField.name_en}
                              onChange={(e) => setNewField({ ...newField, name_en: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">الاسم بالكوردي</Label>
                            <Input
                              placeholder="Nav"
                              className="text-xs h-9"
                              value={newField.name_ku}
                              onChange={(e) => setNewField({ ...newField, name_ku: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px]">Place Holder بالعربي</Label>
                            <Input
                              placeholder="أدخل الرقم..."
                              className="text-xs h-9"
                              value={newField.placeholder_ar}
                              onChange={(e) => setNewField({ ...newField, placeholder_ar: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">Place Holder بالإنكليزي</Label>
                            <Input
                              placeholder="Enter number..."
                              className="text-xs h-9"
                              value={newField.placeholder_en}
                              onChange={(e) => setNewField({ ...newField, placeholder_en: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px]">Place Holder بالكوردي</Label>
                            <Input
                              placeholder="داخل بكرا..."
                              className="text-xs h-9"
                              value={newField.placeholder_ku}
                              onChange={(e) => setNewField({ ...newField, placeholder_ku: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="w-full h-9 text-xs rounded-md border border-slate-200 bg-white px-3"
                            value={newField.field_type}
                            onChange={(e) => setNewField({ ...newField, field_type: e.target.value })}
                          >
                            <option value="text">نص (Text)</option>
                            <option value="number">رقم (Number)</option>
                            <option value="select">قائمة منسدلة (Dropdown)</option>
                            <option value="date">تاريخ (Date)</option>
                            <option value="file">صورة (Image)</option>
                          </select>
                          <label className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={newField.required}
                              onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                            />
                            حقل إلزامي
                          </label>
                        </div>
                        {newField.field_type === 'select' && (
                          <div className="space-y-1">
                            <Label className="text-[10px]">الخيارات (افصل بينها بفاصلة)</Label>
                            <Input
                              placeholder="خيار 1, خيار 2, خيار 3"
                              className="text-xs h-9"
                              value={newField.options}
                              onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (newField.id && newField.name_ar) {
                              const options = newField.field_type === 'select'
                                ? newField.options.split(',').map(o => ({ value: o.trim().toLowerCase(), label: o.trim() }))
                                : [];

                              const field = {
                                field_id: newField.id.toLowerCase(),
                                name_ar: newField.name_ar,
                                name_en: newField.name_en || newField.id,
                                name_ku: newField.name_ku,
                                placeholder_ar: newField.placeholder_ar,
                                placeholder_en: newField.placeholder_en,
                                placeholder_ku: newField.placeholder_ku,
                                field_type: newField.field_type,
                                required: newField.required,
                                options: options,
                                order: newMethod.fields.length + 1
                              };

                              setNewMethod({ ...newMethod, fields: [...newMethod.fields, field] });
                              setNewField({
                                id: '', name_ar: '', name_en: '', name_ku: '',
                                placeholder_ar: '', placeholder_en: '', placeholder_ku: '',
                                field_type: 'text', required: true, options: ''
                              });
                            }
                          }}
                          className="w-full bg-slate-900 text-white h-9 rounded-lg text-xs"
                        >
                          إضافة حقل
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" onClick={handleAddMethod} className={`flex-1 py-3 border-2 font-bold rounded-xl transition-colors ${editingMethodId ? 'bg-blue-50 border-blue-500 text-blue-600 hover:bg-blue-100' : 'bg-white border-amber-500 text-amber-600 hover:bg-amber-50'}`}>
                      {editingMethodId ? 'تحديث طريقة التحويل' : '+ حفظ طريقة التحويل'}
                    </button>
                    {!editingMethodId && (
                      <button
                        type="button"
                        onClick={handleSaveAsTemplate}
                        className="p-3 border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                        title="حفظ كقالب جديد"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  {editingMethodId && (
                    <button type="button" onClick={() => { setEditingMethodId(null); setNewMethod({ method_id: '', name_ar: '', name_en: '', name_ku: '', fee_type: 'percentage', fee_value: 2, exchange_rate: 1.0, duration: '', fields: [], is_active: true }); }} className="w-full mt-2 py-2 text-sm text-slate-500 underline">
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={function () { setShowForm(false); }} className="px-4 py-2 text-slate-600">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2 bg-amber-500 text-white rounded-xl flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div >
      )}

      {/* Templates Management Modal */}
      {
        showTemplates && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">إدارة قوالب طرق التحويل</h2>
                  <p className="text-sm text-slate-500">القوالب الجاهزة التي يمكن استخدامها في أي دولة</p>
                </div>
                <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-white rounded-xl shadow-sm border border-slate-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8 max-w-2xl mx-auto">
                  {/* Templates List */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> القوالب المتوفرة
                    </h3>
                    <div className="space-y-3">
                      {predefinedMethods.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                          <p className="text-slate-400">لا توجد قوالب حالياً</p>
                        </div>
                      )}
                      {predefinedMethods.map(m => (
                        <div key={m.method_id} className="p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-amber-200 transition-colors shadow-sm group">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-slate-900">{m.name_ar}</h4>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setNewMethod(m); setEditingMethodId(m.method_id); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteTemplate(m.method_id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-600">{m.method_id}</span>
                            <span className="text-[10px] bg-amber-50 px-2 py-1 rounded-full text-amber-700">{m.exchange_rate} • {m.fee_value}%</span>
                            {m.fields.map(f => (
                              <span key={f.field_id} className="text-[10px] bg-blue-50 px-2 py-1 rounded-full text-blue-700">{f.name_ar}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Template Editor (reuses the same state as newMethod) */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
                      <Edit className="w-5 h-5" /> {editingMethodId ? 'تعديل قالب' : 'إنشاء قالب جديد'}
                    </h3>
                    <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">المعرف</Label>
                          <Input
                            value={newMethod.method_id}
                            onChange={(e) => setNewMethod({ ...newMethod, method_id: e.target.value })}
                            placeholder="western_union"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الاسم (Template Name)</Label>
                          <Input
                            value={newMethod.name_ar}
                            onChange={(e) => setNewMethod({ ...newMethod, name_ar: e.target.value })}
                            placeholder="ويسترن يونيون"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الاسم بالإنجليزي</Label>
                          <Input
                            value={newMethod.name_en || ''}
                            onChange={(e) => setNewMethod({ ...newMethod, name_en: e.target.value })}
                            placeholder="Western Union"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">الاسم بالكوردي</Label>
                          <Input
                            value={newMethod.name_ku || ''}
                            onChange={(e) => setNewMethod({ ...newMethod, name_ku: e.target.value })}
                            placeholder="وێستەرن یونیۆن"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">سعر الصرف</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newMethod.exchange_rate}
                            onChange={(e) => setNewMethod({ ...newMethod, exchange_rate: parseFloat(e.target.value) || 0 })}
                            placeholder="1.0"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">العمولة %</Label>
                          <Input
                            type="number"
                            value={newMethod.fee_value}
                            onChange={(e) => setNewMethod({ ...newMethod, fee_value: parseFloat(e.target.value) || 0 })}
                            placeholder="%"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">مدة التحويل</Label>
                          <Input
                            value={newMethod.duration || ''}
                            onChange={(e) => setNewMethod({ ...newMethod, duration: e.target.value })}
                            placeholder="e.g. 5-10 minutes"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border-2 border-slate-200">
                        <Label className="font-bold mb-3 block">الحقول المطلوبة (الديناميكية)</Label>
                        <div className="space-y-2 mb-3">
                          {newMethod.fields.map((f, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg border text-sm space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="font-bold">{f.name_ar}</span>
                                  <div className="flex gap-2 text-[10px] text-slate-400">
                                    {f.name_en && <span>EN: {f.name_en}</span>}
                                    {f.name_ku && <span>KU: {f.name_ku}</span>}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${f.required ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                    {f.required ? 'إلزامي' : 'اختياري'}
                                  </span>
                                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{f.field_type}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedFields = newMethod.fields.filter((_, i) => i !== idx);
                                      setNewMethod({ ...newMethod, fields: updatedFields });
                                    }}
                                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3 p-3 bg-slate-50 rounded-lg border">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                            <div className="space-y-1">
                              <Label className="text-[10px]">المعرف</Label>
                              <Input
                                placeholder="e.g. rip"
                                className="text-xs h-8"
                                value={newField.id}
                                onChange={(e) => setNewField({ ...newField, id: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">الاسم بالعربي</Label>
                              <Input
                                placeholder="الاسم بالعربي"
                                className="text-xs h-8"
                                value={newField.name_ar}
                                onChange={(e) => setNewField({ ...newField, name_ar: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">الاسم بالإنجليزي</Label>
                              <Input
                                placeholder="English Name"
                                className="text-xs h-8"
                                value={newField.name_en}
                                onChange={(e) => setNewField({ ...newField, name_en: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">الاسم بالكوردي</Label>
                              <Input
                                placeholder="Nav"
                                className="text-xs h-8"
                                value={newField.name_ku}
                                onChange={(e) => setNewField({ ...newField, name_ku: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-[10px]">Place Holder بالعربي</Label>
                              <Input
                                placeholder="أدخل الرقم..."
                                className="text-xs h-8"
                                value={newField.placeholder_ar}
                                onChange={(e) => setNewField({ ...newField, placeholder_ar: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Place Holder بالإنكليزي</Label>
                              <Input
                                placeholder="Enter number..."
                                className="text-xs h-8"
                                value={newField.placeholder_en}
                                onChange={(e) => setNewField({ ...newField, placeholder_en: e.target.value })}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Place Holder بالكوردي</Label>
                              <Input
                                placeholder="داخل بكرا..."
                                className="text-xs h-8"
                                value={newField.placeholder_ku}
                                onChange={(e) => setNewField({ ...newField, placeholder_ku: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <select
                              className="w-full h-8 text-[10px] rounded-md border border-slate-200 bg-white px-2"
                              value={newField.field_type}
                              onChange={(e) => setNewField({ ...newField, field_type: e.target.value })}
                            >
                              <option value="text">نص (Text)</option>
                              <option value="number">رقم (Number)</option>
                              <option value="select">قائمة منسدلة (Dropdown)</option>
                              <option value="date">تاريخ (Date)</option>
                              <option value="file">صورة (Image)</option>
                            </select>
                            <label className="flex items-center gap-2 text-[10px]">
                              <input
                                type="checkbox"
                                checked={newField.required}
                                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                              />
                              حقل إلزامي
                            </label>
                          </div>
                          {newField.field_type === 'select' && (
                            <div className="space-y-1">
                              <Label className="text-[10px]">الخيارات (افصل بينها بفاصلة)</Label>
                              <Input
                                placeholder="خيار 1, خيار 2, خيار 3"
                                className="text-xs h-8"
                                value={newField.options}
                                onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                              />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (newField.id && newField.name_ar) {
                                const options = newField.field_type === 'select'
                                  ? newField.options.split(',').map(o => ({ value: o.trim().toLowerCase(), label: o.trim() }))
                                  : [];

                                const field = {
                                  field_id: newField.id.toLowerCase(),
                                  name_ar: newField.name_ar,
                                  name_en: newField.name_en || newField.id,
                                  name_ku: newField.name_ku,
                                  placeholder_ar: newField.placeholder_ar,
                                  placeholder_en: newField.placeholder_en,
                                  placeholder_ku: newField.placeholder_ku,
                                  field_type: newField.field_type,
                                  required: newField.required,
                                  options: options,
                                  order: newMethod.fields.length + 1
                                };

                                setNewMethod({ ...newMethod, fields: [...newMethod.fields, field] });
                                setNewField({
                                  id: '', name_ar: '', name_en: '', name_ku: '',
                                  placeholder_ar: '', placeholder_en: '', placeholder_ku: '',
                                  field_type: 'text', required: true, options: ''
                                });
                              }
                            }}
                            className="w-full bg-slate-900 text-white h-8 rounded-lg text-[10px]"
                          >
                            إضافة حقل
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          if (!newMethod.method_id) return;
                          try {
                            const url = API_URL + '/api/cms/predefined-methods' + (editingMethodId ? '/' + editingMethodId : '');
                            await fetch(url, {
                              method: editingMethodId ? 'PUT' : 'POST',
                              headers: getAuthHeaders(),
                              body: JSON.stringify(newMethod)
                            });
                            toast.success('تم حفظ القالب');
                            setEditingMethodId(null);
                            setNewMethod({ method_id: '', name_ar: '', name_en: '', name_ku: '', fee_type: 'percentage', fee_value: 2, exchange_rate: 1.0, duration: '', fields: [], is_active: true });
                            loadData();
                          } catch (err) { console.error(err); }
                        }}
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
                      >
                        {editingMethodId ? 'تحديث القالب' : 'حفظ كقالب جديد'}
                      </button>
                      {editingMethodId && (
                        <button onClick={() => setEditingMethodId(null)} className="w-full text-xs text-slate-500 underline">إلغاء التعديل</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type="danger"
      />
    </div >
  );
};

export default AdminCountries;
