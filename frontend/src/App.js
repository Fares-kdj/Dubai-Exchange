import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from '@/context/LanguageContext';
import HomePage from '@/components/home/HomePage';
import TravelerBooking from '@/components/booking/TravelerBooking';
import '@/i18n';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/traveler-booking" element={<TravelerBooking />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
