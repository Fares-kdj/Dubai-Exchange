import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, Settings, FileText, DollarSign, 
  Palette, Phone, Stamp, MessageSquare, Users, LogOut, 
  Menu, X, Search, Bell, ChevronDown, Globe
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      navigate('/admin/login');
      return;
    }
    setUser(JSON.parse(auth));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم', labelEn: 'Overview' },
    { path: '/admin/orders', icon: Package, label: 'الطلبات', labelEn: 'Orders' },
    { path: '/admin/services', icon: Settings, label: 'الخدمات', labelEn: 'Services' },
    { path: '/admin/forms', icon: FileText, label: 'نماذج الطلبات', labelEn: 'Form Builder' },
    { path: '/admin/rates', icon: DollarSign, label: 'أسعار الصرف', labelEn: 'Rates' },
    { path: '/admin/cms', icon: Globe, label: 'المحتوى', labelEn: 'CMS' },
    { path: '/admin/branding', icon: Palette, label: 'الهوية', labelEn: 'Branding' },
    { path: '/admin/contact', icon: Phone, label: 'التواصل', labelEn: 'Contact' },
    { path: '/admin/stamps', icon: Stamp, label: 'الأختام', labelEn: 'Stamps' },
    { path: '/admin/sms', icon: MessageSquare, label: 'الرسائل', labelEn: 'SMS' },
    { path: '/admin/users', icon: Users, label: 'المستخدمون', labelEn: 'Users' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

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
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.path}>
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
                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
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
