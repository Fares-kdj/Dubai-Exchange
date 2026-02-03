import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCountry, setEditingCountry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedCountry, setExpandedCountry] = useState(null);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const emptyForm = {
    country_code: '',
    name_ar: '',
    name_en: '',
    flag: '',
    currency: '',
    is_active: true,
    transfer_methods: []
  };

  const emptyMethod = {
    method_id: '',
    name_ar: '',
    name_en: '',
    fee_type: 'percentage',
    fee_value: 2,
    is_active: true
  };

  const [formData, setFormData] = useState(emptyForm);
  const [newMethod, setNewMethod] = useState(emptyMethod);

  useEffect(() => {
    loadCountries();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  };

  const loadCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/api/cms/countries');
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const handleToggleActive = async (country) => {
    try {
      await fetch(API_URL + '/api/cms/countries/' + country.country_code, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !country.is_active })
      });
      loadCountries();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (countryCode) => {
    if (!window.confirm('حذف؟')) return;
    try {
      await fetch(API_URL + '/api/cms/countries/' + countryCode, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      loadCountries();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (country) => {
    setFormData({
      country_code: country.country_code,
      name_ar: country.name_ar,
      name_en: country.name_en,
      flag: country.flag,
      currency: country.currency,
      is_active: country.is_active,
      transfer_methods: country.transfer_methods || []
    });
    setEditingCountry(country);
    setShowForm(true);
  };

  const handleNew = () => {
    setFormData(emptyForm);
    setEditingCountry(null);
    setShowForm(true);
  };

  const handleAddMethod = () => {
    if (!newMethod.method_id || !newMethod.name_ar) return;
    const methods = [...formData.transfer_methods, newMethod];
    setFormData({ ...formData, transfer_methods: methods });
    setNewMethod(emptyMethod);
  };

  const handleRemoveMethod = (methodId) => {
    const methods = formData.transfer_methods.filter(m => m.method_id !== methodId);
    setFormData({ ...formData, transfer_methods: methods });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCountry 
        ? API_URL + '/api/cms/countries/' + editingCountry.country_code
        : API_URL + '/api/cms/countries';
      
      await fetch(url, {
        method: editingCountry ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      loadCountries();
    } catch (err) {
      console.error('Error:', err);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الدول</h1>
          <p className="text-slate-600">دول التحويل الدولي</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة دولة
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-2">
        {countries.map((country) => (
          <div
            key={country.country_code}
            className={'flex items-center gap-4 p-4 rounded-xl border-2 ' + (country.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60')}
          >
            <div className="text-3xl">{country.flag}</div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{country.name_ar}</h3>
              <p className="text-sm text-slate-500">
                {country.name_en} • {country.currency} • {(country.transfer_methods || []).length} طرق
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpandedCountry(expandedCountry === country.country_code ? null : country.country_code)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                {expandedCountry === country.country_code ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              <button onClick={() => handleToggleActive(country)} className={'p-2 rounded-lg ' + (country.is_active ? 'text-green-600' : 'text-slate-400')}>
                {country.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
              <button onClick={() => handleEdit(country)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(country.country_code)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingCountry ? 'تعديل' : 'إضافة دولة'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>كود الدولة</Label>
                  <Input
                    value={formData.country_code}
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                    placeholder="TR"
                    maxLength={2}
                    disabled={!!editingCountry}
                  />
                </div>
                <div className="space-y-2">
                  <Label>العلم</Label>
                  <Input
                    value={formData.flag}
                    onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                    placeholder="🇹🇷"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربي</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزي</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>العملة</Label>
                <Input
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                  placeholder="TRY"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-bold">طرق التحويل</Label>
                {formData.transfer_methods.map(method => (
                  <div key={method.method_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{method.name_ar}</p>
                      <p className="text-sm text-slate-500">{method.fee_value}%</p>
                    </div>
                    <button type="button" onClick={() => handleRemoveMethod(method.method_id)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="border-2 border-dashed rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={newMethod.method_id}
                      onChange={(e) => setNewMethod({ ...newMethod, method_id: e.target.value })}
                      placeholder="معرف الطريقة"
                    />
                    <Input
                      value={newMethod.name_ar}
                      onChange={(e) => setNewMethod({ ...newMethod, name_ar: e.target.value })}
                      placeholder="الاسم بالعربي"
                    />
                    <Input
                      value={newMethod.name_en}
                      onChange={(e) => setNewMethod({ ...newMethod, name_en: e.target.value })}
                      placeholder="Name"
                    />
                    <Input
                      type="number"
                      value={newMethod.fee_value}
                      onChange={(e) => setNewMethod({ ...newMethod, fee_value: parseFloat(e.target.value) || 0 })}
                      placeholder="الرسوم %"
                    />
                  </div>
                  <button type="button" onClick={handleAddMethod} className="w-full py-2 border-2 border-amber-500 text-amber-500 rounded-lg">
                    + إضافة طريقة
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-amber-500 text-white rounded-xl flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCountries;
