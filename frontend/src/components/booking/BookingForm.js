import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { User, Phone, Plane, MapPin, Calendar, DollarSign, CreditCard, Upload, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CountryPhoneSelect from '@/components/ui/CountryPhoneSelect';
import { DatePicker } from '@/components/ui/DatePicker';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BookingForm = ({ onSubmit }) => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const isArabic = currentLanguage === 'ar';
  const isKurdish = currentLanguage === 'ku';

  const t = (ar, en, ku) => {
    if (isKurdish) return ku || en;
    if (isArabic) return ar;
    return en;
  };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [airports, setAirports] = useState([]);
  const [borders, setBorders] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [usdRate, setUsdRate] = useState(1500); // Fallback rate

  // Fetch airports, borders, and exchange rates from API
  useEffect(() => {
    const fetchLocations = async () => {
      setLocationsLoading(true);
      try {
        const [airRes, borderRes, ratesRes] = await Promise.all([
          fetch(`${API_URL}/api/stamps/airports?active_only=true`),
          fetch(`${API_URL}/api/stamps/borders?active_only=true`),
          fetch(`${API_URL}/api/rates?active_only=true`)
        ]);
        if (airRes.ok) setAirports(await airRes.json());
        if (borderRes.ok) setBorders(await borderRes.json());
        if (ratesRes.ok) {
          const ratesData = await ratesRes.json();
          const usdData = ratesData.find(r => r.currency_code === 'USD');
          if (usdData && usdData.sell_rate) {
            setUsdRate(usdData.sell_rate);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        toast.error(t('فشل تحميل البيانات. حاول مرة أخرى.', 'Failed to load data. Please try again.', 'نەتوانرا زانیارییەکان باربکرێن. تکایە دووبارە هەوڵبدەرەوە.'));
      }
      setLocationsLoading(false);
    };
    fetchLocations();
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    travelType: '',
    destination: '',
    travelDate: '',
    pickupLocation: '',       // stamp_id of selected airport/border
    pickupLocationName: '',   // human-readable name (for display)
    pickupStampId: '',        // same as pickupLocation (for clarity in receipt)
    pickupStampImage: null,   // stamp image URL (for receipt printing)
    usdAmount: '',
    iqdAmount: '',
    paymentMethod: '',
    passportImage: null,
    ticketImage: null,
    personalPhoto: null
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    passport: null,
    ticket: null,
    photo: null
  });

  const travelTypes = [
    { value: 'air', labelAr: 'جوي', labelEn: 'Air', labelKu: 'ئاسمانی' },
    { value: 'land', labelAr: 'بري', labelEn: 'Land', labelKu: 'وشکانی' }
  ];

  // Note: Traveler booking has NO fee as per requirements
  const paymentMethods = [
    { value: 'zain_cash', labelAr: 'زين كاش', labelEn: 'Zain Cash', labelKu: 'زەین کاش' },
    { value: 'mastercard_rafidain', labelAr: 'ماستركارد الرافدين', labelEn: 'Mastercard Al-Rafidain', labelKu: 'ماستەرکارد الڕافدین' },
    { value: 'fib', labelAr: 'FIB', labelEn: 'FIB', labelKu: 'FIB' }
  ];

  // Active list based on travel type
  const pickupLocations = formData.travelType === 'air' ? airports : borders;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate IQD when USD changes
    if (field === 'usdAmount' && value) {
      setFormData(prev => ({ ...prev, iqdAmount: (parseFloat(value) * usdRate).toFixed(0) }));
    }

    // When travel type changes, reset pickup location and its related info
    if (field === 'travelType') {
      setFormData(prev => ({
        ...prev,
        travelType: value,
        pickupLocation: '',
        pickupLocationName: '',
        pickupStampId: '',
        pickupStampImage: null
      }));
      return;
    }
  };

  // Special handler for pickup location selection - saves stamp info for receipt
  const handlePickupSelect = (stampId) => {
    const list = formData.travelType === 'air' ? airports : borders;
    const selected = list.find(s => s.stamp_id === stampId);
    setFormData(prev => ({
      ...prev,
      pickupLocation: stampId,
      pickupLocationName: isKurdish ? (selected?.name_ku || selected?.name_ar) : isArabic ? selected?.name_ar : (selected?.name_en || selected?.name_ar),
      pickupStampId: selected?.stamp_id || '',
      pickupStampImage: selected?.stamp_image || null
    }));
    if (errors.pickupLocation) setErrors(prev => ({ ...prev, pickupLocation: '' }));
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: t(
            'حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)',
            'File size too large (max 5MB)',
            'قەبارەی فایلەکە زۆر گەورەیە (زۆرترین ٥ مێگابایت)'
          )
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFiles(prev => ({ ...prev, [type]: { name: file.name, preview: reader.result } }));
        setFormData(prev => ({ ...prev, [`${type}Image`]: file }));
        if (errors[type]) {
          setErrors(prev => ({ ...prev, [type]: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type) => {
    setUploadedFiles(prev => ({ ...prev, [type]: null }));
    setFormData(prev => ({ ...prev, [`${type}Image`]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = t('الاسم مطلوب', 'Name required', 'ناو پێویستە');
    if (!formData.phone.trim()) newErrors.phone = t('رقم الهاتف مطلوب', 'Phone required', 'ژمارەی مۆبایل پێویستە');
    if (!formData.address.trim()) newErrors.address = t('عنوان العميل مطلوب', 'Customer address required', 'ناونیشانی کڕیار پێویستە');
    if (!formData.travelType) newErrors.travelType = t('نوع السفر مطلوب', 'Travel type required', 'جۆری گەشت پێویستە');
    if (!formData.destination.trim()) newErrors.destination = t('وجهة السفر مطلوبة', 'Destination required', 'شوێنی مەبەست پێویستە');
    if (!formData.travelDate) newErrors.travelDate = t('تاريخ السفر مطلوب', 'Travel date required', 'ڕێکەوتی گەشت پێویستە');
    if (!formData.pickupLocation) newErrors.pickupLocation = t('مكان الاستلام مطلوب', 'Pickup location required', 'شوێنی وەرگرتن پێویستە');
    if (!formData.usdAmount || parseFloat(formData.usdAmount) <= 0) newErrors.usdAmount = t('المبلغ مطلوب', 'Amount required', 'بڕ پێویستە');
    if (!formData.paymentMethod) newErrors.paymentMethod = t('طريقة الدفع مطلوبة', 'Payment method required', 'شێوازی پارەدان پێویستە');
    if (!uploadedFiles.passport) newErrors.passport = t('صورة الجواز مطلوبة', 'Passport image required', 'وێنەی پاسپۆرت پێویستە');
    if (!uploadedFiles.ticket) newErrors.ticket = t('صورة التذكرة مطلوبة', 'Ticket image required', 'وێنەی پلیت پێویستە');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFile = async (type, file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('order_type', 'traveler');
    formData.append('doc_type', type);
    formData.append('file', file);

    const API_URL = process.env.REACT_APP_BACKEND_URL;
    try {
      const res = await fetch(`${API_URL}/api/orders/upload-document`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error(`Upload error for ${type}:`, err);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    const API_URL = process.env.REACT_APP_BACKEND_URL;

    try {
      // 0. Perform Block Check for better UX
      const blockRes = await fetch(`${API_URL}/api/blocklist/check?full_name=${encodeURIComponent(formData.fullName)}&phone=${encodeURIComponent(formData.phone)}`);
      if (blockRes.ok) {
        const blockData = await blockRes.json();
        if (blockData.blocked) {
          toast.error(blockData.message || t('عذراً، لا يمكن إتمام طلبك حالياً.', 'Sorry, your request cannot be processed at this time.', 'ببوورە، داواکارییەکەت لە ئێستادا جێبەجێ ناکرێت.'));
          setLoading(false);
          return;
        }
      }

      // 1. Upload documents first
      const docs = [];

      const passportDoc = await uploadFile('passport', formData.passportImage);
      if (passportDoc) docs.push(passportDoc);

      const ticketDoc = await uploadFile('ticket', formData.ticketImage);
      if (ticketDoc) docs.push(ticketDoc);

      const photoDoc = await uploadFile('photo', formData.personalPhoto); // Corrected from photoImage
      if (photoDoc) docs.push(photoDoc);

      // 2. Create order with document info
      const orderData = {
        order_type: 'traveler',
        customer: {
          full_name: formData.fullName,
          phone: formData.phone,
          address: formData.address
        },
        details: {
          travelType: formData.travelType,
          destination: formData.destination,
          travelDate: formData.travelDate,
          pickupLocation: formData.pickupLocation,           // stamp_id
          pickupLocationName: formData.pickupLocationName,   // name for display
          pickupStampId: formData.pickupStampId,             // for receipt
          pickupStampImage: formData.pickupStampImage,       // stamp image for receipt
          usdAmount: formData.usdAmount,
          iqdAmount: formData.iqdAmount,
          paymentMethod: formData.paymentMethod
        },
        documents: docs
      };

      const response = await fetch(API_URL + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        onSubmit({ ...formData, orderId: order.order_id });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(t('حدث خطأ. حاول مرة أخرى.', 'An error occurred. Please try again.', 'هەڵەیەک ڕوویدا. دووبارە هەوڵ بدەرەوە.'));
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('الشروط', 'Terms', 'مەرجەکان')}
              </span>
            </div>
            <div className="w-16 h-1 bg-green-500 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('معلومات الحجز', 'Booking Details', 'زانیارییەکان')}
              </span>
            </div>
            <div className={`w-16 h-1 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                3
              </div>
              <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('التأكيد', 'Confirmation', 'دڵنیابوونەوە')}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto"
          data-testid="booking-form"
        >
          {/* Customer Information */}
          <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('بيانات العميل', 'Customer Information', 'زانیاری کڕیار')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('الاسم الكامل', 'Full Name', 'ناوی تەواو')} *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'} focus:border-[#D4AF37]`}
                  placeholder={t('أدخل الاسم الكامل', 'Enter full name', 'ناوی تەواو بنووسە')}
                  data-testid="full-name-input"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('رقم الهاتف', 'Phone Number', 'ژمارەی مۆبایل')} *
                </Label>
                <CountryPhoneSelect
                  value={formData.phone}
                  onChange={(val) => handleInputChange('phone', val)}
                  isDark={isDark}
                  data-testid="phone-input"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('عنوان العميل', 'Customer Address', 'ناونیشانی کڕیار')} *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'} focus:border-[#D4AF37]`}
                  placeholder={t('أدخل عنوان السكن الحالي', 'Enter current residential address', 'ناونیشانی نیشتەجێبوونی ئێستا بنووسە')}
                  data-testid="address-input"
                />
                {errors.address && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Information */}
          <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('بيانات السفر', 'Travel Information', 'زانیاری گەشت')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('نوع السفر', 'Travel Type', 'جۆری گەشت')} *
                </Label>
                <Select value={formData.travelType} onValueChange={(value) => handleInputChange('travelType', value)}>
                  <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="travel-type-select">
                    <SelectValue placeholder={t('اختر نوع السفر', 'Select travel type', 'جۆری گەشت هەڵبژێرە')} />
                  </SelectTrigger>
                  <SelectContent>
                    {travelTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {t(type.labelAr, type.labelEn, type.labelKu)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.travelType && <p className="text-sm text-red-500 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.travelType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('وجهة السفر', 'Destination', 'شوێنی مەبەست')} *
                </Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className={`h-12 focus:border-[#D4AF37] !text-white ${isDark ? 'bg-slate-700 border-slate-600' : 'border-slate-300 !text-slate-900'}`}
                  placeholder={t('مثال: دبي، تركيا، مصر', 'e.g., Dubai, Turkey, Egypt', 'بۆ نموونە: دوبەی، تورکیا، میسر')}
                  data-testid="destination-input"
                />
                {errors.destination && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.destination}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelDate" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('تاريخ السفر', 'Travel Date', 'ڕێکەوتی گەشت')} *
                </Label>
                <DatePicker
                  date={formData.travelDate ? new Date(formData.travelDate) : undefined}
                  setDate={(date) => {
                    handleInputChange('travelDate', date ? format(date, 'yyyy-MM-dd') : '');
                  }}
                  minDate={new Date()}
                  placeholder={t('اختر تاريخ السفر', 'Select travel date', 'ڕێکەوتی گەشت هەڵبژێرە')}
                />
                {errors.travelDate && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.travelDate}</p>}
              </div>

              <div className="space-y-2">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {formData.travelType === 'air'
                    ? t('المطار', 'Airport', 'فڕۆکەخانە')
                    : t('المنفذ الحدودي', 'Border Crossing', 'مەرز')} *
                </Label>
                <Select
                  value={formData.pickupLocation}
                  onValueChange={handlePickupSelect}
                  disabled={!formData.travelType || locationsLoading}
                >
                  <SelectTrigger className={`h-12 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`} data-testid="pickup-location-select">
                    {locationsLoading ? (
                      <span className="flex items-center gap-2 text-slate-400">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {t('جاري التحميل...', 'Loading...', 'بارکردن...')}
                      </span>
                    ) : (
                      <SelectValue placeholder={
                        !formData.travelType
                          ? t('اختر نوع السفر أولاً', 'Select travel type first', 'جۆری گەشت هەڵبژێرە')
                          : formData.travelType === 'air'
                            ? t('اختر المطار', 'Select airport', 'فڕۆکەخانە هەڵبژێرە')
                            : t('اختر المنفذ الحدودي', 'Select border crossing', 'مەرز هەڵبژێرە')
                      } />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocations.length === 0 && !locationsLoading ? (
                      <SelectItem value="_empty" disabled>
                        {t('لا توجد خيارات متاحة', 'No options available', 'هیچ هەڵبژاردنێک بەردەست نییە')}
                      </SelectItem>
                    ) : (
                      pickupLocations.map(loc => (
                        <SelectItem key={loc.stamp_id} value={loc.stamp_id}>
                          {isKurdish ? (loc.name_ku || loc.name_ar) : isArabic ? loc.name_ar : (loc.name_en || loc.name_ar)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.pickupLocation && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.pickupLocation}</p>}
              </div>
            </div>
          </div>

          {/* Booking Amount */}
          <div className={`rounded-3xl border-2 shadow-xl p-8 mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('بيانات الحجز', 'Booking Details', 'زانیاری داواکاری')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 md:col-span-2">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('المبلغ بالدولار (USD)', 'Amount in USD', 'بڕ بە دۆلار')} *
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {[3000, 5000].map((amount) => (
                    <motion.button
                      key={amount}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('usdAmount', String(amount))}
                      data-testid={`usd-amount-${amount}`}
                      className={`p-5 rounded-2xl border-2 text-center transition-all ${formData.usdAmount === String(amount)
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : isDark
                          ? 'border-slate-600 hover:border-[#D4AF37]'
                          : 'border-slate-200 hover:border-[#D4AF37]'
                        }`}
                    >
                      <p dir="ltr" className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        ${amount.toLocaleString()}
                      </p>
                      <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t('دولار أمريكي', 'US Dollar', 'دۆلاری ئەمریکی')}
                      </p>
                    </motion.button>
                  ))}
                </div>
                {errors.usdAmount && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.usdAmount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iqdAmount" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('المقابل بالدينار العراقي (IQD)', 'Equivalent in IQD', 'بڕ بە دینار')}
                </Label>
                <Input
                  id="iqdAmount"
                  type="text"
                  dir="ltr"
                  value={formData.iqdAmount ? Number(formData.iqdAmount).toLocaleString() : '0'}
                  readOnly
                  className={`h-12 font-bold ${isDark ? 'bg-slate-600 border-slate-500 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-700'}`}
                  placeholder="0"
                  data-testid="iqd-amount-display"
                />
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {t('يتم الحساب تلقائياً', 'Calculated automatically', 'بە شێوەیەکی خۆکارانە هەژمار دەکرێت')}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {t('طريقة الدفع', 'Payment Method', 'شێوازی پارەدان')} *
                </Label>
                <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 border ${
                  isDark 
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                    : 'bg-orange-50 border-orange-200 text-orange-700'
                }`}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm md:text-base font-bold">
                    {t('حدد كيف تدفع لنا', 'Select how you pay us', 'چۆنێتی پارەدانەکەمان بۆ دیاری بکە')}
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {paymentMethods.map(method => (
                      <motion.button
                        key={method.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        onMouseEnter={() => setHoveredMethod(method.value)}
                        onMouseLeave={() => setHoveredMethod(null)}
                        onClick={() => handleInputChange('paymentMethod', method.value)}
                        className={`p-4 rounded-xl border-2 text-center transition-colors ${formData.paymentMethod === method.value
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : hoveredMethod === method.value
                            ? 'border-[#D4AF37]'
                            : isDark ? 'border-slate-600' : 'border-slate-200'
                          }`}
                      >
                        <span className={`font-bold block text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {t(method.labelAr, method.labelEn, method.labelKu)}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                {errors.paymentMethod && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.paymentMethod}</p>}
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className={`rounded-3xl border-2 shadow-xl p-8 mb-8 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                <Upload className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('رفع الوثائق', 'Upload Documents', 'بارکردنی بەڵگەنامەکان')}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Passport */}
              <FileUploadField
                id="passport"
                label={t('صورة جواز السفر', 'Passport Image', 'وێنەی پاسپۆرت')}
                required={true}
                file={uploadedFiles.passport}
                error={errors.passport}
                onUpload={(e) => handleFileUpload('passport', e)}
                onRemove={() => removeFile('passport')}
                t={t}
                isDark={isDark}
              />

              {/* Ticket */}
              <FileUploadField
                id="ticket"
                label={t('صورة تذكرة السفر', 'Flight Ticket Image', 'وێنەی پلیت')}
                required={true}
                file={uploadedFiles.ticket}
                error={errors.ticket}
                onUpload={(e) => handleFileUpload('ticket', e)}
                onRemove={() => removeFile('ticket')}
                t={t}
                isDark={isDark}
              />

              {/* Personal Photo */}
              <FileUploadField
                id="photo"
                label={t('صورة شخصية', 'Personal Photo', 'وێنەی کەسی')}
                required={false}
                file={uploadedFiles.photo}
                error={errors.photo}
                onUpload={(e) => handleFileUpload('photo', e)}
                onRemove={() => removeFile('photo')}
                t={t}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            data-testid="submit-booking-button"
            className={`w-full py-5 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${isDark
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#FCD34D] text-slate-900'
              : 'bg-slate-900 text-white'
              }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {t('جارٍ التسجيل...', 'Submitting...', 'تۆمارکردن...')}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {t('تسجيل الطلب', 'Submit Booking', 'تۆمارکردنی داواکاری')}
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

// File Upload Component
const FileUploadField = ({ id, label, required, file, error, onUpload, onRemove, t, isDark }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className={isDark ? 'text-slate-300' : 'text-slate-700'}>
      {label} {required && '*'}
    </Label>

    {!file ? (
      <label
        htmlFor={id}
        className={`block border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer group ${isDark
          ? 'border-slate-600 hover:border-[#D4AF37] hover:bg-slate-700/50'
          : 'border-slate-300 hover:border-[#D4AF37] hover:bg-slate-50'
          }`}
        data-testid={`${id}-upload-area`}
      >
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
        <div className="text-center">
          <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors group-hover:text-[#D4AF37] ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('اضغط لرفع الملف', 'Click to upload file', 'بۆ بارکردن لێرە بدە')}
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {t('PNG, JPG أو JPEG (الحد الأقصى 5 ميجابايت)', 'PNG, JPG or JPEG (max 5MB)', 'PNG, JPG یان JPEG (زۆرترین ٥ مێگابایت)')}
          </p>
        </div>
      </label>
    ) : (
      <div className={`border-2 rounded-2xl p-4 flex items-center justify-between ${isDark
        ? 'border-green-500/30 bg-green-500/20'
        : 'border-green-200 bg-green-50'
        }`}>
        <div className="flex items-center gap-3">
          <div className={`w-16 h-16 rounded-lg overflow-hidden border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
            <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
            <p className={`text-xs flex items-center gap-1 mt-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <CheckCircle className="w-3 h-3" />
              {t('تم الرفع بنجاح', 'Uploaded successfully', 'بە سەرکەوتوویی بارکرا')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-100'}`}
        >
          <X className="w-5 h-5 text-red-600" />
        </button>
      </div>
    )}

    {error && (
      <p className="text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

export default BookingForm;
