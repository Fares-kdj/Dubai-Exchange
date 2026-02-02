import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { User, Phone, Plane, MapPin, Calendar, DollarSign, CreditCard, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BookingForm = ({ onSubmit }) => {
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    travelType: '',
    destination: '',
    travelDate: '',
    pickupLocation: '',
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
    { value: 'air', labelAr: 'جوي', labelEn: 'Air' },
    { value: 'land', labelAr: 'بري', labelEn: 'Land' }
  ];

  const airports = [
    { value: 'baghdad', labelAr: 'مطار بغداد الدولي', labelEn: 'Baghdad International Airport' },
    { value: 'erbil', labelAr: 'مطار أربيل الدولي', labelEn: 'Erbil International Airport' },
    { value: 'basra', labelAr: 'مطار البصرة الدولي', labelEn: 'Basra International Airport' },
    { value: 'najaf', labelAr: 'مطار النجف الدولي', labelEn: 'Najaf International Airport' },
    { value: 'sulaymaniyah', labelAr: 'مطار السليمانية الدولي', labelEn: 'Sulaymaniyah International Airport' }
  ];

  const borders = [
    { value: 'ibrahim_khalil', labelAr: 'منفذ إبراهيم الخليل', labelEn: 'Ibrahim Khalil Border' },
    { value: 'trebil', labelAr: 'منفذ طريبيل', labelEn: 'Trebil Border' },
    { value: 'safwan', labelAr: 'منفذ سفوان', labelEn: 'Safwan Border' },
    { value: 'shalamcheh', labelAr: 'منفذ شلامجة', labelEn: 'Shalamcheh Border' }
  ];

  const paymentMethods = [
    { value: 'cash', labelAr: 'نقداً', labelEn: 'Cash' },
    { value: 'bank_transfer', labelAr: 'تحويل بنكي', labelEn: 'Bank Transfer' },
    { value: 'card', labelAr: 'بطاقة', labelEn: 'Card' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate IQD when USD changes
    if (field === 'usdAmount' && value) {
      const rate = 1500; // This should come from API
      setFormData(prev => ({ ...prev, iqdAmount: (parseFloat(value) * rate).toFixed(0) }));
    }
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [type]: currentLanguage === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 5 ميجابايت)' : 'File size too large (max 5MB)' }));
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

    if (!formData.fullName.trim()) newErrors.fullName = currentLanguage === 'ar' ? 'الاسم مطلوب' : 'Name required';
    if (!formData.phone.trim()) newErrors.phone = currentLanguage === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone required';
    if (!formData.travelType) newErrors.travelType = currentLanguage === 'ar' ? 'نوع السفر مطلوب' : 'Travel type required';
    if (!formData.destination.trim()) newErrors.destination = currentLanguage === 'ar' ? 'وجهة السفر مطلوبة' : 'Destination required';
    if (!formData.travelDate) newErrors.travelDate = currentLanguage === 'ar' ? 'تاريخ السفر مطلوب' : 'Travel date required';
    if (!formData.pickupLocation) newErrors.pickupLocation = currentLanguage === 'ar' ? 'مكان الاستلام مطلوب' : 'Pickup location required';
    if (!formData.usdAmount || parseFloat(formData.usdAmount) <= 0) newErrors.usdAmount = currentLanguage === 'ar' ? 'المبلغ مطلوب' : 'Amount required';
    if (!formData.paymentMethod) newErrors.paymentMethod = currentLanguage === 'ar' ? 'طريقة الدفع مطلوبة' : 'Payment method required';
    if (!uploadedFiles.passport) newErrors.passport = currentLanguage === 'ar' ? 'صورة الجواز مطلوبة' : 'Passport image required';
    if (!uploadedFiles.ticket) newErrors.ticket = currentLanguage === 'ar' ? 'صورة التذكرة مطلوبة' : 'Ticket image required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit(formData);
  };

  const pickupLocations = formData.travelType === 'air' ? airports : borders;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
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
              <span className="text-sm font-medium text-slate-500">
                {currentLanguage === 'ar' ? 'الشروط' : 'Terms'}
              </span>
            </div>
            <div className="w-16 h-1 bg-green-500 rounded"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <span className="text-sm font-medium text-slate-900">
                {currentLanguage === 'ar' ? 'معلومات الحجز' : 'Booking Details'}
              </span>
            </div>
            <div className="w-16 h-1 bg-slate-200 rounded"></div>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-sm font-medium text-slate-500">
                {currentLanguage === 'ar' ? 'التأكيد' : 'Confirmation'}
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
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentLanguage === 'ar' ? 'بيانات العميل' : 'Customer Information'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="h-12 border-slate-300 focus:border-[#D4AF37]"
                  placeholder={currentLanguage === 'ar' ? 'أدخل الاسم الكامل' : 'Enter full name'}
                  data-testid="full-name-input"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-12 border-slate-300 focus:border-[#D4AF37]"
                  placeholder="+964 7XX XXX XXXX"
                  data-testid="phone-input"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Information */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentLanguage === 'ar' ? 'بيانات السفر' : 'Travel Information'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'نوع السفر' : 'Travel Type'} *
                </Label>
                <Select value={formData.travelType} onValueChange={(value) => handleInputChange('travelType', value)}>
                  <SelectTrigger className="h-12 border-slate-300" data-testid="travel-type-select">
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر نوع السفر' : 'Select travel type'} />
                  </SelectTrigger>
                  <SelectContent>
                    {travelTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {currentLanguage === 'ar' ? type.labelAr : type.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.travelType && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.travelType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'وجهة السفر' : 'Destination'} *
                </Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="h-12 border-slate-300 focus:border-[#D4AF37]"
                  placeholder={currentLanguage === 'ar' ? 'مثال: دبي، تركيا، مصر' : 'e.g., Dubai, Turkey, Egypt'}
                  data-testid="destination-input"
                />
                {errors.destination && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.destination}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelDate" className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'تاريخ السفر' : 'Travel Date'} *
                </Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => handleInputChange('travelDate', e.target.value)}
                  className="h-12 border-slate-300 focus:border-[#D4AF37]"
                  min={new Date().toISOString().split('T')[0]}
                  data-testid="travel-date-input"
                />
                {errors.travelDate && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.travelDate}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'مكان الاستلام' : 'Pickup Location'} *
                </Label>
                <Select 
                  value={formData.pickupLocation} 
                  onValueChange={(value) => handleInputChange('pickupLocation', value)}
                  disabled={!formData.travelType}
                >
                  <SelectTrigger className="h-12 border-slate-300" data-testid="pickup-location-select">
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر مكان الاستلام' : 'Select pickup location'} />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocations.map(location => (
                      <SelectItem key={location.value} value={location.value}>
                        {currentLanguage === 'ar' ? location.labelAr : location.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.pickupLocation && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.pickupLocation}</p>}
              </div>
            </div>
          </div>

          {/* Booking Amount */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentLanguage === 'ar' ? 'بيانات الحجز' : 'Booking Details'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="usdAmount" className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'المبلغ بالدولار (USD)' : 'Amount in USD'} *
                </Label>
                <Input
                  id="usdAmount"
                  type="number"
                  value={formData.usdAmount}
                  onChange={(e) => handleInputChange('usdAmount', e.target.value)}
                  className="h-12 border-slate-300 focus:border-[#D4AF37]"
                  placeholder="1000"
                  min="1"
                  data-testid="usd-amount-input"
                />
                {errors.usdAmount && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.usdAmount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="iqdAmount" className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'المقابل بالدينار العراقي (IQD)' : 'Equivalent in IQD'}
                </Label>
                <Input
                  id="iqdAmount"
                  type="text"
                  value={formData.iqdAmount}
                  readOnly
                  className="h-12 border-slate-300 bg-slate-50 text-slate-700 font-bold"
                  placeholder="0"
                  data-testid="iqd-amount-display"
                />
                <p className="text-xs text-slate-500">
                  {currentLanguage === 'ar' ? 'يتم الحساب تلقائياً' : 'Calculated automatically'}
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-700 font-medium">
                  {currentLanguage === 'ar' ? 'طريقة الدفع' : 'Payment Method'} *
                </Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger className="h-12 border-slate-300" data-testid="payment-method-select">
                    <SelectValue placeholder={currentLanguage === 'ar' ? 'اختر طريقة الدفع' : 'Select payment method'} />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {currentLanguage === 'ar' ? method.labelAr : method.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.paymentMethod}</p>}
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentLanguage === 'ar' ? 'رفع الوثائق' : 'Upload Documents'}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Passport */}
              <FileUploadField
                id="passport"
                label={currentLanguage === 'ar' ? 'صورة جواز السفر' : 'Passport Image'}
                required={true}
                file={uploadedFiles.passport}
                error={errors.passport}
                onUpload={(e) => handleFileUpload('passport', e)}
                onRemove={() => removeFile('passport')}
                currentLanguage={currentLanguage}
              />

              {/* Ticket */}
              <FileUploadField
                id="ticket"
                label={currentLanguage === 'ar' ? 'صورة تذكرة السفر' : 'Flight Ticket Image'}
                required={true}
                file={uploadedFiles.ticket}
                error={errors.ticket}
                onUpload={(e) => handleFileUpload('ticket', e)}
                onRemove={() => removeFile('ticket')}
                currentLanguage={currentLanguage}
              />

              {/* Personal Photo */}
              <FileUploadField
                id="photo"
                label={currentLanguage === 'ar' ? 'صورة شخصية' : 'Personal Photo'}
                required={false}
                file={uploadedFiles.photo}
                error={errors.photo}
                onUpload={(e) => handleFileUpload('photo', e)}
                onRemove={() => removeFile('photo')}
                currentLanguage={currentLanguage}
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
            className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {currentLanguage === 'ar' ? 'جارٍ التسجيل...' : 'Submitting...'}
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                {currentLanguage === 'ar' ? 'تسجيل الطلب' : 'Submit Booking'}
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

// File Upload Component
const FileUploadField = ({ id, label, required, file, error, onUpload, onRemove, currentLanguage }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-slate-700 font-medium">
      {label} {required && '*'}
    </Label>
    
    {!file ? (
      <label 
        htmlFor={id}
        className="block border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-[#D4AF37] hover:bg-slate-50 transition-all cursor-pointer group"
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
          <Upload className="w-12 h-12 text-slate-400 group-hover:text-[#D4AF37] mx-auto mb-3 transition-colors" />
          <p className="text-sm text-slate-600 mb-1">
            {currentLanguage === 'ar' ? 'اضغط لرفع الملف' : 'Click to upload file'}
          </p>
          <p className="text-xs text-slate-400">
            {currentLanguage === 'ar' ? 'PNG, JPG أو JPEG (الحد الأقصى 5 ميجابايت)' : 'PNG, JPG or JPEG (max 5MB)'}
          </p>
        </div>
      </label>
    ) : (
      <div className="border-2 border-green-200 bg-green-50 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-200">
            <img src={file.preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{file.name}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <CheckCircle className="w-3 h-3" />
              {currentLanguage === 'ar' ? 'تم الرفع بنجاح' : 'Uploaded successfully'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
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
