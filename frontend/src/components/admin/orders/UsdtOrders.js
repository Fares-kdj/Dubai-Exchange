import React from 'react';
import { Wallet } from 'lucide-react';
import { BaseOrdersPage } from './BaseOrdersPage';

const UsdtOrders = () => {
  return (
    <BaseOrdersPage
      title="طلبات تعبئة USDT"
      orderType="usdt"
    />
  );
};

export default UsdtOrders;
