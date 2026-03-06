import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ban, Search, Plus, Trash2, User, Phone, Calendar,
  AlertCircle, RefreshCw, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConfirmModal from './ConfirmModal';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

const blockReasons = [
  { value: 'fraud', label: 'احتيال' },
  { value: 'fake_documents', label: 'وثائق مزورة' },
  { value: 'suspicious_activity', label: 'نشاط مشبوه' },
  { value: 'payment_issues', label: 'مشاكل في الدفع' },
  { value: 'other', label: 'أخرى' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' });
};

const AdminBlocklist = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showConfirm = (config) => setConfirmConfig({ ...config, isOpen: true });

  const [newEntry, setNewEntry] = useState({
    full_name: '',
    phone: '',
    reason: 'other',
    reason_notes: ''
  });

  const getToken = () => localStorage.getItem('adminToken');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = getToken();
      let url = `${API_URL}/api/blocklist/?page=${page}&page_size=${pageSize}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }

      // Get count
      let countUrl = `${API_URL}/api/blocklist/count`;
      if (searchQuery) countUrl += `?search=${encodeURIComponent(searchQuery)}`;

      const countRes = await fetch(countUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (countRes.ok) {
        const countData = await countRes.json();
        setTotalCount(countData.count);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchEntries();
  };

  const handleAddBlock = async () => {
    if (!newEntry.full_name.trim() || !newEntry.phone.trim()) {
      toast.error('يرجى إدخال الاسم ورقم الهاتف');
      return;
    }

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/api/blocklist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEntry)
      });

      if (res.ok) {
        toast.success('تم إضافة الحظر بنجاح');
        setShowAddModal(false);
        setNewEntry({ full_name: '', phone: '', reason: 'other', reason_notes: '' });
        fetchEntries();
      } else {
        const err = await res.json();
        toast.error(err.detail || 'حدث خطأ أثناء الإضافة');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleUnblock = (blockId) => {
    showConfirm({
      type: 'warning',
      title: 'إلغاء الحظر',
      message: 'هل أنت متأكد من إلغاء الحظر عن هذا العميل؟ سيتمكن من الطلب مرة أخرى.',
      onConfirm: async () => {
        try {
          const token = getToken();
          const res = await fetch(`${API_URL}/api/blocklist/${blockId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (res.ok) {
            toast.success('تم إلغاء الحظر بنجاح');
            fetchEntries();
          } else {
            const err = await res.json();
            toast.error(err.detail || 'حدث خطأ أثناء إلغاء الحظر');
          }
        } catch (err) {
          console.error('Error:', err);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Ban className="w-7 h-7 text-red-600" />
            قائمة الحظر
          </h1>
          <p className="text-slate-600 mt-1">{totalCount} عميل محظور</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchEntries} className="p-2 hover:bg-slate-100 rounded-lg">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
          >
            <Plus className="w-4 h-4" />
            إضافة حظر
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="بحث بالاسم أو رقم الهاتف..."
              className="pl-10 text-slate-900"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            بحث
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Ban className="w-12 h-12 mb-4 opacity-50" />
            <p>لا توجد حالات حظر</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">الاسم</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">الهاتف</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">السبب</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">ملاحظات</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">الحاظر</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">التاريخ</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map(entry => (
                  <motion.tr
                    key={entry.block_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-red-600" />
                        </div>
                        <span className="font-medium text-slate-900">{entry.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-slate-600">{entry.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {blockReasons.find(r => r.value === entry.reason)?.label || entry.reason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 max-w-xs truncate block">
                        {entry.reason_notes || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{entry.blocked_by_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{formatDate(entry.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUnblock(entry.block_id)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                      >
                        إلغاء الحظر
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {entries.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">عرض {entries.length} من {totalCount} سجل</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                disabled={page === 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm font-medium">{page}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                disabled={entries.length < pageSize}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAddModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ban className="w-5 h-5 text-red-600" />
                إضافة حظر جديد
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors border-0" title="إغلاق">
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>الاسم الكامل *</Label>
                <Input
                  value={newEntry.full_name}
                  onChange={(e) => setNewEntry(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="أدخل اسم العميل..."
                  className="text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <Label>رقم الهاتف *</Label>
                <Input
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+964..."
                  className="text-left font-mono text-slate-900"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>سبب الحظر</Label>
                <Select value={newEntry.reason} onValueChange={(v) => setNewEntry(p => ({ ...p, reason: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {blockReasons.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ملاحظات (اختياري)</Label>
                <Textarea
                  value={newEntry.reason_notes}
                  onChange={(e) => setNewEntry(p => ({ ...p, reason_notes: e.target.value }))}
                  placeholder="ملاحظات إضافية..."
                  className="text-slate-900 min-h-[100px]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">
                إلغاء
              </button>
              <button onClick={handleAddBlock} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                تأكيد الحظر
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </div>
  );
};

export default AdminBlocklist;
