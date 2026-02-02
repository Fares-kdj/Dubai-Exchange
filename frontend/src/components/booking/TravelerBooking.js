import React, { useState } from 'react';
import TermsAndConditions from './TermsAndConditions';
import BookingForm from './BookingForm';
import SuccessPage from './SuccessPage';
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
      {step === 3 && <SuccessPage orderData={bookingData} />}
      <Footer />
    </div>
  );
};

export default TravelerBooking;
