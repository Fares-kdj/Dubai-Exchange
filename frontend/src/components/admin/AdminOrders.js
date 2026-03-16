import React from 'react';
import { BaseOrdersPage } from './orders/BaseOrdersPage';

const AdminOrders = () => {
  return (
    <BaseOrdersPage
      title="إدارة جميع الطلبات"
      orderType="all"
    />
  );
};

export default AdminOrders;

