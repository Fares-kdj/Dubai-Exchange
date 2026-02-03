import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, MoreVertical, Download, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/orders?page=${page}&page_size=${pageSize}`;
      if (filterStatus !== 'all') url += `&status=${filterStatus}`;
      if (filterType !== 'all') url += `&order_type=${filterType}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalOrders(data.total || 0);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus, filterType]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const orderTypes = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'traveler', label: 'حجز مسافرين' },
    { value: 'local', label: 'تحويل محلي' },
    { value: 'western_union', label: 'ويسترن يونيون' },
    { value: 'moneygram', label: 'موني جرام' },
    { value: 'country_based', label: 'حسب الدولة' },
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'waiting_payment', label: 'في انتظار الدفع' },
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' },
  ];

  const statusConfig = {
    waiting_payment: { label: 'في انتظار الدفع', color: 'bg-amber-100 text-amber-800', icon: Clock },
    under_review: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Search },
    approved: { label: 'مقبول', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800', icon: XCircle },
  };

  const orderTypeLabels = {
    traveler: 'حجز مسافرين',
    local: 'تحويل محلي',
    western_union: 'ويسترن يونيون',
    moneygram: 'موني جرام',
    country_based: 'حسب الدولة'
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة الطلبات</h1>
          <p className="text-slate-600">{orders.length} طلب</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-lg hover:bg-[#c9a431]">
          <Download className="w-4 h-4" />
          تصدير Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="بحث برقم الطلب أو اسم العميل..."
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {orderTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">رقم الطلب</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">النوع</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">العميل</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">الهاتف</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">المبلغ</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">الحالة</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">إثبات الدفع</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">التاريخ</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-slate-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{orderTypeLabels[order.order_type] || order.order_type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{order.customer_name || 'غير محدد'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-mono">{order.phone || 'غير محدد'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{order.amount || 'غير محدد'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Select defaultValue={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                      <SelectTrigger className={`w-36 ${statusConfig[order.status].color} border-0`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting_payment">في انتظار الدفع</SelectItem>
                        <SelectItem value="under_review">قيد المراجعة</SelectItem>
                        <SelectItem value="approved">مقبول</SelectItem>
                        <SelectItem value="rejected">مرفوض</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">
                    {order.payment_proof ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">مرفوع</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">غير مرفوع</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{formatDate(order.created_at)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600" title="عرض">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-amber-100 rounded-lg text-amber-600" title="تعديل">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600" 
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">عرض 1-{orders.length} من {totalOrders} طلب</p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-[#D4AF37] text-slate-900 rounded-lg text-sm font-medium">1</span>
            <button className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
