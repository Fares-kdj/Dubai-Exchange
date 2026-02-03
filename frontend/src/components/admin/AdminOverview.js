import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Users, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch(`${API_URL}/api/orders/stats/summary`);
      const statsJson = await statsRes.json();
      setStatsData(statsJson);

      // Fetch recent orders
      const ordersRes = await fetch(`${API_URL}/api/orders?page=1&page_size=5`);
      const ordersJson = await ordersRes.json();
      setRecentOrders(ordersJson.orders || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const stats = [
    { label: 'إجمالي الطلبات', value: statsData?.total_orders || 0, icon: Package, color: 'bg-blue-500', change: '+12%', up: true },
    { label: 'في انتظار الدفع', value: statsData?.waiting_payment || 0, icon: Clock, color: 'bg-amber-500', change: '+5%', up: true },
    { label: 'قيد المراجعة', value: statsData?.under_review || 0, icon: TrendingUp, color: 'bg-yellow-500', change: '+8%', up: true },
    { label: 'مقبول', value: statsData?.approved || 0, icon: CheckCircle, color: 'bg-green-500', change: '+15%', up: true },
  ];

  const statusConfig = {
    waiting_payment: { label: 'في انتظار الدفع', color: 'bg-amber-100 text-amber-800' },
    under_review: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'مقبول', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">لوحة التحكم</h1>
        <p className="text-slate-600">مرحباً بك في لوحة تحكم خير بغداد للصرافة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">أحدث الطلبات</h2>
        </div>
        <div className="overflow-x-auto">
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
                <tr key={order.id} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-slate-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{order.type}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-900">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 text-center">
          <button className="text-sm text-[#D4AF37] font-medium hover:underline">
            عرض جميع الطلبات →
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <Package className="w-10 h-10 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">الطلبات المعلقة</h3>
          <p className="text-blue-100 text-sm mb-4">23 طلب في انتظار المراجعة</p>
          <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30">
            مراجعة الآن
          </button>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
          <DollarSign className="w-10 h-10 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">أسعار الصرف</h3>
          <p className="text-amber-100 text-sm mb-4">آخر تحديث: منذ ساعتين</p>
          <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30">
            تحديث الأسعار
          </button>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <Users className="w-10 h-10 mb-4 opacity-80" />
          <h3 className="text-lg font-bold mb-2">العملاء</h3>
          <p className="text-purple-100 text-sm mb-4">156 عميل جديد هذا الشهر</p>
          <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30">
            عرض التقرير
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
