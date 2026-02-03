import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, ChevronDown, ChevronUp, Edit2, Check, X, Globe, Type } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminCMS = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const contentStructure = [
    {
      page: 'home',
      title: 'الصفحة الرئيسية',
      sections: [
        { block_id: 'home_hero', title: 'Hero Section', fields: ['title', 'subtitle', 'cta_text'] },
        { block_id: 'home_services_title', title: 'عنوان الخدمات', fields: ['title', 'subtitle'] },
        { block_id: 'home_trust', title: 'قسم الثقة', fields: ['title', 'subtitle'] },
        { block_id: 'home_contact', title: 'التواصل', fields: ['title', 'phone', 'email', 'address'] }
      ]
    },
    {
      page: 'footer',
      title: 'Footer',
      sections: [
        { block_id: 'footer_about', title: 'عن الشركة', fields: ['text'] },
        { block_id: 'footer_social', title: 'روابط التواصل', fields: ['facebook', 'instagram', 'whatsapp'] }
      ]
    }
  ];

  const [formData, setFormData] = useState({ content_ar: {}, content_en: {} });

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/api/cms/content');
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
  };

  const getBlockContent = (blockId) => {
    const block = content.find(function(c) { return c.block_id === blockId; });
    return block || { block_id: blockId, content_ar: {}, content_en: {} };
  };

  const handleEdit = (blockId) => {
    const block = getBlockContent(blockId);
    setFormData({ content_ar: block.content_ar || {}, content_en: block.content_en || {} });
    setEditingBlock(blockId);
  };

  const handleSave = async (blockId) => {
    setSaving(true);
    try {
      await fetch(API_URL + '/api/cms/content/' + blockId, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      setEditingBlock(null);
      loadContent();
    } catch (err) {
      console.error('Error:', err);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditingBlock(null);
    setFormData({ content_ar: {}, content_en: {} });
  };

  const updateField = (lang, field, value) => {
    const key = 'content_' + lang;
    setFormData(Object.assign({}, formData, { [key]: Object.assign({}, formData[key], { [field]: value }) }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة المحتوى</h1>
          <p className="text-slate-600">تعديل نصوص الموقع</p>
        </div>
        <button onClick={loadContent} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl flex items-center gap-2 hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />تحديث
        </button>
      </div>

      <div className="space-y-4">
        {contentStructure.map(function(page) {
          const isExpanded = expandedSection === page.page;
          return (
            <div key={page.page} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={function() { setExpandedSection(isExpanded ? null : page.page); }}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-900">{page.title}</span>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              
              {isExpanded && (
                <div className="border-t border-slate-200 divide-y divide-slate-100">
                  {page.sections.map(function(section) {
                    const isEditing = editingBlock === section.block_id;
                    const blockContent = getBlockContent(section.block_id);
                    
                    return (
                      <div key={section.block_id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Type className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-700">{section.title}</span>
                          </div>
                          {!isEditing && (
                            <button onClick={function() { handleEdit(section.block_id); }} className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1">
                              <Edit2 className="w-3 h-3" />تعديل
                            </button>
                          )}
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <Label className="text-amber-600 font-bold">العربية</Label>
                                {section.fields.map(function(field) {
                                  return (
                                    <div key={field} className="space-y-1">
                                      <Label className="text-sm text-slate-500">{field}</Label>
                                      <Input value={formData.content_ar[field] || ''} onChange={function(e) { updateField('ar', field, e.target.value); }} dir="rtl" />
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="space-y-3">
                                <Label className="text-blue-600 font-bold">English</Label>
                                {section.fields.map(function(field) {
                                  return (
                                    <div key={field} className="space-y-1">
                                      <Label className="text-sm text-slate-500">{field}</Label>
                                      <Input value={formData.content_en[field] || ''} onChange={function(e) { updateField('en', field, e.target.value); }} dir="ltr" />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                              <button onClick={handleCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1">
                                <X className="w-4 h-4" />إلغاء
                              </button>
                              <button onClick={function() { handleSave(section.block_id); }} disabled={saving} className="px-4 py-2 bg-amber-500 text-white rounded-lg flex items-center gap-1 disabled:opacity-50">
                                <Check className="w-4 h-4" />{saving ? 'جاري...' : 'حفظ'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-xs text-amber-600 font-bold mb-1">العربية</p>
                              {section.fields.map(function(field) {
                                const val = blockContent.content_ar ? blockContent.content_ar[field] : '';
                                return <p key={field} className="text-slate-600 truncate"><span className="text-slate-400">{field}:</span> {val || '-'}</p>;
                              })}
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-xs text-blue-600 font-bold mb-1">English</p>
                              {section.fields.map(function(field) {
                                const val = blockContent.content_en ? blockContent.content_en[field] : '';
                                return <p key={field} className="text-slate-600 truncate"><span className="text-slate-400">{field}:</span> {val || '-'}</p>;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCMS;
