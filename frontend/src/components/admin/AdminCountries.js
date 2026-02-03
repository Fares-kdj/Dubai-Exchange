import React, { useState, useEffect } from 'react';
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

  const [formData, setFormData] = useState({
    country_code: '',
    name_ar: '',
    name_en: '',
    flag: '',
    currency: '',
    is_active: true,
    transfer_methods: []
  });

  const [newMethod, setNewMethod] = useState({
    method_id: '',
    name_ar: '',
    name_en: '',
    fee_type: 'percentage',
    fee_value: 2,
    is_active: true
  });

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

  useEffect(() => {
    loadCountries();
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

  const handleDelete = async (code) => {
    if (!window.confirm('حذف؟')) return;
    try {
      await fetch(API_URL + '/api/cms/countries/' + code, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      loadCountries();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (country) => {
    const newFormData = {
      country_code: country.country_code,
      name_ar: country.name_ar,
      name_en: country.name_en,
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
    const newMethods = [...formData.transfer_methods, Object.assign({}, newMethod)];
    setFormData(Object.assign({}, formData, { transfer_methods: newMethods }));
    setNewMethod({
      method_id: '',
      name_ar: '',
      name_en: '',
      fee_type: 'percentage',
      fee_value: 2,
      is_active: true
    });
  };

  const handleRemoveMethod = (id) => {
    const filtered = formData.transfer_methods.filter(function(m) {
      return m.method_id !== id;
    });
    setFormData(Object.assign({}, formData, { transfer_methods: filtered }));
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
        <button onClick={handleNew} className="px-4 py-2 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة دولة
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-2">
        {countries.map(function(country) {
          const isActive = country.is_active;
          const isExpanded = expandedCountry === country.country_code;
          const methods = country.transfer_methods || [];

          return (
            <div key={country.country_code} className={isActive ? 'rounded-xl border-2 border-slate-200' : 'rounded-xl border-2 border-slate-100 opacity-60'}>
              <div className="flex items-center gap-4 p-4">
                <div className="text-3xl">{country.flag}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{country.name_ar}</h3>
                  <p className="text-sm text-slate-500">{country.name_en} • {country.currency} • {methods.length} طرق</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={function() { setExpandedCountry(isExpanded ? null : country.country_code); }} className="p-2 hover:bg-slate-100 rounded-lg">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button onClick={function() { handleToggleActive(country); }} className={isActive ? 'p-2 rounded-lg text-green-600' : 'p-2 rounded-lg text-slate-400'}>
                    {isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <button onClick={function() { handleEdit(country); }} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={function() { handleDelete(country.country_code); }} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {isExpanded && methods.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    {methods.map(function(m) {
                      return (
                        <div key={m.method_id} className="flex justify-between text-sm bg-white p-2 rounded">
                          <span>{m.name_ar}</span>
                          <span className="text-slate-500">{m.fee_value}%</span>
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
              <button onClick={function() { setShowForm(false); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>كود الدولة</Label>
                  <Input
                    value={formData.country_code}
                    onChange={function(e) { setFormData(Object.assign({}, formData, { country_code: e.target.value.toUpperCase() })); }}
                    maxLength={2}
                    disabled={!!editingCountry}
                  />
                </div>
                <div className="space-y-2">
                  <Label>العلم</Label>
                  <Input
                    value={formData.flag}
                    onChange={function(e) { setFormData(Object.assign({}, formData, { flag: e.target.value })); }}
                    placeholder="🇹🇷"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربي</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={function(e) { setFormData(Object.assign({}, formData, { name_ar: e.target.value })); }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزي</Label>
                  <Input
                    value={formData.name_en}
                    onChange={function(e) { setFormData(Object.assign({}, formData, { name_en: e.target.value })); }}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>العملة</Label>
                <Input
                  value={formData.currency}
                  onChange={function(e) { setFormData(Object.assign({}, formData, { currency: e.target.value.toUpperCase() })); }}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-bold">طرق التحويل</Label>
                {formData.transfer_methods.map(function(m) {
                  return (
                    <div key={m.method_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{m.name_ar}</p>
                        <p className="text-sm text-slate-500">{m.fee_value}%</p>
                      </div>
                      <button type="button" onClick={function() { handleRemoveMethod(m.method_id); }} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
                <div className="border-2 border-dashed rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={newMethod.method_id}
                      onChange={function(e) { setNewMethod(Object.assign({}, newMethod, { method_id: e.target.value })); }}
                      placeholder="المعرف"
                    />
                    <Input
                      value={newMethod.name_ar}
                      onChange={function(e) { setNewMethod(Object.assign({}, newMethod, { name_ar: e.target.value })); }}
                      placeholder="الاسم"
                    />
                    <Input
                      value={newMethod.name_en}
                      onChange={function(e) { setNewMethod(Object.assign({}, newMethod, { name_en: e.target.value })); }}
                      placeholder="Name"
                    />
                    <Input
                      type="number"
                      value={newMethod.fee_value}
                      onChange={function(e) { setNewMethod(Object.assign({}, newMethod, { fee_value: parseFloat(e.target.value) || 0 })); }}
                      placeholder="%"
                    />
                  </div>
                  <button type="button" onClick={handleAddMethod} className="w-full py-2 border-2 border-amber-500 text-amber-500 rounded-lg">
                    + إضافة
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={function() { setShowForm(false); }} className="px-4 py-2 text-slate-600">
                  إلغاء
                </button>
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
