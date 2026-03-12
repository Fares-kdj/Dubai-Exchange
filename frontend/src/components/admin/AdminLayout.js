import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Settings, FileText, DollarSign,
  Palette, Users, LogOut, Menu, X, Search, Bell, Globe,
  Plane, MapPin, ArrowLeftRight, CreditCard, Wallet, Ban,
  Building2, ChevronDown, ChevronLeft, Crosshair, Clock
} from 'lucide-react';
import { useBranding } from '@/context/BrandingContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoDark } = useBranding();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState(['orders']); // Default expanded
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set());
  const [deletedIds, setDeletedIds] = useState(new Set());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // History management for mobile sidebar
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      // Small delay to ensure we are not in a middle of a transition
      const state = { sidebarOpen: true };
      window.history.pushState(state, '');

      const handlePopState = (e) => {
        if (sidebarOpen) {
          setSidebarOpen(false);
          // Don't prevent default, just let the state update
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        // If we close manually (X button or backdrop), we should pop the state if it's still there
        if (window.history.state?.sidebarOpen) {
          window.history.back();
        }
      };
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (!token || !userStr) {
      navigate('/admin/login');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [navigate]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/orders?page_size=20`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const sorted = (data.orders || []).slice(0, 4); // last 4 orders
          setNotifications(sorted);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const visibleNotifications = notifications.filter(n => !deletedIds.has(n.order_id));
  const unreadCount = visibleNotifications.filter(n => !readIds.has(n.order_id)).length;

  const markRead = (id) => setReadIds(prev => new Set([...prev, id]));
  const deleteNotif = (id) => setDeletedIds(prev => new Set([...prev, id]));
  const markAllRead = () => setReadIds(new Set(visibleNotifications.map(n => n.order_id)));

  const getOrderTypeName = (type) => {
    const map = {
      western_union: 'ويسترن يونيون', moneygram: 'موني جرام',
      country_based: 'حسب الدولة', traveler: 'حجز مسافر',
      local: 'تحويل محلي', usdt: 'شحن USDT', usdt_recharge: 'شحن USDT',
      card: 'تعبئة بطاقات', card_recharge: 'تعبئة بطاقات',
    };
    return map[type] || type;
  };

  const getOrderLink = (type) => {
    if (['western_union', 'moneygram', 'country_based'].includes(type)) return '/admin/orders/international';
    if (['usdt', 'usdt_recharge'].includes(type)) return '/admin/orders/usdt';
    if (['card', 'card_recharge'].includes(type)) return '/admin/orders/card';
    return `/admin/orders/${type}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'developer') return true;
    return user.permissions?.includes(permission);
  };

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Menu structure with submenus
  const menuItems = [
    {
      id: 'dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      label: 'لوحة التحكم',
      permission: 'view_dashboard'
    },
    {
      id: 'orders',
      icon: Package,
      label: 'الطلبات',
      hasSubmenu: true,
      submenu: [
        { path: '/admin/orders/traveler', icon: Plane, label: 'حجز المسافرين', permission: 'view_orders_traveler' },
        { path: '/admin/orders/local', icon: MapPin, label: 'التحويل المحلي', permission: 'view_orders_local' },
        { path: '/admin/orders/international', icon: ArrowLeftRight, label: 'التحويل الدولي', permission: 'view_orders_international' },
        { path: '/admin/orders/usdt', icon: Wallet, label: 'شحن USDT', permission: 'view_orders_usdt' },
        { path: '/admin/orders/card', icon: CreditCard, label: 'تعبئة بطاقات', permission: 'view_orders_card' },
      ]
    },
    {
      id: 'blocklist',
      path: '/admin/blocklist',
      icon: Ban,
      label: 'قائمة الحظر',
      permission: 'view_blocklist'
    },
    {
      id: 'services',
      path: '/admin/services',
      icon: Settings,
      label: 'الخدمات',
      permission: 'view_services'
    },
    {
      id: 'countries',
      path: '/admin/countries',
      icon: Globe,
      label: 'الدول',
      permission: 'view_countries'
    },
    {
      id: 'rates',
      path: '/admin/rates',
      icon: DollarSign,
      label: 'أسعار الصرف',
      permission: 'view_rates'
    },
    {
      id: 'airports',
      path: '/admin/airports',
      icon: Building2,
      label: 'المطارات والأختام',
      permission: 'view_airports'
    },
    {
      id: 'cms',
      path: '/admin/cms',
      icon: FileText,
      label: 'المحتوى',
      permission: 'edit_content'
    },
    {
      id: 'branding',
      path: '/admin/branding',
      icon: Palette,
      label: 'الهوية',
      permission: 'edit_branding'
    },
    {
      id: 'users',
      path: '/admin/users',
      icon: Users,
      label: 'المستخدمون',
      permission: 'manage_users'
    },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const isSubmenuActive = (submenu) => {
    return submenu.some(item => location.pathname.startsWith(item.path));
  };

  // Filter items based on permissions
  const filterItems = (items) => {
    return items.filter(item => {
      if (item.hasSubmenu) {
        const filteredSubmenu = item.submenu.filter(sub => hasPermission(sub.permission));
        return filteredSubmenu.length > 0;
      }
      return hasPermission(item.permission);
    }).map(item => {
      if (item.hasSubmenu) {
        return {
          ...item,
          submenu: item.submenu.filter(sub => hasPermission(sub.permission))
        };
      }
      return item;
    });
  };

  const filteredMenu = filterItems(menuItems);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex admin-panel relative" dir="rtl">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 280 : (window.innerWidth < 1024 ? 0 : 80),
          x: (window.innerWidth < 1024 && !sidebarOpen) ? 280 : 0
        }}
        className={`fixed inset-y-0 right-0 z-50 bg-slate-900 shadow-2xl flex flex-col transition-all duration-300 ${window.innerWidth < 1024 && !sidebarOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img
                src={logoDark}
                alt="شعار الشركة"
                className="h-9 object-contain"
              />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-bold text-white">دبي العالمية</h1>
                <p className="text-xs text-slate-400">لوحة التحكم</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredMenu.map(item => (
              <li key={item.id}>
                {item.hasSubmenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isSubmenuActive(item.submenu)
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <>
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium flex-1 text-right">
                            {item.label}
                          </motion.span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                    <AnimatePresence>
                      {sidebarOpen && expandedMenus.includes(item.id) && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-1 mr-4 space-y-1 overflow-hidden"
                        >
                          {item.submenu.map(sub => (
                            <li key={sub.path}>
                              <Link
                                to={sub.path}
                                onClick={handleNavClick}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${isActive(sub.path)
                                  ? 'bg-[#D4AF37] text-slate-900'
                                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                  }`}
                              >
                                <sub.icon className="w-4 h-4 flex-shrink-0" />
                                <span>{sub.label}</span>
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                      ? 'bg-[#D4AF37] text-slate-900'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role === 'developer' ? 'المطور' : 'مدير'}</p>
              </motion.div>
            )}
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 min-w-0 ${sidebarOpen
        ? 'lg:mr-[280px] mr-0'
        : 'lg:mr-[80px] mr-0'
        }`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5 stroke-[2.5] text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications – desktop only */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-slate-100 rounded-lg"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">الإشعارات</h3>
                          {unreadCount > 0 && (
                            <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{unreadCount} غير مقروء</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-[#D4AF37] font-medium hover:underline"
                          >
                            قراءة الكل
                          </button>
                        )}
                      </div>

                      {/* Notification list */}
                      <div className="divide-y divide-slate-50">
                        {visibleNotifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">لا توجد إشعارات</p>
                          </div>
                        ) : (
                          visibleNotifications.map(notif => {
                            const isRead = readIds.has(notif.order_id);
                            return (
                              <div
                                key={notif.order_id}
                                className={`flex items-start gap-3 px-4 py-3 transition-colors ${isRead ? 'bg-white' : 'bg-amber-50/60'}`}
                              >
                                {/* Unread dot */}
                                <div className="pt-1 flex-shrink-0">
                                  {!isRead
                                    ? <span className="w-2 h-2 bg-[#D4AF37] rounded-full block mt-1" />
                                    : <span className="w-2 h-2 rounded-full block" />}
                                </div>

                                {/* Content – clickable */}
                                <Link
                                  to={getOrderLink(notif.order_type)}
                                  onClick={() => { markRead(notif.order_id); setShowNotifications(false); }}
                                  className="flex-1 min-w-0"
                                >
                                  <p className={`text-sm font-semibold truncate ${isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                                    طلب #{notif.order_id?.slice(0, 8)}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {notif.customer?.full_name} &mdash; {getOrderTypeName(notif.order_type)}
                                  </p>
                                </Link>

                                {/* Action buttons */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {!isRead && (
                                    <button
                                      onClick={() => markRead(notif.order_id)}
                                      title="تعيين كمقروء"
                                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-[#D4AF37] transition-colors"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotif(notif.order_id)}
                                    title="حذف"
                                    className="p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Footer */}
                      {visibleNotifications.length > 0 && (
                        <div className="border-t border-slate-100 px-4 py-2 text-center">
                          <Link
                            to="/admin/orders"
                            onClick={() => setShowNotifications(false)}
                            className="text-sm text-[#D4AF37] font-medium hover:underline"
                          >
                            عرض كل الطلبات →
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-600 hover:text-[#D4AF37]"
              >
                عرض الموقع →
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
