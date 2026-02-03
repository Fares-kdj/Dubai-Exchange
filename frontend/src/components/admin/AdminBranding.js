import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Upload, Palette, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminBranding = () => {
  const [branding, setBranding] = useState({
    logo_url: '',
    logo_dark_url: '',
    favicon_url: '',
    primary_color: '#D4AF37',
    secondary_color: '#1E293B',
    accent_color: '#FCD34D',
    font_family_ar: 'Cairo',
    font_family_en: 'Inter'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const loadBranding = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/api/cms/branding');
      const data = await res.json();
      setBranding(data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBranding();
    // eslint-disable-next-line
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(API_URL + '/api/cms/branding', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(branding)
      });
      alert('تم الحفظ بنجاح!');
    } catch (err) {
      console.error('Error:', err);
    }
    setSaving(false);
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('adminToken');
      const res = await fetch(API_URL + '/api/cms/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setBranding(Object.assign({}, branding, { [field]: data.url }));
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setUploading(false);
  };

  const updateColor = (field, value) => {
    setBranding(Object.assign({}, branding, { [field]: value }));
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
          <h1 className="text-2xl font-bold text-slate-900">الهوية البصرية</h1>
          <p className="text-slate-600">تعديل الشعار والألوان</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-amber-500 text-white font-medium rounded-xl flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {/* Logo Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Image className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">الشعار</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Main Logo */}
          <div className="space-y-3">
            <Label>الشعار الرئيسي</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center">
              {branding.logo_url ? (
                <img src={branding.logo_url} alt="Logo" className="h-16 mx-auto mb-2" />
              ) : (
                <div className="h-16 flex items-center justify-center text-slate-400">
                  <Image className="w-8 h-8" />
                </div>
              )}
              <label className="cursor-pointer">
                <span className="text-sm text-blue-600 hover:underline">
                  {uploading ? 'جاري الرفع...' : 'رفع صورة'}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={function(e) { handleUpload(e, 'logo_url'); }} />
              </label>
            </div>
          </div>

          {/* Dark Logo */}
          <div className="space-y-3">
            <Label>الشعار الداكن</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-800">
              {branding.logo_dark_url ? (
                <img src={branding.logo_dark_url} alt="Dark Logo" className="h-16 mx-auto mb-2" />
              ) : (
                <div className="h-16 flex items-center justify-center text-slate-500">
                  <Image className="w-8 h-8" />
                </div>
              )}
              <label className="cursor-pointer">
                <span className="text-sm text-blue-400 hover:underline">رفع صورة</span>
                <input type="file" className="hidden" accept="image/*" onChange={function(e) { handleUpload(e, 'logo_dark_url'); }} />
              </label>
            </div>
          </div>

          {/* Favicon */}
          <div className="space-y-3">
            <Label>الأيقونة (Favicon)</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center">
              {branding.favicon_url ? (
                <img src={branding.favicon_url} alt="Favicon" className="h-16 w-16 mx-auto mb-2" />
              ) : (
                <div className="h-16 w-16 mx-auto flex items-center justify-center text-slate-400 bg-slate-100 rounded">
                  <Image className="w-6 h-6" />
                </div>
              )}
              <label className="cursor-pointer">
                <span className="text-sm text-blue-600 hover:underline">رفع صورة</span>
                <input type="file" className="hidden" accept="image/*" onChange={function(e) { handleUpload(e, 'favicon_url'); }} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">الألوان</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label>اللون الأساسي (Primary)</Label>
            <div className="flex gap-3">
              <input
                type="color"
                value={branding.primary_color}
                onChange={function(e) { updateColor('primary_color', e.target.value); }}
                className="w-16 h-12 rounded cursor-pointer border-0"
              />
              <Input
                value={branding.primary_color}
                onChange={function(e) { updateColor('primary_color', e.target.value); }}
                className="font-mono flex-1"
              />
            </div>
            <div className="h-12 rounded-lg" style={{ backgroundColor: branding.primary_color }}></div>
          </div>

          <div className="space-y-3">
            <Label>اللون الثانوي (Secondary)</Label>
            <div className="flex gap-3">
              <input
                type="color"
                value={branding.secondary_color}
                onChange={function(e) { updateColor('secondary_color', e.target.value); }}
                className="w-16 h-12 rounded cursor-pointer border-0"
              />
              <Input
                value={branding.secondary_color}
                onChange={function(e) { updateColor('secondary_color', e.target.value); }}
                className="font-mono flex-1"
              />
            </div>
            <div className="h-12 rounded-lg" style={{ backgroundColor: branding.secondary_color }}></div>
          </div>

          <div className="space-y-3">
            <Label>اللون المميز (Accent)</Label>
            <div className="flex gap-3">
              <input
                type="color"
                value={branding.accent_color}
                onChange={function(e) { updateColor('accent_color', e.target.value); }}
                className="w-16 h-12 rounded cursor-pointer border-0"
              />
              <Input
                value={branding.accent_color}
                onChange={function(e) { updateColor('accent_color', e.target.value); }}
                className="font-mono flex-1"
              />
            </div>
            <div className="h-12 rounded-lg" style={{ backgroundColor: branding.accent_color }}></div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">معاينة الألوان</h2>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: branding.primary_color }}>
            زر أساسي
          </button>
          <button className="px-6 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: branding.secondary_color }}>
            زر ثانوي
          </button>
          <button className="px-6 py-3 rounded-xl font-medium" style={{ backgroundColor: branding.accent_color }}>
            زر مميز
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBranding;
