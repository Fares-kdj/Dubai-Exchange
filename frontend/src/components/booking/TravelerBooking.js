import React, { useState } from 'react';
import TermsAndConditions from './TermsAndConditions';
import BookingForm from './BookingForm';
import SuccessPage from './SuccessPage';
import Header3D from '../landing/Header3D';
import Footer3D from '../landing/Footer3D';
import { useTheme } from '@/context/ThemeContext';

const TravelerBooking = () => {
  const [step, setStep] = useState(1); // 1: Terms, 2: Form, 3: Success
  const [bookingData, setBookingData] = useState(null);
  const { isDark } = useTheme();

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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
    }`}>
      <Header3D />
      <main className="pt-20">
        {step === 1 && <TermsAndConditions onAccept={handleTermsAccept} />}
        {step === 2 && <BookingForm onSubmit={handleFormSubmit} />}
        {step === 3 && <SuccessPage orderData={bookingData} />}
      </main>
      <Footer3D />
    </div>
  );
};

export default TravelerBooking;
