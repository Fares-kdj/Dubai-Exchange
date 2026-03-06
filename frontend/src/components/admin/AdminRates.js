import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, TrendingUp, TrendingDown, Clock, Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [editValues, setEditValues] = useState({ buy_rate: 0, sell_rate: 0 });
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const loadRates = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/api/rates?active_only=false');
      const data = await res.json();
      setRates(data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRates();
    // eslint-disable-next-line
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  };

  const handleEdit = (rate) => {
    setEditingRate(rate.currency_code);
    setEditValues({ buy_rate: rate.buy_rate, sell_rate: rate.sell_rate });
  };

  const handleCancel = () => {
    setEditingRate(null);
    setEditValues({ buy_rate: 0, sell_rate: 0 });
  };

  const handleSave = async (currencyCode) => {
    setSaving(true);
    try {
      await fetch(API_URL + '/api/rates/' + currencyCode, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editValues)
      });
      setEditingRate(null);
      loadRates();
    } catch (err) {
      console.error('Error:', err);
    }
    setSaving(false);
  };

  const handleBulkSave = async () => {
    setSaving(true);
    try {
      const updates = rates.map(function (r) {
        return { currency_code: r.currency_code, buy_rate: r.buy_rate, sell_rate: r.sell_rate };
      });
      await fetch(API_URL + '/api/rates/bulk/update', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rates: updates })
      });
      loadRates();
    } catch (err) {
      console.error('Error:', err);
    }
    setSaving(false);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' });
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
          <h1 className="text-2xl font-bold text-slate-900">أسعار الصرف</h1>
          <p className="text-slate-600">إدارة أسعار شراء وبيع العملات</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadRates}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl flex items-center gap-2 hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            تحديث
          </button>
          <button
            onClick={handleBulkSave}
            disabled={saving}
            className="px-4 py-2 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ الكل'}
          </button>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">العملة</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  سعر الشراء
                </div>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  سعر البيع
                </div>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">الفرق</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">آخر تحديث</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rates.map(function (rate) {
              const isEditing = editingRate === rate.currency_code;
              const spread = rate.sell_rate - rate.buy_rate;

              return (
                <tr key={rate.currency_code} className={rate.is_active ? '' : 'opacity-50 bg-slate-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 flex items-center justify-center bg-slate-100 rounded overflow-hidden shadow-sm border border-slate-200">
                        <img
                          src={rate.flag && rate.flag.length > 4 ? rate.flag : `https://flagcdn.com/w80/${(rate.currency_code === 'IQD' ? 'iq' : (rate.currency_code === 'USD' ? 'us' : (rate.currency_code === 'EUR' ? 'eu' : rate.currency_code.substring(0, 2).toLowerCase())))}.png`}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://flagcdn.com/w80/un.png'; }}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{rate.currency_code}</p>
                        <p className="text-sm text-slate-500">{rate.currency_name_ar}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.buy_rate}
                        onChange={function (e) { setEditValues(Object.assign({}, editValues, { buy_rate: parseFloat(e.target.value) || 0 })); }}
                        className="w-28 mx-auto text-center"
                      />
                    ) : (
                      <span className="font-mono text-lg font-semibold text-green-600">{rate.buy_rate.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.sell_rate}
                        onChange={function (e) { setEditValues(Object.assign({}, editValues, { sell_rate: parseFloat(e.target.value) || 0 })); }}
                        className="w-28 mx-auto text-center"
                      />
                    ) : (
                      <span className="font-mono text-lg font-semibold text-red-600">{rate.sell_rate.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-sm rounded-full font-mono">
                      {spread.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatTime(rate.updated_at)}
                    </div>
                    {rate.updated_by && (
                      <p className="text-xs text-slate-400">{rate.updated_by}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isEditing ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={function () { handleSave(rate.currency_code); }}
                          disabled={saving}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={function () { handleEdit(rate); }}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>ملاحظة:</strong> الأسعار بالدينار العراقي (IQD) لكل وحدة من العملة الأجنبية.
          سعر الشراء = السعر الذي تشتري به من العميل. سعر البيع = السعر الذي تبيع به للعميل.
        </p>
      </div>
    </div>
  );
};

export default AdminRates;
