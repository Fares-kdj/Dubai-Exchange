import React from 'react';
import { MapPin } from 'lucide-react';
import { BaseOrdersPage } from './BaseOrdersPage';

const LocalOrders = () => {
  return (
    <BaseOrdersPage
      title="طلبات التحويل المحلي"
      orderType="local"
    />
  );
};

export default LocalOrders;
