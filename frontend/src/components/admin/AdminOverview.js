import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Users, RefreshCw, Plane, MapPin, Wallet, CreditCard, Globe, ArrowLeftRight, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SERVICE_DEFS = [
  {
    key: 'traveler',
    label: 'حجز المسافرين',
    description: 'حجوزات السفر والمطارات',
    icon: Plane,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200 hover:border-blue-400',
    path: '/admin/orders/traveler',
    queryType: 'traveler',
  },
  {
    key: 'local',
    label: 'التحويل المحلي',
    description: 'تحويلات داخل العراق',
    icon: MapPin,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200 hover:border-amber-400',
    path: '/admin/orders/local',
    queryType: 'local',
  },
  {
    key: 'western_union',
    label: 'ويسترن يونيون',
    description: 'التحويل الدولي عبر ويسترن يونيون',
    icon: Globe,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    borderColor: 'border-yellow-200 hover:border-yellow-400',
    path: '/admin/orders/international',
    queryType: 'western_union',
  },
  {
    key: 'moneygram',
    label: 'موني جرام',
    description: 'التحويل الدولي عبر موني جرام',
    icon: Send,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200 hover:border-orange-400',
    path: '/admin/orders/international',
    queryType: 'moneygram',
  },
  {
    key: 'country_based',
    label: 'تحويل حسب الدولة',
    description: 'التحويل الدولي المباشر حسب الدولة',
    icon: ArrowLeftRight,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200 hover:border-purple-400',
    path: '/admin/orders/international',
    queryType: 'country_based',
  },
  {
    key: 'usdt_recharge',
    label: 'شحن USDT',
    description: 'معاملات العملات الرقمية',
    icon: Wallet,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-200 hover:border-teal-400',
    path: '/admin/orders/usdt',
    queryType: 'usdt',
  },
  {
    key: 'card_recharge',
    label: 'تعبئة بطاقات',
    description: 'بطاقات مسبقة الدفع الإلكترونية',
    icon: CreditCard,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    borderColor: 'border-pink-200 hover:border-pink-400',
    path: '/admin/orders/card',
    queryType: 'card_recharge',
  },
];

const AdminOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [serviceCounts, setServiceCounts] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      // Fetch recent orders
      const ordersRes = await fetch(`${API_URL}/api/orders?page=1&page_size=5&t=${Date.now()}`, { headers });
      const ordersJson = await ordersRes.json();
      setRecentOrders(ordersJson.orders || []);

      // Fetch order counts for each service type in parallel
      const countResults = await Promise.allSettled(
        SERVICE_DEFS.map(async (svc) => {
          const res = await fetch(`${API_URL}/api/orders?page=1&page_size=1&order_type=${svc.queryType}&t=${Date.now()}`, { headers });
          const json = await res.json();
          return { key: svc.key, count: json.total ?? json.orders?.length ?? 0 };
        })
      );

      const counts = {};
      countResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          counts[result.value.key] = result.value.count;
        }
      });
      setServiceCounts(counts);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const orderTypeLabels = {
    traveler: 'حجز مسافرين',
    local: 'تحويل محلي',
    western_union: 'ويسترن يونيون',
    moneygram: 'موني جرام',
    country_based: 'حسب الدولة',
    card_recharge: 'تعبئة بطاقات',
    usdt_recharge: 'شحن USDT',
    usdt: 'شحن USDT',
  };

  const statusConfig = {
    waiting_payment: { label: 'في انتظار الدفع', color: 'bg-amber-100 text-amber-800' },
    under_review: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'مقبول', color: 'bg-[#D4AF37]/20 text-amber-800' },
    rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
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
          <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم</h1>
          <p className="text-slate-600">مرحباً بك في لوحة تحكم شركة دبي العالمية للصرافة</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="تحديث"
        >
          <RefreshCw className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Services Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">الخدمات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SERVICE_DEFS.map((service, i) => {
            const count = serviceCounts[service.key];
            return (
              <motion.button
                key={service.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(service.path)}
                className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${service.borderColor} transition-all text-right group w-full hover:shadow-md`}
              >
                {/* Icon row */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`${service.iconBg} rounded-xl p-2.5 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`w-5 h-5 ${service.iconColor}`} />
                  </div>
                  {/* Order count badge */}
                  <span className="text-2xl font-bold text-slate-800">
                    {serviceCounts[service.key] ?? 0}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{service.label}</h3>
                <p className="text-xs text-slate-400 leading-snug">{service.description}</p>
                <div className="mt-3 text-xs font-medium text-[#D4AF37] flex items-center gap-1">
                  <span>عرض الطلبات</span>
                  <span>←</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">أحدث الطلبات</h2>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>لا توجد طلبات بعد</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">رقم الطلب</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">النوع</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">العميل</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">المبلغ</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">الحالة</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase">الوقت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map(order => (
                  <tr
                    key={order.order_id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-slate-900 text-xs">{order.order_id?.slice(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{orderTypeLabels[order.order_type] || order.order_type}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium">{order.customer?.full_name}</td>
                    <td className="px-6 py-4 text-slate-900">
                      {order.details?.usdAmount || order.details?.amountUSD
                        ? `$${order.details.usdAmount || order.details.amountUSD}`
                        : order.details?.amount || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color || 'bg-slate-100 text-slate-700'}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatTime(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t border-slate-200 text-center">
          <Link to="/admin/orders" className="text-sm text-[#D4AF37] font-medium hover:underline">
            عرض جميع الطلبات →
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <Package className="w-10 h-10 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">جميع الطلبات</h3>
          <p className="text-blue-100 text-sm mb-4">مراجعة وإدارة جميع طلبات العملاء</p>
          <Link to="/admin/orders" className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            عرض الكل
          </Link>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <DollarSign className="w-10 h-10 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">أسعار الصرف</h3>
          <p className="text-amber-100 text-sm mb-4">إدارة وتحديث أسعار الصرف</p>
          <Link to="/admin/rates" className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            تحديث الأسعار
          </Link>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <Users className="w-10 h-10 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">المستخدمون</h3>
          <p className="text-purple-100 text-sm mb-4">إدارة حسابات المستخدمين والصلاحيات</p>
          <Link to="/admin/users" className="inline-block px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            إدارة المستخدمين
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
