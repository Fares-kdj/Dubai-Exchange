import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Clock,
  MoreVertical, Download, ChevronLeft, ChevronRight, RefreshCw,
  User, Phone, DollarSign, Calendar, FileText, Ban, Printer, X,
  MapPin, Plane, CreditCard, AlertCircle, Edit2, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import ConfirmModal from '../ConfirmModal';
import UniversalReceipt from './UniversalReceipt';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Status configuration
const statusConfig = {
  under_review: { label: 'قيد المراجعة', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
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
  usdt_recharge: { label: 'شحن USDT', icon: CreditCard, color: 'text-emerald-600' },
  card_recharge: { label: 'تعبئة بطاقات', icon: CreditCard, color: 'text-pink-600' },
  usdt: { label: 'شحن USDT', icon: CreditCard, color: 'text-emerald-600' },
  card: { label: 'تعبئة بطاقات', icon: CreditCard, color: 'text-pink-600' },
};

// Centralized field labels for Arabic translation
const FIELD_LABELS_AR = {
  // Common fields
  'usdAmount': 'المبلغ (USD)',
  'iqdAmount': 'المبلغ (IQD)',
  'amount': 'المبلغ',
  'destination': 'الوجهة',
  'travelDate': 'تاريخ السفر',
  'paymentMethod': 'طريقة الدفع',
  'serviceFee': 'رسوم الخدمة',
  'currency': 'العملة',

  // Traveler specific
  'travelType': 'نوع السفر',
  'pickupLocation': 'مكان الاستلام',
  'passport_number': 'رقم الجواز',
  'mother_name': 'اسم الأم',
  'ticket_number': 'رقم التذكرة',
  'batch_number': 'رقم الوجبة',
  'batch_date': 'تاريخ الوجبة',

  // Transfers specific
  'senderName': 'اسم المرسل',
  'receiverName': 'اسم المستلم',
  'senderPhone': 'هاتف المرسل',
  'receiverPhone': 'هاتف المستلم',
  'senderProvince': 'محافظة المرسل',
  'receiverProvince': 'محافظة المستلم',
  'receiverDistrict': 'القضاء',
  'senderCountry': 'دولة المرسل',
  'receiverCountry': 'دولة المستلم',
  'bankName': 'اسم البنك',
  'accountNumber': 'رقم الحساب',
  'iban': 'IBAN',
  'swift': 'SWIFT',

  // Local/Missing keys
  'phone': 'رقم الهاتف',
  'amountUSD': 'المبلغ (USD)',
  'amountIQD': 'المبلغ (IQD)',
  'receiverCurrency': 'عملة المستلم',
  'senderCurrency': 'عملة المرسل',
  'exchangeRate': 'سعر الصرف',
  'total': 'الإجمالي',

  // Traveler - Extended
  'travel_time': 'وقت السفر',
  'passport_issue_date': 'تاريخ إصدار الجواز',
  'passport_expiry_date': 'تاريخ نفاذ الجواز',
  'travel_agency': 'مكتب السياحة',
  'airport_id': 'رقم المطار',
  'border_id': 'رقم المنفذ',
  'pickupLocationName': 'مكان الاستلام',
  'pickupStampId': 'معرف الختم',
  'pickupStampImage': 'صورة الختم',
  'company_stamp_id': 'ختم الشركة',
  'signature_id': 'التوقيع المعتمد',

  // USDT/Card specific
  'networkName': 'الشبكة',
  'walletAddress': 'عنوان المحفظة',
  'cardType': 'نوع البطاقة',
  'cardNumber': 'رقم البطاقة',
  'cardName': 'الاسم على البطاقة',
  'numberType': 'نوع الرقم',

  // International - Additional
  'countryCode': 'كود الدولة',
  'countryName': 'الدولة',
  'methodId': 'معرف الطريقة',
  'methodName': 'طريقة التحويل',
  'receiveAmount': 'المبلغ المستلم',
  'generic_account': 'رقم الحساب أو المعرف',
  'rip': 'رقم الحساب (RIP)',
  // MoneyGram New Fields
  'senderFirstName': 'الاسم الثلاثي للمرسل',
  'senderLastName': 'اللقب للمرسل',
  'senderAddress': 'عنوان المرسل',
  'senderPhone': 'رقم هاتف المرسل',
  'senderDOB': 'تاريخ ميلاد المرسل',
  'senderPOB': 'مكان ميلاد المرسل',
  'receiverFirstName': 'الاسم الثلاثي للمستلم',
  'receiverLastName': 'اللقب للمستلم',
  'receiverDOB': 'تاريخ ميلاد المستلم',
  'receiverPhone': 'رقم هاتف المستلم',
  'totalInCurrency': 'الإجمالي بالعملة',
  // Western Union New Fields
  'receiverAddress': 'عنوان المستلم',
  'idType': 'نوع الهوية',
  'purpose': 'الغرض من التحويل',
  'mtcn': 'رقم الحوالة (MTCN)',
  'reference_number': 'الرقم المرجعي',
  'address': 'عنوان العميل',
  'senderDistrict': 'قضاء المرسل',
  'receiverDistrict': 'قضاء المستلم',
  'bank_name': 'اسم البنك',
  'account_number_iban': 'رقم الحساب أو IBAN'
};

// Centralized document type labels for Arabic translation
const DOC_TYPES_AR = {
  'passport': 'جواز السفر',
  'ticket': 'التذكرة',
  'photo': 'صورة شخصية',
  'id': 'الهوية',
  'id_front': 'الوجه الأمامي للهوية',
  'id_back': 'الوجه الخلفي للهوية',
  'residency': 'الإقامة',
  'visa': 'التأشيرة',
  'payment_proof': 'إثبات الدفع',
  'other': 'أوراق أخرى'
};

// Centralized mapping for field technical values
const VALUE_MAPPING_AR = {
  // Payment Methods
  'zain_cash': 'زين كاش',
  'mastercard_rafidain': 'ماستركارد الرافدين',
  'fib': 'FIB',
  'vodafone_cash': 'فودافون كاش',

  // Currencies
  'USD': 'دولار أمريكي',
  'IQD': 'دينار عراقي',

  // Travel Types
  'air': 'جوي',
  'land': 'بري',

  // Number Type (Card Recharge)
  'card': 'رقم بطاقة (16 رقم)',
  'account': 'رقم حساب (10 أرقام)',

  // Order Types
  'usdt_recharge': 'شحن USDT',
  'card_recharge': 'تعبئة بطاقات',
  'usdt': 'شحن USDT',

  // Countries & Methods (Values)
  'iraq': 'العراق',
  'uae': 'الإمارات',
  'saudi': 'السعودية',
  'jordan': 'الأردن',
  'egypt': 'مصر',
  'turkey': 'تركيا',
  'usa': 'الولايات المتحدة',
  'uk': 'بريطانيا',
  'germany': 'ألمانيا',
  'france': 'فرنسا',
  'canada': 'كندا',
  'australia': 'أستراليا',
  'india': 'الهند',
  'pakistan': 'باكستان',
  'lebanon': 'لبنان',
  'syria': 'سوريا',
  'DZ': 'الجزائر',
  'Algeria': 'الجزائر',
  'algeria': 'الجزائر',
  'TR': 'تركيا',
  'Turkey': 'تركيا',
  'turkey': 'تركيا',
  'TRY': 'ليرة تركية',
  'try': 'ليرة تركية',
  'BaridiMob': 'بريدي موب',
  'western_union': 'ويسترن يونيون',
  'ria': 'ريا',
  'bank_dropdown_test': 'تحويل بنكي',
  'Bank Transfer (Test)': 'تحويل بنكي',
  'Bank Transfer (Dropdown Test)': 'تحويل بنكي',
  'تحويل بنكي (تجريبي)': 'تحويل بنكي',
  'bank_transfer': 'تحويل بنكي',

  // Iraqi Provinces
  'baghdad': 'بغداد',
  'basra': 'البصرة',
  'erbil': 'أربيل',
  'sulaymaniyah': 'السليمانية',
  'duhok': 'دهوك',
  'nineveh': 'نينوى',
  'kirkuk': 'كركوك',
  'diyala': 'ديالى',
  'anbar': 'الأنبار',
  'najaf': 'النجف',
  'karbala': 'كربلاء',
  'babylon': 'بابل',
  'wasit': 'واسط',
  'maysan': 'ميسان',
  'dhiqar': 'ذي قار',
  'muthanna': 'المثنى',
  'qadisiyyah': 'القادسية',
  'saladin': 'صلاح الدين',
  // ID Types
  'passport': 'جواز سفر',
  'national_id': 'بطاقة هوية',
  // Purposes
  'trade': 'تجارة',
  'family_expenses': 'نفقات الأسرة',
  'medical': 'علاج'
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
  const [companyStamps, setCompanyStamps] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [receiptLoaded, setReceiptLoaded] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  // Fetch airports and borders for traveler orders, and stamps/signatures for all
  useEffect(() => {
    if (order) {
      setReceiptLoaded(false);
      const token = localStorage.getItem('adminToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const currentAdminData = order.admin_data || {};

      if (order.order_type === 'traveler') {
        fetch(`${API_URL}/api/stamps/airports`, { headers }).then(r => r.json()).then(setAirports).catch(() => { });
        fetch(`${API_URL}/api/stamps/borders`, { headers }).then(r => r.json()).then(setBorders).catch(() => { });
      }

      // Fetch company stamps and set first as default if none selected
      fetch(`${API_URL}/api/stamps/?stamp_type=company&active_only=true`, { headers })
        .then(r => r.json())
        .then(data => {
          setCompanyStamps(data);
          if (!currentAdminData.company_stamp_id && data.length > 0) {
            setAdminData(prev => ({ ...prev, company_stamp_id: data[0].stamp_id }));
          }
        }).catch(() => { });

      // Fetch signatures and set first as default if none selected
      fetch(`${API_URL}/api/stamps/?stamp_type=signature&active_only=true`, { headers })
        .then(r => r.json())
        .then(data => {
          setSignatures(data);
          if (!currentAdminData.signature_id && data.length > 0) {
            setAdminData(prev => ({ ...prev, signature_id: data[0].stamp_id }));
          }
        }).catch(() => { });

      // Fetch contact info for receipt footer
      fetch(`${API_URL}/api/cms/contact`).then(r => r.json()).then(setContactInfo).catch(() => { });

      setAdminData(prev => ({ ...prev, ...currentAdminData }));
    }
  }, [order]);

  // Handle history for back button to close modal
  useEffect(() => {
    if (isOpen) {
      const state = { modalOpen: true };
      window.history.pushState(state, '');

      const handlePopState = () => {
        if (isOpen) {
          onClose();
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (window.history.state?.modalOpen) {
          window.history.back();
        }
      };
    }
  }, [isOpen, onClose]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const customerName = order.customer?.full_name || order.details?.senderName || 'عميل';
    const typeLabel = orderTypeConfig[order.order_type]?.label || 'وصل';
    const orderId = order.order_id || '';

    // Set document title to [Name]-[Type]-[OrderID] for PDF filename
    document.title = `${customerName}-${typeLabel}-${orderId}`;

    window.print();

    // Restore original title after a short delay
    setTimeout(() => {
      document.title = originalTitle;
    }, 500);
  };

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
        toast.success('تم تحديث حالة الطلب بنجاح');
        onStatusChange();
        if (newStatus === 'rejected') setShowRejectInput(false);
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.detail || 'حدث خطأ أثناء تحديث الحالة');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('حدث خطأ بالاتصال');
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
        toast.success('تم حفظ البيانات بنجاح');
        setShowEditForm(false);
        // Update local order data immediately for UI feedback
        if (order) {
          order.admin_data = { ...adminData };
        }
        onStatusChange();
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  const handleBlock = async () => {
    onBlock?.();
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
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600 font-mono">{order.order_id}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(order.order_id);
                    toast.success('تم نسخ رقم الطلب');
                  }}
                  className="p-1 hover:bg-slate-200 rounded transition-colors"
                  title="نسخ رقم الطلب"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig[order.status]?.color || 'bg-slate-100'}`}>
                {statusConfig[order.status]?.label || order.status}
              </span>
              <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors border-0" title="إغلاق">
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {['details', 'admin', 'documents', 'history'].filter(Boolean).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab
                  ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {tab === 'details' ? 'البيانات' : tab === 'admin' ? 'بيانات الأدمن' : tab === 'documents' ? `الوثائق ${order.payment_proofs?.length > 0 ? '(+إثبات دفع)' : ''}` : 'السجل'}
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
                    <span className="text-slate-500">الاسم</span>
                    <div className="text-right">
                      <span className="font-medium text-slate-900 block">{order.customer?.full_name}</span>
                      {order.customer_blocked && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full mt-1">
                          <Ban className="w-3 h-3" /> عميل محظور
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">الهاتف</span>
                      <span className="font-mono text-slate-900" style={{ direction: 'ltr' }}>{order.customer?.phone}</span>
                    </div>
                    {order.customer?.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">البريد</span>
                        <span className="text-slate-900">{order.customer?.email}</span>
                      </div>
                    )}
                    {order.customer?.address && (
                      <div className="space-y-1">
                        <span className="text-slate-500 text-xs block">العنوان</span>
                        <span className="text-slate-900 text-sm font-medium">{order.customer?.address}</span>
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
                      <span className="font-medium text-slate-900">{orderTypeConfig[order.order_type]?.label || order.order_type}</span>
                    </div>
                    {(order.details?.usdAmount || order.details?.amountUSD) && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">المبلغ (USD)</span>
                        <span className="font-bold text-green-600">${Number(order.details.usdAmount || order.details.amountUSD).toFixed(2)}</span>
                      </div>
                    )}
                    {(order.details?.iqdAmount || order.details?.amountIQD) && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">المبلغ (IQD)</span>
                        <span className="font-medium text-slate-900">{Math.round(Number(order.details.iqdAmount || order.details.amountIQD)).toLocaleString()} د.ع</span>
                      </div>
                    )}
                    {order.details?.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">طريقة الدفع</span>
                        <span className="text-slate-900">{VALUE_MAPPING_AR[order.details.paymentMethod] || order.details.paymentMethod}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">التاريخ</span>
                      <span className="text-sm text-slate-900">{formatDate(order.created_at)}</span>
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
                      {Object.entries(order.details)
                        .flatMap(([k, v]) => {
                          if (k === 'customFields' && v && typeof v === 'object') {
                            return Object.entries(v);
                          }
                          return [[k, v]];
                        })
                        .filter(([k, v]) => !['usdAmount', 'amountUSD', 'iqdAmount', 'amountIQD', 'paymentMethod', 'customFields', 'pickupLocation', 'pickupStampId', 'pickupStampImage'].includes(k) && v !== null && v !== undefined && v !== '')
                        .map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-slate-500">{FIELD_LABELS_AR[key] || key}</p>
                            {key === 'walletAddress' || key === 'generic_account' || key === 'rip' || key === 'iban' ? (
                              <div className="flex items-center gap-2 mt-1">
                                <p className="font-mono text-[10px] break-all flex-1 text-slate-900 leading-relaxed bg-slate-100 p-1 rounded">{String(value)}</p>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(String(value));
                                    toast.success('تم النسخ');
                                  }}
                                  className="p-1.5 hover:bg-slate-200 rounded-lg shrink-0 transition-colors"
                                  title="نسخ"
                                >
                                  <Copy className="w-4 h-4 text-slate-500" />
                                </button>
                              </div>
                            ) : (typeof value === 'string' && (value.startsWith('/uploads/') || value.startsWith('http'))) ? (
                              <div className="mt-1">
                                <a
                                  href={value.startsWith('http') ? value : `${process.env.REACT_APP_BACKEND_URL}${value}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-16 h-16 rounded-lg border border-slate-200 overflow-hidden hover:ring-2 hover:ring-[#D4AF37] transition-all"
                                >
                                  <img
                                    src={value.startsWith('http') ? value : `${process.env.REACT_APP_BACKEND_URL}${value}`}
                                    alt="Field attachment"
                                    className="w-full h-full object-cover"
                                  />
                                </a>
                              </div>
                            ) : (
                              <p className={`font-medium text-sm text-slate-900 ${(key.toLowerCase().includes('phone') || String(value).startsWith('+')) ? 'inline-block' : ''}`} style={(key.toLowerCase().includes('phone') || String(value).startsWith('+')) ? { direction: 'ltr' } : {}}>
                                {VALUE_MAPPING_AR[value] || String(value)}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Data Tab - For Stamps/Signatures and Traveler data */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">
                    {order.order_type === 'western_union'
                      ? 'بيانات الأدمن (ويسترن يونيون)'
                      : 'بيانات الأدمن (حجز المسافرين)'}
                  </h3>
                  <button
                    onClick={() => {
                      if (showEditForm) {
                        // Reset admin data on cancel
                        setAdminData(order.admin_data || {});
                      }
                      setShowEditForm(!showEditForm);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    {showEditForm ? 'إلغاء' : 'تعديل'}
                  </button>
                </div>

                {showEditForm ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {order.order_type === 'traveler' && (
                      <>
                        {/* traveler fields */}
                        <div className="space-y-2">
                          <Label>رقم الوجبة</Label>
                          <Input
                            value={adminData.batch_number || ''}
                            onChange={e => setAdminData(p => ({ ...p, batch_number: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>تاريخ الوجبة</Label>
                          <DatePicker
                            date={adminData.batch_date ? new Date(adminData.batch_date) : undefined}
                            setDate={(date) => setAdminData(p => ({ ...p, batch_date: date ? format(date, 'yyyy-MM-dd') : '' }))}
                            placeholder="اختر تاريخ..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>اسم الأم</Label>
                          <Input
                            value={adminData.mother_name || ''}
                            onChange={e => setAdminData(p => ({ ...p, mother_name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>رقم التذكرة</Label>
                          <Input
                            value={adminData.ticket_number || ''}
                            onChange={e => setAdminData(p => ({ ...p, ticket_number: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>وقت السفر</Label>
                          <Input
                            type="time"
                            value={adminData.travel_time || ''}
                            onChange={e => setAdminData(p => ({ ...p, travel_time: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>رقم الجواز</Label>
                          <Input
                            value={adminData.passport_number || ''}
                            onChange={e => setAdminData(p => ({ ...p, passport_number: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>تاريخ الإصدار</Label>
                          <DatePicker
                            date={adminData.passport_issue_date ? new Date(adminData.passport_issue_date) : undefined}
                            setDate={(date) => setAdminData(p => ({ ...p, passport_issue_date: date ? format(date, 'yyyy-MM-dd') : '' }))}
                            placeholder="اختر تاريخ..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>تاريخ النفاذ</Label>
                          <DatePicker
                            date={adminData.passport_expiry_date ? new Date(adminData.passport_expiry_date) : undefined}
                            setDate={(date) => setAdminData(p => ({ ...p, passport_expiry_date: date ? format(date, 'yyyy-MM-dd') : '' }))}
                            placeholder="اختر تاريخ..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>مكتب السياحة</Label>
                          <Input
                            value={adminData.travel_agency || ''}
                            onChange={e => setAdminData(p => ({ ...p, travel_agency: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>نوع السفر</Label>
                          <Select value={adminData.travel_type || ''} onValueChange={v => setAdminData(p => ({ ...p, travel_type: v }))}>
                            <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="air">جوي</SelectItem>
                              <SelectItem value="land">بري</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {adminData.travel_type === 'air' && (
                          <div className="space-y-2">
                            <Label>المطار</Label>
                            <Select value={adminData.airport_id || ''} onValueChange={v => setAdminData(p => ({ ...p, airport_id: v }))}>
                              <SelectTrigger><SelectValue placeholder="اختر المطار..." /></SelectTrigger>
                              <SelectContent>
                                {airports.map(a => <SelectItem key={a.stamp_id} value={a.stamp_id}>{a.name_ar}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        {adminData.travel_type === 'land' && (
                          <div className="space-y-2">
                            <Label>الالمنفذ الحدودي</Label>
                            <Select value={adminData.border_id || ''} onValueChange={v => setAdminData(p => ({ ...p, border_id: v }))}>
                              <SelectTrigger><SelectValue placeholder="اختر المنفذ..." /></SelectTrigger>
                              <SelectContent>
                                {borders.map(b => <SelectItem key={b.stamp_id} value={b.stamp_id}>{b.name_ar}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </>
                    )}

                    {order.order_type === 'western_union' && (
                      <>
                        <div className="space-y-2">
                          <Label>رقم الهوية / جواز السفر</Label>
                          <Input
                            value={adminData.id_number || ''}
                            onChange={e => setAdminData(p => ({ ...p, id_number: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>تاريخ الإصدار</Label>
                          <DatePicker
                            date={adminData.id_issue_date ? new Date(adminData.id_issue_date) : undefined}
                            setDate={(date) => setAdminData(p => ({ ...p, id_issue_date: date ? format(date, 'yyyy-MM-dd') : '' }))}
                            placeholder="اختر تاريخ..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>جهة الإصدار</Label>
                          <Input
                            value={adminData.id_issuing_authority || ''}
                            onChange={e => setAdminData(p => ({ ...p, id_issuing_authority: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>تاريخ انتهاء الصلاحية</Label>
                          <DatePicker
                            date={adminData.id_expiry_date ? new Date(adminData.id_expiry_date) : undefined}
                            setDate={(date) => setAdminData(p => ({ ...p, id_expiry_date: date ? format(date, 'yyyy-MM-dd') : '' }))}
                            placeholder="اختر تاريخ..."
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label>ختم الشركة للوصول</Label>
                      <Select value={adminData.company_stamp_id || ''} onValueChange={v => setAdminData(p => ({ ...p, company_stamp_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="اختر الختم..." /></SelectTrigger>
                        <SelectContent>
                          {companyStamps.map(s => <SelectItem key={s.stamp_id} value={s.stamp_id}>{s.name_ar}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>التوقيع للوصول</Label>
                      <Select value={adminData.signature_id || ''} onValueChange={v => setAdminData(p => ({ ...p, signature_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="اختر التوقيع..." /></SelectTrigger>
                        <SelectContent>
                          {signatures.map(s => <SelectItem key={s.stamp_id} value={s.stamp_id}>{s.name_ar}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-full flex justify-end pt-4">
                      <button
                        onClick={handleSaveAdminData}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        حفظ البيانات
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {order.order_type === 'traveler' && [
                      { label: 'رقم الوجبة', value: adminData.batch_number },
                      { label: 'تاريخ الوجبة', value: adminData.batch_date },
                      { label: 'اسم الأم', value: adminData.mother_name },
                      { label: 'رقم التذكرة', value: adminData.ticket_number },
                      { label: 'وقت السفر', value: adminData.travel_time },
                      { label: 'رقم الجواز', value: adminData.passport_number },
                      { label: 'تاريخ الإصدار', value: adminData.passport_issue_date },
                      { label: 'تاريخ النفاذ', value: adminData.passport_expiry_date },
                      { label: 'مكتب السياحة', value: adminData.travel_agency },
                      { label: 'نوع السفر', value: adminData.travel_type === 'air' ? 'جوي' : adminData.travel_type === 'land' ? 'بري' : null },
                    ].filter(item => item.value).map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                        <p className="font-medium text-slate-900">{item.value || '-'}</p>
                      </div>
                    ))}

                    {order.order_type === 'western_union' && [
                      { label: 'رقم الهوية / جواز السفر', value: adminData.id_number },
                      { label: 'تاريخ الإصدار', value: adminData.id_issue_date },
                      { label: 'جهة الإصدار', value: adminData.id_issuing_authority },
                      { label: 'تاريخ انتهاء الصلاحية', value: adminData.id_expiry_date },
                    ].filter(item => item.value).map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                        <p className="font-medium text-slate-900">{item.value || '-'}</p>
                      </div>
                    ))}

                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">ختم الشركة</p>
                      <p className="font-medium text-slate-900">
                        {companyStamps.find(s => s.stamp_id === adminData.company_stamp_id)?.name_ar || '-'}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">التوقيع</p>
                      <p className="font-medium text-slate-900">
                        {signatures.find(s => s.stamp_id === adminData.signature_id)?.name_ar || '-'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">الوثائق المرفوعة</h3>
                {order.documents && order.documents.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {order.documents.map((doc, idx) => (
                      <a key={idx} href={`${API_URL}${doc.file_url}`} target="_blank" rel="noopener noreferrer"
                        className="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-blue-600" />
                        <span className="text-sm font-medium">{DOC_TYPES_AR[doc.doc_type] || doc.doc_type}</span>
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
                        <a key={idx} href={`${API_URL}${proof.file_url || proof}`} target="_blank" rel="noopener noreferrer"
                          className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
                          <FileText className="w-10 h-10 mx-auto mb-2 text-green-600" />
                          <span className="text-sm font-medium">إثبات {idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  </>
                )}

                {/* New: Show custom field images in Documents tab */}
                {order.details?.customFields && Object.values(order.details.customFields).some(v => typeof v === 'string' && (v.startsWith('/uploads/') || v.startsWith('http'))) && (
                  <>
                    <h3 className="font-bold text-slate-900 mt-6">صور الحقول الإضافية</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(order.details.customFields)
                        .filter(([_, v]) => typeof v === 'string' && (v.startsWith('/uploads/') || v.startsWith('http')))
                        .map(([key, value], idx) => (
                          <a key={idx} href={value.startsWith('http') ? value : `${API_URL}${value}`} target="_blank" rel="noopener noreferrer"
                            className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors border border-purple-100">
                            <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden border border-purple-200">
                              <img src={value.startsWith('http') ? value : `${API_URL}${value}`} alt="Image" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs font-medium block truncate">{FIELD_LABELS_AR[key] || key}</span>
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
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${entry.status === 'approved' ? 'bg-green-500' :
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
                <button
                  onClick={handlePrint}
                  disabled={!receiptLoaded || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed mr-auto transition-colors"
                >
                  <Printer className="w-4 h-4" /> {receiptLoaded ? 'طباعة' : 'جاري تجهيز الوصل...'}
                </button>
              </div>
            )}
          </div>
          {order && (
            <div className="hidden print:block">
              <UniversalReceipt
                order={{ ...order, admin_data: adminData }}
                airports={airports}
                borders={borders}
                companyStamps={companyStamps}
                signatures={signatures}
                contactInfo={contactInfo}
                onImageLoad={() => setReceiptLoaded(true)}
              />
            </div>
          )}
        </motion.div>
      </div >
    </AnimatePresence >
  );
};

// Main Orders Page Component
const BaseOrdersPage = ({
  title,
  orderType,
  columns = ['order_id', 'customer', 'amount', 'status', 'date', 'actions'],
  extraFilters = null
}) => {
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'danger', title: '', message: '', onConfirm: null });

  const showConfirm = (config) => {
    setConfirmConfig({ ...config, isOpen: true });
  };
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
    { value: 'under_review', label: 'قيد المراجعة' },
    { value: 'waiting_payment', label: 'في انتظار الدفع' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' },
    { value: 'ignored', label: 'تم التجاهل' },
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  };

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      let url = `${API_URL}/api/orders?page=${page}&page_size=${pageSize}`;
      if (orderType && orderType !== 'all') url += `&order_type=${orderType}`;
      if (filterStatus !== 'all') url += `&status=${filterStatus}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      const updatedOrders = data.orders || [];
      setOrders(updatedOrders);
      setTotalOrders(data.total || 0);

      // Sync the selected order if modal is open
      if (showDetail && selectedOrder) {
        const updatedSelected = updatedOrders.find(o => o.order_id === selectedOrder.order_id);
        if (updatedSelected) {
          setSelectedOrder(updatedSelected);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleDelete = (orderId) => {
    showConfirm({
      type: 'danger',
      title: 'حذف الطلب',
      message: 'هل أنت متأكد من حذف هذا الطلب نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          if (res.ok) {
            toast.success('تم حذف الطلب بنجاح');
            fetchOrders(false);
          }
        } catch (err) {
          console.error('Error:', err);
        }
      }
    });
  };

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  const handleBlockOrder = (order) => {
    showConfirm({
      type: 'warning',
      title: 'حظر العميل',
      message: `هل أنت متأكد من حظر العميل ${order.customer?.full_name}؟ سيتم منعه من استخدام الخدمة مستقبلاً.`,
      onConfirm: async () => {
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
            toast.success('تم حظر العميل بنجاح');
            fetchOrders(false);
            if (showDetail) setShowDetail(false);
          } else {
            const err = await res.json();
            toast.error(err.detail || 'حدث خطأ أثناء الحظر');
          }
        } catch (err) {
          console.error('Error:', err);
        }
        setLoading(false);
      }
    });
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
                  {orderType === 'all' && (
                    <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase">النوع</th>
                  )}
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
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-slate-900">{order.order_id}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(order.order_id);
                            toast.success('تم نسخ رقم الطلب');
                          }}
                          className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                          title="نسخ رقم الطلب"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                        </button>
                      </div>
                    </td>
                    {orderType === 'all' && (
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {orderTypeConfig[order.order_type]?.label || order.order_type}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{order.customer?.full_name}</span>
                        {order.customer_blocked && (
                          <span className="inline-flex items-center gap-0.5 text-red-600 text-[10px] font-bold">
                            <Ban className="w-2.5 h-2.5" /> محظور
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-mono" style={{ direction: 'ltr', display: 'inline-block' }}>{order.customer?.phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {order.details?.usdAmount || order.details?.amountUSD ?
                          `$${Number(order.details.usdAmount || order.details.amountUSD).toFixed(2)}` :
                          (order.details?.amount ? Number(order.details.amount).toFixed(2) : '-')}
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
        onStatusChange={() => fetchOrders(false)}
        onBlock={() => handleBlockOrder(selectedOrder)}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </div >
  );
};

export { BaseOrdersPage, OrderDetailModal, statusConfig, orderTypeConfig, formatDate };
export default BaseOrdersPage;
