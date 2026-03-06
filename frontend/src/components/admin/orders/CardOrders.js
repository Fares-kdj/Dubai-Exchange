import React from 'react';
import { CreditCard } from 'lucide-react';
import { BaseOrdersPage } from './BaseOrdersPage';

const CardOrders = () => {
  return (
    <BaseOrdersPage
      title="طلبات شحن البطاقات"
      orderType="card_recharge"
    />
  );
};

export default CardOrders;
