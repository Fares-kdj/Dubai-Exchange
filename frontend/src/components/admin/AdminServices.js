import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, GripVertical, Save, X, RefreshCw, Plane, MapPin, Globe, ArrowRightLeft, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const iconOptions = [
  { value: 'Plane', label: 'طائرة' },
  { value: 'MapPin', label: 'موقع' },
  { value: 'Globe', label: 'عالم' },
  { value: 'ArrowRightLeft', label: 'تحويل' },
  { value: 'Package', label: 'طرد' },
];

const IconComponent = ({ name, className }) => {
  const icons = { Plane, MapPin, Globe, ArrowRightLeft, Package };
  const Icon = icons[name] || Package;
  return <Icon className={className} />;
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    service_id: '',
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    icon: 'Package',
    color: '#D4AF37',
    is_active: true,
    order: 0,
    route: '',
    service_type: ''
  });

  useEffect(() => {
    fetchServices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/cms/services`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
    setLoading(false);
  };

  const handleToggleActive = async (service) => {
    try {
      await fetch(`${API_URL}/api/cms/services/${service.service_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !service.is_active })
      });
      fetchServices();
    } catch (err) {
      console.error('Error toggling service:', err);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    try {
      await fetch(`${API_URL}/api/cms/services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      service_id: service.service_id,
      name_ar: service.name_ar,
      name_en: service.name_en,
      description_ar: service.description_ar || '',
      description_en: service.description_en || '',
      icon: service.icon,
      color: service.color,
      is_active: service.is_active,
      order: service.order,
      route: service.route,
      service_type: service.service_type
    });
    setEditingService(service);
    setShowForm(true);
  };

  const handleNew = () => {
    setFormData({
      service_id: '',
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      icon: 'Package',
      color: '#D4AF37',
      is_active: true,
      order: services.length,
      route: '',
      service_type: ''
    });
    setEditingService(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await fetch(`${API_URL}/api/cms/services/${editingService.service_id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_URL}/api/cms/services`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(formData)
        });
      }
      setShowForm(false);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
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
          <h1 className="text-2xl font-bold text-slate-900">إدارة الخدمات</h1>
          <p className="text-slate-600">إضافة وتعديل الخدمات المتاحة في الموقع</p>
        </div>
        <motion.button
          onClick={handleNew}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة خدمة
        </motion.button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid gap-4 p-4">
          {services.map((service, index) => (
            <motion.div
              key={service.service_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                service.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
              
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: service.color + '20' }}
              >
                <IconComponent name={service.icon} className="w-6 h-6" style={{ color: service.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900">{service.name_ar}</h3>
                <p className="text-sm text-slate-500">{service.name_en} • {service.route}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`p-2 rounded-lg ${service.is_active ? 'text-green-600' : 'text-slate-400'}`}
                  title={service.is_active ? 'إيقاف' : 'تفعيل'}
                >
                  {service.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                  title="تعديل"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(service.service_id)}
                  className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
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
                {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>معرف الخدمة (Service ID)</Label>
                  <Input
                    value={formData.service_id}
                    onChange={(e) => setFormData(p => ({ ...p, service_id: e.target.value }))}
                    placeholder="traveler_booking"
                    disabled={!!editingService}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع الخدمة</Label>
                  <Input
                    value={formData.service_type}
                    onChange={(e) => setFormData(p => ({ ...p, service_type: e.target.value }))}
                    placeholder="traveler, local, international"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربي *</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData(p => ({ ...p, name_ar: e.target.value }))}
                    placeholder="حجز الدولار للمسافرين"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزي *</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData(p => ({ ...p, name_en: e.target.value }))}
                    placeholder="Traveler USD Booking"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الوصف بالعربي</Label>
                  <Input
                    value={formData.description_ar}
                    onChange={(e) => setFormData(p => ({ ...p, description_ar: e.target.value }))}
                    placeholder="وصف الخدمة"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوصف بالإنجليزي</Label>
                  <Input
                    value={formData.description_en}
                    onChange={(e) => setFormData(p => ({ ...p, description_en: e.target.value }))}
                    placeholder="Service description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <Select value={formData.icon} onValueChange={(v) => setFormData(p => ({ ...p, icon: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الترتيب</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الرابط (Route)</Label>
                <Input
                  value={formData.route}
                  onChange={(e) => setFormData(p => ({ ...p, route: e.target.value }))}
                  placeholder="/traveler-booking"
                  className="font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active">الخدمة مفعلة</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-xl flex items-center gap-2"
                >
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

export default AdminServices;
