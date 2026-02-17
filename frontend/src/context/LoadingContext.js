import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OverlayLoader } from '@/components/ui/Loader';
import { useTheme } from './ThemeContext';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const { isDark } = useTheme();

  const showLoading = useCallback((message = 'جارٍ المعالجة...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  // For navigation loading
  const withLoading = useCallback(async (asyncFn, message = 'جارٍ التحميل...') => {
    showLoading(message);
    try {
      await asyncFn();
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, withLoading }}>
      {children}
      <AnimatePresence>
        {isLoading && <OverlayLoader message={loadingMessage} isDark={isDark} />}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
