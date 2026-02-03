import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, Globe, ChevronDown, ChevronUp } from 'lucide-react';
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

  useEffect(() => {
    fetchCountries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cms/countries`);
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
    setLoading(false);
  };

  const handleToggleActive = async (country) => {
    try {
      await fetch(`${API_URL}/api/cms/countries/${country.country_code}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !country.is_active })
      });
      fetchCountries();
    } catch (err) {
      console.error('Error toggling country:', err);
    }
  };

  const handleDelete = async (countryCode) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الدولة؟')) return;
    try {
      await fetch(`${API_URL}/api/cms/countries/${countryCode}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      fetchCountries();
    } catch (err) {
      console.error('Error deleting country:', err);
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
    setFormData(p => ({
      ...p,
      transfer_methods: [...p.transfer_methods, { ...newMethod }]
    }));
    setNewMethod({
      method_id: '',
      name_ar: '',
      name_en: '',
      fee_type: 'percentage',
      fee_value: 2,
      is_active: true
    });
  };

  const handleRemoveMethod = (methodId) => {
    setFormData(p => ({
      ...p,
      transfer_methods: p.transfer_methods.filter(m => m.method_id !== methodId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCountry) {
        await fetch(`${API_URL}/api/cms/countries/${editingCountry.country_code}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_URL}/api/cms/countries`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });
      }
      setShowForm(false);
      fetchCountries();
    } catch (err) {
      console.error('Error saving country:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الدول</h1>
          <p className="text-slate-600">إضافة وتعديل دول التحويل الدولي وطرق التحويل</p>
        </div>
        <motion.button
          onClick={handleNew}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة دولة
        </motion.button>
      </div>

      {/* Countries List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid gap-2 p-4">
          {countries.map((country, index) => (
            <motion.div
              key={country.country_code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border-2 ${
                country.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="text-3xl">{country.flag}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{country.name_ar}</h3>
                  <p className="text-sm text-slate-500">{country.name_en} • {country.currency} • {country.transfer_methods?.length || 0} طرق تحويل</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedCountry(expandedCountry === country.country_code ? null : country.country_code)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                  >
                    {expandedCountry === country.country_code ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleToggleActive(country)}
                    className={`p-2 rounded-lg ${country.is_active ? 'text-green-600' : 'text-slate-400'}`}
                  >
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

              {/* Expanded Methods */}
              {expandedCountry === country.country_code && country.transfer_methods?.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium text-slate-600 mb-2">طرق التحويل:</p>
                    {country.transfer_methods.map(method => (
                      <div key={method.method_id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                        <span>{method.name_ar}</span>
                        <span className="text-slate-500">
                          {method.fee_type === 'percentage' ? `${method.fee_value}%` : `${method.fee_value} ثابت`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingCountry ? 'تعديل الدولة' : 'إضافة دولة جديدة'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>كود الدولة (ISO)</Label>
                  <Input
                    value={formData.country_code}
                    onChange={(e) => setFormData(p => ({ ...p, country_code: e.target.value.toUpperCase() }))}
                    placeholder="TR"
                    maxLength={2}
                    disabled={!!editingCountry}
                    className="font-mono uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label>العلم (Emoji)</Label>
                  <Input
                    value={formData.flag}
                    onChange={(e) => setFormData(p => ({ ...p, flag: e.target.value }))}
                    placeholder="🇹🇷"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربي *</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData(p => ({ ...p, name_ar: e.target.value }))}
                    placeholder="تركيا"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزي *</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData(p => ({ ...p, name_en: e.target.value }))}
                    placeholder="Turkey"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>العملة</Label>
                <Input
                  value={formData.currency}
                  onChange={(e) => setFormData(p => ({ ...p, currency: e.target.value.toUpperCase() }))}
                  placeholder="TRY"
                  className="font-mono uppercase"
                />
              </div>

              {/* Transfer Methods */}
              <div className="space-y-4">
                <Label className="text-lg font-bold">طرق التحويل</Label>
                
                {/* Existing Methods */}
                {formData.transfer_methods.length > 0 && (
                  <div className="space-y-2">
                    {formData.transfer_methods.map(method => (
                      <div key={method.method_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{method.name_ar}</p>
                          <p className="text-sm text-slate-500">{method.name_en} • {method.fee_type === 'percentage' ? `${method.fee_value}%` : `${method.fee_value}`}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMethod(method.method_id)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Method */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium text-slate-600">إضافة طريقة تحويل جديدة</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={newMethod.method_id}
                      onChange={(e) => setNewMethod(p => ({ ...p, method_id: e.target.value }))}
                      placeholder="معرف الطريقة (papara)"
                      className="font-mono"
                    />
                    <Input
                      value={newMethod.name_ar}
                      onChange={(e) => setNewMethod(p => ({ ...p, name_ar: e.target.value }))}
                      placeholder="الاسم بالعربي"
                    />
                    <Input
                      value={newMethod.name_en}
                      onChange={(e) => setNewMethod(p => ({ ...p, name_en: e.target.value }))}
                      placeholder="Name in English"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newMethod.fee_type}
                        onChange={(e) => setNewMethod(p => ({ ...p, fee_type: e.target.value }))}
                        className="flex-1 border rounded-lg px-3"
                      >
                        <option value="percentage">نسبة %</option>
                        <option value="fixed">ثابت</option>
                      </select>
                      <Input
                        type="number"
                        value={newMethod.fee_value}
                        onChange={(e) => setNewMethod(p => ({ ...p, fee_value: parseFloat(e.target.value) || 0 }))}
                        className="w-20"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMethod}
                    className="w-full py-2 border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors"
                  >
                    + إضافة الطريقة
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">الدولة مفعلة</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-xl flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  حفظ
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCountries;
