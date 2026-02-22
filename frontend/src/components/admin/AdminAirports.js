import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Plane, MapPin, Stamp, PenTool, Plus, Edit2, Trash2, 
  Upload, Check, X, RefreshCw, Image, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const stampTypeConfig = {
  airport: { label: 'مطار', icon: Plane, color: 'bg-blue-100 text-blue-700' },
  border: { label: 'منفذ حدودي', icon: MapPin, color: 'bg-green-100 text-green-700' },
  company: { label: 'ختم الشركة', icon: Stamp, color: 'bg-purple-100 text-purple-700' },
  signature: { label: 'توقيع', icon: PenTool, color: 'bg-amber-100 text-amber-700' },
};

const AdminAirports = () => {
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('airport');
  const [showModal, setShowModal] = useState(false);
  const [editingStamp, setEditingStamp] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    stamp_type: 'airport',
    is_active: true,
    sort_order: 0
  });

  const getToken = () => localStorage.getItem('adminToken');

  const fetchStamps = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/stamps/?stamp_type=${activeTab}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStamps(data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStamps();
  }, [activeTab]);

  const handleSubmit = async () => {
    if (!formData.name_ar.trim()) {
      alert('يرجى إدخال الاسم بالعربية');
      return;
    }

    try {
      const token = getToken();
      const url = editingStamp 
        ? `${API_URL}/api/stamps/${editingStamp.stamp_id}`
        : `${API_URL}/api/stamps/`;
      
      const res = await fetch(url, {
        method: editingStamp ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          stamp_type: activeTab
        })
      });

      if (res.ok) {
        setShowModal(false);
        setEditingStamp(null);
        setFormData({ name_ar: '', name_en: '', stamp_type: activeTab, is_active: true, sort_order: 0 });
        fetchStamps();
      } else {
        const err = await res.json();
        alert(err.detail || 'حدث خطأ');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (stampId) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/stamps/${stampId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchStamps();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleToggleActive = async (stamp) => {
    try {
      const token = getToken();
      await fetch(`${API_URL}/api/stamps/${stamp.stamp_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !stamp.is_active })
      });
      fetchStamps();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleImageUpload = async (stampId, file) => {
    setUploading(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}/api/stamps/${stampId}/upload-image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        fetchStamps();
      } else {
        const err = await res.json();
        alert(err.detail || 'فشل في رفع الصورة');
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setUploading(false);
  };

  const openEditModal = (stamp) => {
    setEditingStamp(stamp);
    setFormData({
      name_ar: stamp.name_ar,
      name_en: stamp.name_en || '',
      stamp_type: stamp.stamp_type,
      is_active: stamp.is_active,
      sort_order: stamp.sort_order
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingStamp(null);
    setFormData({ name_ar: '', name_en: '', stamp_type: activeTab, is_active: true, sort_order: 0 });
    setShowModal(true);
  };

  const tabs = [
    { id: 'airport', label: 'المطارات', icon: Plane },
    { id: 'border', label: 'المنافذ الحدودية', icon: MapPin },
    { id: 'company', label: 'أختام الشركة', icon: Stamp },
    { id: 'signature', label: 'التواقيع', icon: PenTool },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Building2 className="w-7 h-7 text-blue-600" />
            المطارات والأختام
          </h1>
          <p className="text-slate-600 mt-1">إدارة المطارات والمنافذ الحدودية وأختام الشركة</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchStamps} className="p-2 hover:bg-slate-100 rounded-lg">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            إضافة جديد
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : stamps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Building2 className="w-12 h-12 mb-4 opacity-50" />
            <p>لا توجد بيانات</p>
            <button onClick={openAddModal} className="mt-4 text-blue-600 hover:underline">
              إضافة {stampTypeConfig[activeTab]?.label}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {stamps.map(stamp => (
              <motion.div
                key={stamp.stamp_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border-2 overflow-hidden transition-all ${
                  stamp.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60'
                }`}
              >
                {/* Image Area */}
                <div className="h-40 bg-slate-100 relative flex items-center justify-center">
                  {stamp.stamp_image ? (
                    <img 
                      src={stamp.stamp_image} 
                      alt={stamp.name_ar} 
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">لا توجد صورة</p>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <label className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-slate-50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => e.target.files[0] && handleImageUpload(stamp.stamp_id, e.target.files[0])}
                      disabled={uploading}
                    />
                    <Upload className={`w-4 h-4 text-slate-600 ${uploading ? 'animate-pulse' : ''}`} />
                  </label>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{stamp.name_ar}</h3>
                      {stamp.name_en && <p className="text-sm text-slate-500">{stamp.name_en}</p>}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stampTypeConfig[stamp.stamp_type]?.color}`}>
                      {stampTypeConfig[stamp.stamp_type]?.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleActive(stamp)}
                      className={`flex items-center gap-2 text-sm ${stamp.is_active ? 'text-green-600' : 'text-slate-400'}`}
                    >
                      {stamp.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      {stamp.is_active ? 'مفعل' : 'معطل'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(stamp)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(stamp.stamp_id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingStamp ? 'تعديل' : 'إضافة'} {stampTypeConfig[activeTab]?.label}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربية *</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData(p => ({ ...p, name_ar: e.target.value }))}
                    placeholder="أدخل الاسم بالعربية..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزية</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData(p => ({ ...p, name_en: e.target.value }))}
                    placeholder="Enter name in English..."
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">مفعل</Label>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">
                  إلغاء
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingStamp ? 'حفظ التغييرات' : 'إضافة'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAirports;
