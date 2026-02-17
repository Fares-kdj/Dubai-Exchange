import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
// New 3D Landing Page
import LandingPage3D from '@/components/landing/LandingPage3D';
import TravelerBooking from '@/components/booking/TravelerBooking';
// Pages
import TermsPage from '@/components/pages/TermsPage';
// Transfers
import TransfersHub from '@/components/transfers/TransfersHub';
import LocalTransfer from '@/components/transfers/LocalTransfer';
import InternationalSelector from '@/components/transfers/InternationalSelector';
import WesternUnion from '@/components/transfers/WesternUnion';
import MoneyGram from '@/components/transfers/MoneyGram';
import CountryWizard from '@/components/transfers/CountryWizard';
import TransferSuccess from '@/components/transfers/TransferSuccess';
// Services
import CardRecharge from '@/components/services/CardRecharge';
import USDTRecharge from '@/components/services/USDTRecharge';
import ServiceSuccess from '@/components/services/ServiceSuccess';
// Tracking
import TrackOrder from '@/components/tracking/TrackOrder';
// Admin
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminServices from '@/components/admin/AdminServices';
import AdminCountries from '@/components/admin/AdminCountries';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminRates from '@/components/admin/AdminRates';
import AdminCMS from '@/components/admin/AdminCMS';
import AdminBranding from '@/components/admin/AdminBranding';
import { LoadingProvider } from '@/context/LoadingContext';
import '@/i18n';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LoadingProvider>
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage3D />} />
                <Route path="/traveler-booking" element={<TravelerBooking />} />
                <Route path="/terms" element={<TermsPage />} />
                {/* Transfers Routes */}
                <Route path="/transfers" element={<TransfersHub />} />
                <Route path="/transfers/local" element={<LocalTransfer />} />
                <Route path="/transfers/international" element={<InternationalSelector />} />
                <Route path="/transfers/western-union" element={<WesternUnion />} />
                <Route path="/transfers/moneygram" element={<MoneyGram />} />
                <Route path="/transfers/country-wizard" element={<CountryWizard />} />
                <Route path="/transfers/success" element={<TransferSuccess />} />
              {/* Services Routes */}
              <Route path="/services/card-recharge" element={<CardRecharge />} />
              <Route path="/services/card-recharge/success" element={<ServiceSuccess />} />
              <Route path="/services/usdt" element={<USDTRecharge />} />
              <Route path="/services/usdt/success" element={<ServiceSuccess />} />
              {/* Tracking */}
              <Route path="/track-order" element={<TrackOrder />} />
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="countries" element={<AdminCountries />} />
                <Route path="rates" element={<AdminRates />} />
                <Route path="cms" element={<AdminCMS />} />
                <Route path="branding" element={<AdminBranding />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
        </LoadingProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
