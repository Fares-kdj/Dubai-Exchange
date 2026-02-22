import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, 
  MoreVertical, Download, ChevronLeft, ChevronRight, RefreshCw,
  User, Phone, DollarSign, Calendar, FileText, Ban, Printer, X,
  MapPin, Plane, CreditCard, AlertCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Status configuration
const statusConfig = {
  pending_review: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  waiting_payment: { label: 'في انتظار الدفع', color: 'bg-amber-100 text-amber-800', icon: Clock },
  approved: { label: 'مقبول', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800', icon: XCircle },
  ignored: { label: 'تم التجاهل', color: 'bg-slate-100 text-slate-800', icon: Ban },
};

// Order type configuration
const orderTypeConfig = {
  traveler: { label: 'حجز مسافرين', icon: Plane, color: 'text-blue-600' },
  local: { label: 'تحويل محلي', icon: MapPin, color: 'text-green-600' },
  western_union: { label: 'ويسترن يونيون', icon: DollarSign, color: 'text-amber-600' },
  moneygram: { label: 'موني جرام', icon: DollarSign, color: 'text-orange-600' },
  country_based: { label: 'حسب الدولة', icon: DollarSign, color: 'text-purple-600' },
  usdt: { label: 'USDT', icon: CreditCard, color: 'text-emerald-600' },
  card: { label: 'شحن بطاقة', icon: CreditCard, color: 'text-pink-600' },
};

// Format date
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('ar-IQ', { dateStyle: 'short', timeStyle: 'short' });
};

// Order Detail Modal Component
const OrderDetailModal = ({ order, isOpen, onClose, onStatusChange, onBlock }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [adminData, setAdminData] = useState({});
  const [airports, setAirports] = useState([]);
  const [borders, setBorders] = useState([]);

  // Fetch airports and borders for traveler orders
  useEffect(() => {
    if (order?.order_type === 'traveler') {
      fetch(`${API_URL}/api/stamps/airports`).then(r => r.json()).then(setAirports).catch(() => {});
      fetch(`${API_URL}/api/stamps/borders`).then(r => r.json()).then(setBorders).catch(() => {});
      setAdminData(order.admin_data || {});
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleStatusChange = async (newStatus, reason = null) => {
    setLoading(true);
    try {
      const body = { status: newStatus };
      if (reason) body.rejection_reason = reason;
      
      const res = await fetch(`${API_URL}/api/orders/${order.order_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        onStatusChange();
        if (newStatus === 'rejected') setShowRejectInput(false);
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const handleSaveAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/${order.order_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_data: adminData })
      });
      
      if (res.ok) {
        alert('تم حفظ البيانات بنجاح');
        setShowEditForm(false);
        onStatusChange();
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const handleBlock = async () => {
    if (!window.confirm('هل أنت متأكد من حظر هذا العميل؟')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/blocklist/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: order.customer?.full_name || '',
          phone: order.customer?.phone || '',
          reason: 'suspicious_activity',
          reason_notes: `حظر من الطلب: ${order.order_id}`
        })
      });
      
      if (res.ok) {
        alert('تم حظر العميل بنجاح');
        onBlock?.();
      } else {
        const err = await res.json();
        alert(err.detail || 'حدث خطأ');
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">تفاصيل الطلب</h2>
              <p className="text-sm text-slate-600 font-mono">{order.order_id}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.status]?.color || 'bg-slate-100'}`}>
                {statusConfig[order.status]?.label || order.status}
              </span>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {['details', 'documents', 'history'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'details' ? 'البيانات' : tab === 'documents' ? 'الوثائق' : 'السجل'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    بيانات العميل
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">الاسم</span>
                      <span className="font-medium">{order.customer?.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الهاتف</span>
                      <span className="font-mono">{order.customer?.phone}</span>
                    </div>
                    {order.customer?.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">البريد</span>
                        <span>{order.customer?.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    تفاصيل الطلب
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">النوع</span>
                      <span className="font-medium">{orderTypeConfig[order.order_type]?.label || order.order_type}</span>
                    </div>
                    {order.details?.usdAmount && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">المبلغ (USD)</span>
                        <span className="font-bold text-green-600">${order.details.usdAmount}</span>
                      </div>
                    )}
                    {order.details?.iqdAmount && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">المبلغ (IQD)</span>
                        <span className="font-medium">{Number(order.details.iqdAmount).toLocaleString()} د.ع</span>
                      </div>
                    )}
                    {order.details?.destination && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">الوجهة</span>
                        <span>{order.details.destination}</span>
                      </div>
                    )}
                    {order.details?.travelDate && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">تاريخ السفر</span>
                        <span>{order.details.travelDate}</span>
                      </div>
                    )}
                    {order.details?.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">طريقة الدفع</span>
                        <span>{order.details.paymentMethod}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">التاريخ</span>
                      <span className="text-sm">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                {order.details && Object.keys(order.details).length > 0 && (
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      معلومات إضافية
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(order.details).filter(([k]) => !['usdAmount', 'iqdAmount', 'destination', 'travelDate', 'paymentMethod'].includes(k)).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-500">{key}</p>
                          <p className="font-medium text-sm">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">الوثائق المرفوعة</h3>
                {order.documents && Object.keys(order.documents).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(order.documents).map(([key, url]) => url && (
                      <a key={key} href={url} target="_blank" rel="noopener noreferrer" 
                         className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-blue-600" />
                        <span className="text-sm font-medium">{key}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">لا توجد وثائق مرفوعة</p>
                )}
                
                {order.payment_proofs?.length > 0 && (
                  <>
                    <h3 className="font-bold text-slate-900 mt-6">إثباتات الدفع</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {order.payment_proofs.map((proof, idx) => (
                        <a key={idx} href={proof} target="_blank" rel="noopener noreferrer"
                           className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
                          <FileText className="w-10 h-10 mx-auto mb-2 text-green-600" />
                          <span className="text-sm font-medium">إثبات {idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">سجل التغييرات</h3>
                {order.status_history?.length > 0 ? (
                  <div className="space-y-3">
                    {order.status_history.map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${
                          entry.status === 'approved' ? 'bg-green-500' :
                          entry.status === 'rejected' ? 'bg-red-500' :
                          'bg-slate-400'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{statusConfig[entry.status]?.label || entry.status}</p>
                          {entry.reason && <p className="text-sm text-slate-600">السبب: {entry.reason}</p>}
                          <p className="text-xs text-slate-500 mt-1">
                            {entry.changed_by} • {formatDate(entry.changed_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">لا يوجد سجل تغييرات</p>
                )}
              </div>
            )}
          </div>

          {/* Actions Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            {showRejectInput ? (
              <div className="flex items-center gap-4">
                <Input
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="سبب الرفض..."
                  className="flex-1"
                />
                <button
                  onClick={() => handleStatusChange('rejected', rejectReason)}
                  disabled={loading || !rejectReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  تأكيد الرفض
                </button>
                <button onClick={() => setShowRejectInput(false)} className="px-4 py-2 bg-slate-200 rounded-lg">
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {order.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange('approved')}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> قبول
                  </button>
                )}
                {order.status !== 'rejected' && (
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> رفض
                  </button>
                )}
                {order.status !== 'ignored' && (
                  <button
                    onClick={() => handleStatusChange('ignored')}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4" /> تجاهل
                  </button>
                )}
                <button
                  onClick={handleBlock}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" /> حظر العميل
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-auto">
                  <Printer className="w-4 h-4" /> طباعة
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Main Orders Page Component
const BaseOrdersPage = ({ 
  title, 
  orderType, 
  columns = ['order_id', 'customer', 'amount', 'status', 'date', 'actions'],
  extraFilters = null 
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending_review', label: 'قيد المراجعة' },
    { value: 'waiting_payment', label: 'في انتظار الدفع' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'ignored', label: 'تم التجاهل' },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/orders?page=${page}&page_size=${pageSize}`;
      if (orderType) url += `&order_type=${orderType}`;
      if (filterStatus !== 'all') url += `&status=${filterStatus}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalOrders(data.total || 0);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus, orderType]);

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600">{totalOrders} طلب</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchOrders} className="p-2 hover:bg-slate-100 rounded-lg">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-lg hover:bg-[#c9a431]">
            <Download className="w-4 h-4" />
            تصدير
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {extraFilters}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>لا توجد طلبات</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">رقم الطلب</th>
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
                    key={order.order_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => openOrderDetail(order)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-slate-900">{order.order_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{order.customer?.full_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-mono">{order.customer?.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {order.details?.usdAmount ? `$${order.details.usdAmount}` : order.details?.amount || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color || 'bg-slate-100'}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.payment_proofs?.length > 0 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">مرفوع</span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">غير مرفوع</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openOrderDetail(order)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600" title="عرض">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(order.order_id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600" title="حذف">
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
        {orders.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">عرض {orders.length} من {totalOrders} طلب</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50" 
                disabled={page === 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-[#D4AF37] text-slate-900 rounded-lg text-sm font-medium">{page}</span>
              <button 
                onClick={() => setPage(p => p + 1)}
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50" 
                disabled={orders.length < pageSize}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onStatusChange={() => { fetchOrders(); setShowDetail(false); }}
        onBlock={fetchOrders}
      />
    </div>
  );
};

export { BaseOrdersPage, OrderDetailModal, statusConfig, orderTypeConfig, formatDate };
export default BaseOrdersPage;
