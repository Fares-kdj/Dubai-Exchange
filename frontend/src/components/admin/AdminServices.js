import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, Plane, MapPin, Globe, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const emptyForm = {
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
  };

  const [formData, setFormData] = useState(emptyForm);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/api/cms/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  };

  const handleToggleActive = async (service) => {
    try {
      await fetch(API_URL + '/api/cms/services/' + service.service_id, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !service.is_active })
      });
      loadServices();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('حذف؟')) return;
    try {
      await fetch(API_URL + '/api/cms/services/' + serviceId, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      loadServices();
    } catch (err) {
      console.error('Error:', err);
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
    setFormData({...emptyForm, order: services.length});
    setEditingService(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingService 
        ? API_URL + '/api/cms/services/' + editingService.service_id
        : API_URL + '/api/cms/services';
      
      await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      setShowForm(false);
      loadServices();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const IconComponent = ({ name }) => {
    const icons = { Plane, MapPin, Globe, Package };
    const Icon = icons[name] || Package;
    return <Icon className="w-6 h-6" />;
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
          <h1 className="text-2xl font-bold text-slate-900">إدارة الخدمات</h1>
          <p className="text-slate-600">إضافة وتعديل الخدمات</p>
        </div>
        <button onClick={handleNew} className="px-4 py-2 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة خدمة
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
        {services.map((service) => (
          <div
            key={service.service_id}
            className={'flex items-center gap-4 p-4 rounded-xl border-2 ' + (service.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60')}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: service.color + '20' }}>
              <IconComponent name={service.icon} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">{service.name_ar}</h3>
              <p className="text-sm text-slate-500">{service.name_en} • {service.route}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleToggleActive(service)} className={'p-2 rounded-lg ' + (service.is_active ? 'text-green-600' : 'text-slate-400')}>
                {service.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
              <button onClick={() => handleEdit(service)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(service.service_id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
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
              <h2 className="text-xl font-bold">{editingService ? 'تعديل الخدمة' : 'إضافة خدمة'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>معرف الخدمة</Label>
                  <Input
                    value={formData.service_id}
                    onChange={(e) => setFormData({...formData, service_id: e.target.value})}
                    disabled={!!editingService}
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع الخدمة</Label>
                  <Input
                    value={formData.service_type}
                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربي</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزي</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اللون</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-12 h-10 rounded"
                    />
                    <Input value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>الرابط</Label>
                  <Input
                    value={formData.route}
                    onChange={(e) => setFormData({...formData, route: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <Label>الخدمة مفعلة</Label>
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

export default AdminServices;
