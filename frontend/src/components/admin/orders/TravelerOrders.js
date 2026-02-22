import React from 'react';
import { Plane } from 'lucide-react';
import { BaseOrdersPage } from './BaseOrdersPage';

const TravelerOrders = () => {
  return (
    <BaseOrdersPage
      title="طلبات حجز المسافرين"
      orderType="traveler"
    />
  );
};

export default TravelerOrders;
