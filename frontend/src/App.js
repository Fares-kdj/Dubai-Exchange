import React, { useState, useEffect, Suspense, lazy } from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { BrandingProvider } from '@/context/BrandingContext';
import SplashScreen from '@/components/ui/SplashScreen';

// Landing Page (Stay static for SEO and instant load)
import LandingPage3D from '@/components/landing/LandingPage3D';

// Lazy Loaded Components
const TravelerBooking = lazy(() => import('@/components/booking/TravelerBooking'));
const TermsPage = lazy(() => import('@/components/pages/TermsPage'));
const PrivacyPolicy = lazy(() => import('@/components/pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('@/components/pages/TermsOfUse'));
const LegalNotice = lazy(() => import('@/components/pages/LegalNotice'));

// Transfers
const TransfersHub = lazy(() => import('@/components/transfers/TransfersHub'));
const LocalTransfer = lazy(() => import('@/components/transfers/LocalTransfer'));
const InternationalSelector = lazy(() => import('@/components/transfers/InternationalSelector'));
const WesternUnion = lazy(() => import('@/components/transfers/WesternUnion'));
const MoneyGram = lazy(() => import('@/components/transfers/MoneyGram'));
const CountryWizard = lazy(() => import('@/components/transfers/CountryWizard'));
const TransferSuccess = lazy(() => import('@/components/transfers/TransferSuccess'));

// Services
const CardRecharge = lazy(() => import('@/components/services/CardRecharge'));
const USDTRecharge = lazy(() => import('@/components/services/USDTRecharge'));
const ServiceSuccess = lazy(() => import('@/components/services/ServiceSuccess'));

// Tracking
const TrackOrder = lazy(() => import('@/components/tracking/TrackOrder'));

// Admin
const AdminLogin = lazy(() => import('@/components/admin/AdminLogin'));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const AdminOverview = lazy(() => import('@/components/admin/AdminOverview'));
const AdminOrders = lazy(() => import('@/components/admin/AdminOrders'));
const AdminServices = lazy(() => import('@/components/admin/AdminServices'));
const AdminCountries = lazy(() => import('@/components/admin/AdminCountries'));
const AdminUsers = lazy(() => import('@/components/admin/AdminUsers'));
const AdminRates = lazy(() => import('@/components/admin/AdminRates'));
const AdminCMS = lazy(() => import('@/components/admin/AdminCMS'));
const AdminBranding = lazy(() => import('@/components/admin/AdminBranding'));
const AdminBlocklist = lazy(() => import('@/components/admin/AdminBlocklist'));
const AdminAirports = lazy(() => import('@/components/admin/AdminAirports'));

// Admin Order Pages
const AdminOrderPages = lazy(() => import('@/components/admin/orders').then(module => ({
  default: (props) => {
    // This is a bit tricky since it's a multi-export, usually better to refactor 
    // but for now we'll import them individually if needed or load the whole module
    return module;
  }
})));

// Individual lazy loads for admin orders to be safe
const TravelerOrders = lazy(() => import('@/components/admin/orders').then(m => ({ default: m.TravelerOrders })));
const LocalOrders = lazy(() => import('@/components/admin/orders').then(m => ({ default: m.LocalOrders })));
const InternationalOrders = lazy(() => import('@/components/admin/orders').then(m => ({ default: m.InternationalOrders })));
const UsdtOrders = lazy(() => import('@/components/admin/orders').then(m => ({ default: m.UsdtOrders })));
const CardOrders = lazy(() => import('@/components/admin/orders').then(m => ({ default: m.CardOrders })));

import { LoadingProvider } from '@/context/LoadingContext';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ui/ScrollToTop';
import '@/i18n';

// Simple fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
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
            <div className="App">
              {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
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
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="orders/traveler" element={<TravelerOrders />} />
                      <Route path="orders/local" element={<LocalOrders />} />
                      <Route path="orders/international" element={<InternationalOrders />} />
                      <Route path="orders/usdt" element={<UsdtOrders />} />
                      <Route path="orders/card" element={<CardOrders />} />
                      <Route path="blocklist" element={<AdminBlocklist />} />
                      <Route path="airports" element={<AdminAirports />} />
                      <Route path="services" element={<AdminServices />} />
                      <Route path="countries" element={<AdminCountries />} />
                      <Route path="rates" element={<AdminRates />} />
                      <Route path="cms" element={<AdminCMS />} />
                      <Route path="branding" element={<AdminBranding />} />
                      <Route path="users" element={<AdminUsers />} />
                    </Route>
                  </Routes>
                </Suspense>
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
