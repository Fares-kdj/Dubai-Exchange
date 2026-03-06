import React, { useState } from 'react';
import { Globe, DollarSign, Save, Settings } from 'lucide-react';
import { BaseOrdersPage } from './BaseOrdersPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const InternationalOrders = () => {
  const [subType, setSubType] = useState('all');
  const [wuSettings, setWuSettings] = useState({ base_mtcn: '' });
  const [mgSettings, setMgSettings] = useState({ base_reference_number: '' });
  const [isEditingSequential, setIsEditingSequential] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Fetch Settings
  const fetchSettings = async () => {
    try {
      if (subType === 'western_union') {
        const res = await fetch(`${API_URL}/api/cms/settings/western-union`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (res.ok) setWuSettings(await res.json());
      } else if (subType === 'moneygram') {
        const res = await fetch(`${API_URL}/api/cms/settings/moneygram`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        });
        if (res.ok) setMgSettings(await res.json());
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  React.useEffect(() => {
    if (subType === 'western_union' || subType === 'moneygram') {
      fetchSettings();
    }
    setIsEditingSequential(false);
  }, [subType]);

  const handleUpdateSettings = async () => {
    setLoadingSettings(true);
    try {
      const type = subType === 'western_union' ? 'western-union' : 'moneygram';
      const body = subType === 'western_union' ? wuSettings : mgSettings;

      const res = await fetch(`${API_URL}/api/cms/settings/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        toast.success('تم تحديث الإعدادات بنجاح');
        setIsEditingSequential(false);
        fetchSettings();
      } else {
        toast.error('حدث خطأ أثناء التحديث');
      }
    } catch (err) {
      toast.error('حدث خطأ في الاتصال');
    }
    setLoadingSettings(false);
  };

  const subTypeOptions = [
    { value: 'all', label: 'جميع التحويلات الدولية' },
    { value: 'western_union', label: 'ويسترن يونيون' },
    { value: 'moneygram', label: 'موني جرام' },
    { value: 'country_based', label: 'حسب الدولة' },
  ];

  const extraFilters = (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-slate-500">نوع التحويل</Label>
          <Select value={subType} onValueChange={setSubType}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subTypeOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {(subType === 'western_union' || subType === 'moneygram') && (
          <div className="flex flex-col gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
              <Settings className="w-4 h-4" />
              {subType === 'western_union' ? 'إعدادات الأرقام التسلسلية لويسترن يونيون' : 'إعدادات الأرقام التسلسلية لموني جرام'}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {subType === 'western_union' ? (
                <div className="space-y-1">
                  <Label className="text-xs text-amber-700">الرقم التسلسلي القادم (MTCN)</Label>
                  <Input
                    value={wuSettings.base_mtcn}
                    onChange={e => setWuSettings({ ...wuSettings, base_mtcn: e.target.value })}
                    disabled={!isEditingSequential}
                    className={`h-9 w-full max-w-md text-sm font-mono ${!isEditingSequential ? 'bg-transparent border-transparent' : 'bg-white'}`}
                    placeholder="XXX-XXX-XXXX"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs text-amber-700">الرقم المرجعي القادم</Label>
                  <Input
                    value={mgSettings.base_reference_number}
                    onChange={e => setMgSettings({ ...mgSettings, base_reference_number: e.target.value })}
                    disabled={!isEditingSequential}
                    className={`h-9 w-full max-w-md text-sm font-mono ${!isEditingSequential ? 'bg-transparent border-transparent' : 'bg-white'}`}
                    placeholder="0000000000"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end mt-2">
              {!isEditingSequential ? (
                <button
                  onClick={() => setIsEditingSequential(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-200 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> تعديل الأرقام
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUpdateSettings}
                    disabled={loadingSettings}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loadingSettings ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </button>
                  <button
                    onClick={() => { setIsEditingSequential(false); fetchSettings(); }}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-300"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <BaseOrdersPage
      title="طلبات التحويل الدولي"
      orderType={subType === 'all' ? 'international' : subType}
      extraFilters={extraFilters}
      key={subType}
    />
  );
};

export default InternationalOrders;
