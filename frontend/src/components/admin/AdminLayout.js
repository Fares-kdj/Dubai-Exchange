import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Settings, FileText, DollarSign, 
  Palette, Users, LogOut, Menu, X, Search, Bell, Globe,
  Plane, MapPin, ArrowLeftRight, CreditCard, Wallet, Ban,
  Building2, ChevronDown, ChevronLeft
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState(['orders']); // Default expanded

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (!token || !userStr) {
      navigate('/admin/login');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [navigate]);

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
        { path: '/admin/orders/usdt', icon: Wallet, label: 'USDT', permission: 'view_orders_usdt' },
        { path: '/admin/orders/card', icon: CreditCard, label: 'شحن البطاقات', permission: 'view_orders_card' },
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
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed inset-y-0 right-0 z-50 bg-slate-900 shadow-2xl flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FCD34D] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-black text-slate-900">خير</span>
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-bold text-white">خير بغداد</h1>
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isSubmenuActive(item.submenu)
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
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                                  isActive(sub.path)
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path)
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
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'mr-[280px]' : 'mr-[80px]'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
              <button className="relative p-2 hover:bg-slate-100 rounded-lg">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link to="/" className="text-sm text-slate-600 hover:text-[#D4AF37]">
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
