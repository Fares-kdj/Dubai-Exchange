import React, { useState } from 'react';
import TermsAndConditions from './TermsAndConditions';
import BookingForm from './BookingForm';
import Header from '../home/Header';
import Footer from '../home/Footer';

const TravelerBooking = () => {
  const [step, setStep] = useState(1); // 1: Terms, 2: Form, 3: Success
  const [bookingData, setBookingData] = useState(null);

  const handleTermsAccept = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (data) => {
    setBookingData(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {step === 1 && <TermsAndConditions onAccept={handleTermsAccept} />}
      {step === 2 && <BookingForm onSubmit={handleFormSubmit} />}
      {step === 3 && (
        <div className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center p-12">
            <h1 className="text-4xl font-bold text-green-600 mb-4">✅ تم التسجيل بنجاح!</h1>
            <p className="text-slate-600 mb-4">سيتم إنشاء صفحة التأكيد الكاملة في الخطوة التالية</p>
            <p className="text-sm text-slate-500">Order ID: TRV-{Date.now()}</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default TravelerBooking;
