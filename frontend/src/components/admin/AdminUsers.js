import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, RefreshCw, Shield, User, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ConfirmModal from './ConfirmModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const emptyForm = { email: '', name: '', password: '', role: 'admin', permissions: [], is_active: true };
  const [formData, setFormData] = useState(emptyForm);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const showConfirm = (config) => setConfirmConfig({ ...config, isOpen: true });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/api/auth/users', { headers: getAuthHeaders() });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error('Error:', err); }
    setLoading(false);
  };

  const loadPermissions = async () => {
    try {
      const res = await fetch(API_URL + '/api/auth/permissions', { headers: getAuthHeaders() });
      if (res.ok) { const data = await res.json(); setPermissions(data.permissions || []); }
    } catch (err) { console.error('Error:', err); }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('adminUser');
    if (userStr) setCurrentUser(JSON.parse(userStr));
    loadUsers();
    loadPermissions();
  }, []);

  const handleToggleActive = async (user) => {
    if (user.role === 'developer') return;
    try {
      await fetch(API_URL + '/api/auth/users/' + user.user_id, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ is_active: !user.is_active })
      });
      loadUsers();
    } catch (err) { console.error('Error:', err); }
  };

  const handleDelete = (userId) => {
    showConfirm({
      title: 'حذف المستخدم',
      message: 'هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.',
      onConfirm: async () => {
        try {
          await fetch(API_URL + '/api/auth/users/' + userId, { method: 'DELETE', headers: getAuthHeaders() });
          loadUsers();
        } catch (err) { console.error('Error:', err); }
      }
    });
  };

  const handleEdit = (user) => {
    setFormData({ email: user.email, name: user.name, password: '', role: user.role, permissions: user.permissions || [], is_active: user.is_active });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleNew = () => { setFormData(emptyForm); setEditingUser(null); setShowForm(true); };

  const togglePermission = (val) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(val) ? formData.permissions.filter(p => p !== val) : [...formData.permissions, val]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      const url = editingUser ? API_URL + '/api/auth/users/' + editingUser.user_id : API_URL + '/api/auth/users';
      await fetch(url, { method: editingUser ? 'PUT' : 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) });
      setShowForm(false);
      loadUsers();
    } catch (err) { console.error('Error:', err); }
  };

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

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h1>
          <p className="text-slate-600">إضافة وتعديل المستخدمين والصلاحيات</p>
        </div>
        <button onClick={handleNew} className="px-5 py-2.5 bg-amber-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-amber-700 transition-all shadow-md active:scale-95">
          <Plus className="w-5 h-5 text-white stroke-[2.5]" />
          <span>إضافة مستخدم</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
        {users.map((user) => (
          <div key={user.user_id} className={'flex items-center gap-4 p-4 rounded-xl border-2 ' + (user.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60')}>
            <div className={'w-12 h-12 rounded-xl flex items-center justify-center ' + (user.role === 'developer' ? 'bg-purple-100' : 'bg-blue-100')}>
              {user.role === 'developer' ? <Key className="w-6 h-6 text-purple-600" /> : <User className="w-6 h-6 text-blue-600" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">{user.name}</h3>
                {user.role === 'developer' && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">المطور</span>}
              </div>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {user.role !== 'developer' && (
                <>
                  <button onClick={() => handleToggleActive(user)} className={'p-2 rounded-lg ' + (user.is_active ? 'text-green-600' : 'text-slate-400')}>
                    {user.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <button onClick={() => handleEdit(user)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(user.user_id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600"><Trash2 className="w-5 h-5" /></button>
                </>
              )}
              {user.role === 'developer' && currentUser?.user_id === user.user_id && (
                <button onClick={() => handleEdit(user)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"><Edit className="w-5 h-5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{editingUser ? 'تعديل' : 'إضافة مستخدم'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors border-0" title="إغلاق">
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{editingUser ? 'كلمة المرور الجديدة (اختياري)' : 'كلمة المرور'}</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />
              </div>

              {editingUser?.role !== 'developer' && (
                <div className="space-y-4">
                  <Label className="text-lg font-bold">الصلاحيات</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {permissions.map(p => (
                      <label key={p.value} className={'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ' + (formData.permissions.includes(p.value) ? 'border-amber-500 bg-amber-50' : 'border-slate-200')}>
                        <input type="checkbox" checked={formData.permissions.includes(p.value)} onChange={() => togglePermission(p.value)} className="w-4 h-4 accent-amber-500" />
                        <span className="text-sm font-medium text-slate-700">{p.label_ar}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-slate-600">إلغاء</button>
                <button type="submit" className="px-6 py-2 bg-amber-500 text-white rounded-xl flex items-center gap-2"><Save className="w-5 h-5" />حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type="danger"
      />
    </div>
  );
};

export default AdminUsers;
