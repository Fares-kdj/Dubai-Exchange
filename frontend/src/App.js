import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from '@/context/LanguageContext';
import HomePage from '@/components/home/HomePage';
import TravelerBooking from '@/components/booking/TravelerBooking';
// Transfers
import TransfersHub from '@/components/transfers/TransfersHub';
import LocalTransfer from '@/components/transfers/LocalTransfer';
import InternationalSelector from '@/components/transfers/InternationalSelector';
import WesternUnion from '@/components/transfers/WesternUnion';
import MoneyGram from '@/components/transfers/MoneyGram';
import CountryWizard from '@/components/transfers/CountryWizard';
import TransferSuccess from '@/components/transfers/TransferSuccess';
import '@/i18n';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/traveler-booking" element={<TravelerBooking />} />
            {/* Transfers Routes */}
            <Route path="/transfers" element={<TransfersHub />} />
            <Route path="/transfers/local" element={<LocalTransfer />} />
            <Route path="/transfers/international" element={<InternationalSelector />} />
            <Route path="/transfers/western-union" element={<WesternUnion />} />
            <Route path="/transfers/moneygram" element={<MoneyGram />} />
            <Route path="/transfers/country-wizard" element={<CountryWizard />} />
            <Route path="/transfers/success" element={<TransferSuccess />} />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;
