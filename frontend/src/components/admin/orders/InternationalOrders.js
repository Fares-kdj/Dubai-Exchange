import React, { useState } from 'react';
import { Globe, DollarSign } from 'lucide-react';
import { BaseOrdersPage } from './BaseOrdersPage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const InternationalOrders = () => {
  const [subType, setSubType] = useState('all');

  const subTypeOptions = [
    { value: 'all', label: 'جميع التحويلات الدولية' },
    { value: 'western_union', label: 'ويسترن يونيون' },
    { value: 'moneygram', label: 'موني جرام' },
    { value: 'country_based', label: 'حسب الدولة' },
  ];

  // Determine order type based on subType
  const getOrderType = () => {
    if (subType === 'all') return 'international'; // Will need backend to support this
    return subType;
  };

  const extraFilters = (
    <div className="mt-4">
      <Select value={subType} onValueChange={setSubType}>
        <SelectTrigger className="w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {subTypeOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <BaseOrdersPage
      title="طلبات التحويل الدولي"
      orderType={subType === 'all' ? null : subType}
      extraFilters={extraFilters}
      key={subType} // Reset component when subType changes
    />
  );
};

export default InternationalOrders;
