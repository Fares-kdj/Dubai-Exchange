import React from 'react';
import { Wallet } from 'lucide-react';
import { BaseOrdersPage } from './BaseOrdersPage';

const UsdtOrders = () => {
  return (
    <BaseOrdersPage
      title="طلبات تعبئة USDT"
      orderType="usdt_recharge"
    />
  );
};

export default UsdtOrders;
