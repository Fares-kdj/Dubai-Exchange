import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, Shield, User, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'admin',
    permissions: [],
    is_active: true
  });

  useEffect(() => {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) setCurrentUser(JSON.parse(userStr));
    fetchUsers();
    fetchPermissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/users`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    setLoading(false);
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/permissions`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions || []);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  };

  const handleToggleActive = async (user) => {
    if (user.role === 'developer') return;
    try {
      await fetch(`${API_URL}/api/auth/users/${user.user_id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !user.is_active })
      });
      fetchUsers();
    } catch (err) {
      console.error('Error toggling user:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      role: user.role,
      permissions: user.permissions || [],
      is_active: user.is_active
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleNew = () => {
    setFormData({
      email: '',
      name: '',
      password: '',
      role: 'admin',
      permissions: [],
      is_active: true
    });
    setEditingUser(null);
    setShowForm(true);
  };

  const togglePermission = (permValue) => {
    setFormData(p => ({
      ...p,
      permissions: p.permissions.includes(permValue)
        ? p.permissions.filter(perm => perm !== permValue)
        : [...p.permissions, permValue]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      if (editingUser) {
        await fetch(`${API_URL}/api/auth/users/${editingUser.user_id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${API_URL}/api/auth/users`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      }
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  // Only developer can access this page
  if (currentUser?.role !== 'developer') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">غير مصرح</h2>
          <p className="text-slate-600">هذه الصفحة متاحة للمطور فقط</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h1>
          <p className="text-slate-600">إضافة وتعديل مستخدمي لوحة التحكم وصلاحياتهم</p>
        </div>
        <motion.button
          onClick={handleNew}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة مستخدم
        </motion.button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid gap-4 p-4">
          {users.map((user, index) => (
            <motion.div
              key={user.user_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                user.is_active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                user.role === 'developer' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                {user.role === 'developer' ? (
                  <Key className="w-6 h-6 text-purple-600" />
                ) : (
                  <User className="w-6 h-6 text-blue-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{user.name}</h3>
                  {user.role === 'developer' && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">المطور</span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{user.email}</p>
                {user.role !== 'developer' && (
                  <p className="text-xs text-slate-400 mt-1">
                    {user.permissions?.length || 0} صلاحية
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {user.role !== 'developer' && (
                  <>
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`p-2 rounded-lg ${user.is_active ? 'text-green-600' : 'text-slate-400'}`}
                    >
                      {user.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button onClick={() => handleEdit(user)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(user.user_id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                {user.role === 'developer' && currentUser?.user_id === user.user_id && (
                  <button onClick={() => handleEdit(user)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="اسم المستخدم"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{editingUser ? 'كلمة المرور الجديدة (اتركها فارغة للإبقاء على القديمة)' : 'كلمة المرور *'}</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  required={!editingUser}
                />
              </div>

              {/* Permissions (only for admin role) */}
              {editingUser?.role !== 'developer' && (
                <div className="space-y-4">
                  <Label className="text-lg font-bold">الصلاحيات</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map(perm => (
                      <label
                        key={perm.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.permissions.includes(perm.value)
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.value)}
                          onChange={() => togglePermission(perm.value)}
                          className="w-4 h-4 accent-[#D4AF37]"
                        />
                        <span className="text-sm">{perm.label_ar}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {editingUser?.role !== 'developer' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="is_active">الحساب مفعل</Label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-slate-900 font-medium rounded-xl flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  حفظ
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
