import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

import { useBranding } from '@/context/BrandingContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { logoDark } = useBranding();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }
    if (!formData.password) {
      setError('كلمة المرور مطلوبة');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      const data = response.data;

      // Store token and user info
      localStorage.setItem('adminToken', data.access_token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      const message = err.response?.data?.detail || err.message || 'حدث خطأ في الاتصال';
      setError(message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-slate-900 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            {logoDark ? (
              <img
                src={logoDark}
                alt="Dubai Exchange Logo"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FCD34D] rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-2xl font-black text-slate-900">دبي</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-slate-400">شركة دبي العالمية للصرافة</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label className="text-white font-medium">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12 pl-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                  placeholder="admin@example.com"
                  data-testid="admin-email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-white font-medium">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12 pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                  placeholder="••••••••"
                  data-testid="admin-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <button type="button" className="text-sm text-[#D4AF37] hover:underline">
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
              data-testid="admin-login-btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn className="w-5 h-5" />تسجيل الدخول</>
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-400 mb-2">بيانات تجريبية:</p>
            <p className="text-xs text-slate-300">Developer: developer@dubai-exchange.com / dev@123456</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
