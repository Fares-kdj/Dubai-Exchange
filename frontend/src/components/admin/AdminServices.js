import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, 
  Plane, MapPin, Globe, Package, Star, CreditCard, Wallet, ArrowLeftRight,
  GripVertical, ChevronUp, ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Icon options
const iconOptions = [
  { value: 'Plane', label: 'طائرة', Icon: Plane },
  { value: 'MapPin', label: 'موقع', Icon: MapPin },
  { value: 'Globe', label: 'كرة أرضية', Icon: Globe },
  { value: 'Package', label: 'حزمة', Icon: Package },
  { value: 'CreditCard', label: 'بطاقة', Icon: CreditCard },
  { value: 'Wallet', label: 'محفظة', Icon: Wallet },
  { value: 'ArrowLeftRight', label: 'تحويل', Icon: ArrowLeftRight },
];

// Hero services (pinned services that always show in hero section)
const HERO_SERVICE_IDS = ['traveler-usd', 'transfers', 'usdt-topup', 'card-recharge'];

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = {
    service_id: '',
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    icon: 'Package',
    color: '#D4AF37',
    is_active: true,
    is_hero_pinned: false,
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
      // Sort by order
      setServices(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
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

  const handleToggleHero = async (service) => {
    try {
      await fetch(API_URL + '/api/cms/services/' + service.service_id, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_hero_pinned: !service.is_hero_pinned })
      });
      loadServices();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
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
      is_hero_pinned: service.is_hero_pinned || false,
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
    if (!formData.name_ar.trim()) {
      alert('يرجى إدخال اسم الخدمة');
      return;
    }

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

  const moveService = async (serviceId, direction) => {
    const currentIndex = services.findIndex(s => s.service_id === serviceId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= services.length) return;

    // Swap orders
    const otherService = services[newIndex];
    try {
      await fetch(API_URL + '/api/cms/services/' + serviceId, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ order: otherService.order })
      });
      await fetch(API_URL + '/api/cms/services/' + otherService.service_id, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ order: services[currentIndex].order })
      });
      loadServices();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const IconComponent = ({ name, className = "w-6 h-6" }) => {
    const iconConfig = iconOptions.find(i => i.value === name);
    const Icon = iconConfig?.Icon || Package;
    return <Icon className={className} />;
  };

  const isHeroService = (serviceId) => HERO_SERVICE_IDS.includes(serviceId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  // Separate hero and regular services
  const heroServices = services.filter(s => s.is_hero_pinned || isHeroService(s.service_id));
  const regularServices = services.filter(s => !s.is_hero_pinned && !isHeroService(s.service_id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الخدمات</h1>
          <p className="text-slate-600">إدارة خدمات الموقع وتحديد الخدمات الرئيسية</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadServices} className="p-2 hover:bg-slate-100 rounded-lg">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button onClick={handleNew} className="px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-xl flex items-center gap-2 hover:bg-[#c9a431]">
            <Plus className="w-5 h-5" />
            إضافة خدمة
          </button>
        </div>
      </div>

      {/* Hero Services Section */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">الخدمات الرئيسية (Hero)</h2>
          <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-full">{heroServices.length} خدمات</span>
        </div>
        <p className="text-sm text-slate-600 mb-4">هذه الخدمات تظهر في القسم الرئيسي من الصفحة الأولى</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {heroServices.map((service) => (
            <ServiceCard 
              key={service.service_id}
              service={service}
              isHero={true}
              onToggleActive={handleToggleActive}
              onToggleHero={handleToggleHero}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMove={moveService}
              IconComponent={IconComponent}
              isProtectedHero={isHeroService(service.service_id)}
            />
          ))}
        </div>
      </div>

      {/* Regular Services Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-900">الخدمات الإضافية</h2>
          <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full">{regularServices.length} خدمات</span>
        </div>
        
        {regularServices.length === 0 ? (
          <p className="text-slate-500 text-center py-8">لا توجد خدمات إضافية</p>
        ) : (
          <div className="space-y-3">
            {regularServices.map((service) => (
              <ServiceCard 
                key={service.service_id}
                service={service}
                isHero={false}
                onToggleActive={handleToggleActive}
                onToggleHero={handleToggleHero}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMove={moveService}
                IconComponent={IconComponent}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>معرف الخدمة (Slug)</Label>
                  <Input
                    value={formData.service_id}
                    onChange={(e) => setFormData({...formData, service_id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    disabled={!!editingService}
                    placeholder="traveler-usd"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>نوع الخدمة</Label>
                  <Select value={formData.service_type} onValueChange={(v) => setFormData({...formData, service_type: v})}>
                    <SelectTrigger><SelectValue placeholder="اختر النوع..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">حجز</SelectItem>
                      <SelectItem value="transfer">تحويل</SelectItem>
                      <SelectItem value="recharge">شحن</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربية *</Label>
                  <Input
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    required
                    placeholder="حجز الدولار"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزية</Label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    placeholder="Traveler USD"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الأيقونة</Label>
                  <Select value={formData.icon} onValueChange={(v) => setFormData({...formData, icon: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.Icon className="w-4 h-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
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
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input 
                      value={formData.color} 
                      onChange={(e) => setFormData({...formData, color: e.target.value})} 
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>الرابط (Route)</Label>
                <Input
                  value={formData.route}
                  onChange={(e) => setFormData({...formData, route: e.target.value})}
                  placeholder="/traveler-booking"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-6 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <span>الخدمة مفعلة</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_hero_pinned}
                    onChange={(e) => setFormData({...formData, is_hero_pinned: e.target.checked})}
                    className="w-4 h-4 rounded"
                  />
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    تثبيت في Hero
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-slate-900 rounded-xl flex items-center gap-2 hover:bg-[#c9a431]">
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

// Service Card Component
const ServiceCard = ({ service, isHero, onToggleActive, onToggleHero, onEdit, onDelete, onMove, IconComponent, isProtectedHero = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
        service.is_active 
          ? isHero ? 'border-amber-300 bg-white' : 'border-slate-200 bg-white' 
          : 'border-slate-100 bg-slate-50 opacity-60'
      }`}
    >
      {/* Drag Handle */}
      <div className="flex flex-col gap-1">
        <button onClick={() => onMove(service.service_id, 'up')} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
          <ChevronUp className="w-4 h-4" />
        </button>
        <button onClick={() => onMove(service.service_id, 'down')} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Icon */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
        style={{ backgroundColor: service.color + '20' }}
      >
        <IconComponent name={service.icon} style={{ color: service.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 truncate">{service.name_ar}</h3>
          {isProtectedHero && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">محمي</span>
          )}
        </div>
        <p className="text-sm text-slate-500 truncate">{service.name_en} • {service.route}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Hero Toggle */}
        {!isProtectedHero && (
          <button 
            onClick={() => onToggleHero(service)} 
            className={`p-2 rounded-lg transition-colors ${service.is_hero_pinned ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
            title={service.is_hero_pinned ? 'إزالة من Hero' : 'تثبيت في Hero'}
          >
            <Star className={`w-5 h-5 ${service.is_hero_pinned ? 'fill-amber-500' : ''}`} />
          </button>
        )}
        
        {/* Active Toggle */}
        <button 
          onClick={() => onToggleActive(service)} 
          className={`p-2 rounded-lg ${service.is_active ? 'text-green-600' : 'text-slate-400'}`}
          title={service.is_active ? 'تعطيل' : 'تفعيل'}
        >
          {service.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
        </button>
        
        {/* Edit */}
        <button 
          onClick={() => onEdit(service)} 
          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
          title="تعديل"
        >
          <Edit className="w-5 h-5" />
        </button>
        
        {/* Delete */}
        {!isProtectedHero && (
          <button 
            onClick={() => onDelete(service.service_id)} 
            className="p-2 hover:bg-red-100 rounded-lg text-red-600"
            title="حذف"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AdminServices;
