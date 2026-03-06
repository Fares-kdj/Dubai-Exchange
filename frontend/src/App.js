import React, { useState, useEffect } from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { BrandingProvider } from '@/context/BrandingContext';
import SplashScreen from '@/components/ui/SplashScreen';
// New 3D Landing Page
import LandingPage3D from '@/components/landing/LandingPage3D';
import TravelerBooking from '@/components/booking/TravelerBooking';
// Pages
import TermsPage from '@/components/pages/TermsPage';
import PrivacyPolicy from '@/components/pages/PrivacyPolicy';
import TermsOfUse from '@/components/pages/TermsOfUse';
import LegalNotice from '@/components/pages/LegalNotice';
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
import AdminBlocklist from '@/components/admin/AdminBlocklist';
import AdminAirports from '@/components/admin/AdminAirports';
// Admin Order Pages
import { TravelerOrders, LocalOrders, InternationalOrders, UsdtOrders, CardOrders } from '@/components/admin/orders';
import { LoadingProvider } from '@/context/LoadingContext';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ui/ScrollToTop';
import '@/i18n';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Mark app as ready after initial load
    setAppReady(true);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider>
      <BrandingProvider>
        <LanguageProvider>
          <LoadingProvider>
            {showSplash && (
              <SplashScreen
                onComplete={handleSplashComplete}
                minDuration={1200}
              />
            )}
            <div className="App" style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.3s ease' }}>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<LandingPage3D />} />
                  <Route path="/traveler-booking" element={<TravelerBooking />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/legal-notice" element={<LegalNotice />} />
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
                    {/* Separated Order Pages */}
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="orders/traveler" element={<TravelerOrders />} />
                    <Route path="orders/local" element={<LocalOrders />} />
                    <Route path="orders/international" element={<InternationalOrders />} />
                    <Route path="orders/usdt" element={<UsdtOrders />} />
                    <Route path="orders/card" element={<CardOrders />} />
                    {/* Blocklist */}
                    <Route path="blocklist" element={<AdminBlocklist />} />
                    {/* Airports & Stamps */}
                    <Route path="airports" element={<AdminAirports />} />
                    {/* Other Admin Pages */}
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
            <Toaster position="top-center" expand={true} richColors />
          </LoadingProvider>
        </LanguageProvider>
      </BrandingProvider>
    </ThemeProvider>
  );
}

export default App;
