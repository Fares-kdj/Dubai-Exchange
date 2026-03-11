/**
 * Configuration for all receipt types.
 * Coordinates are in percentages (0-100) relative to the template.
 * x: distance from the left
 * y: distance from the top
 */

import { amountToWords } from '../../../utils/numberToWords';

const getStatusTranslation = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed':
        case 'processed':
            return { text: 'تم التنفيذ', color: '#10b981' };
        case 'accepted':
        case 'approved':
            return { text: 'مقبول', color: '#10b981' };
        case 'pending':
        case 'waiting':
        case 'pending_review':
            return { text: 'قيد المراجعة', color: '#f59e0b' };
        case 'waiting_payment':
            return { text: 'في انتظار الدفع', color: '#f59e0b' };
        case 'rejected':
        case 'cancelled':
            return { text: 'مرفوض', color: '#ef4444' };
        case 'ignored':
            return { text: 'تم التجاهل', color: '#64748b' };
        case 'blocked':
            return { text: 'محظور', color: '#ef4444' };
        default:
            return { text: status || 'غير معروف', color: '#64748b' };
    }
};

const getProvinceTranslation = (province) => {
    const provinces = {
        'baghdad': 'بغداد',
        'basra': 'البصرة',
        'erbil': 'أربيل',
        'sulaymaniyah': 'السليمانية',
        'duhok': 'دهوك',
        'nineveh': 'نينوى',
        'kirkuk': 'كركوك',
        'diyala': 'ديالى',
        'anbar': 'الأنبار',
        'najaf': 'النجف',
        'karbala': 'كربلاء',
        'babylon': 'بابل',
        'wasit': 'واسط',
        'maysan': 'ميسان',
        'dhiqar': 'ذي قار',
        'muthanna': 'المثنى',
        'qadisiyyah': 'القادسية',
        'saladin': 'صلاح الدين'
    };
    return provinces[province?.toLowerCase()] || province;
};

const getCountryTranslation = (country) => {
    const countries = {
        'iraq': 'العراق',
        'france': 'فرنسا',
        'uae': 'الإمارات',
        'saudi': 'السعودية',
        'jordan': 'الأردن',
        'egypt': 'مصر',
        'turkey': 'تركيا',
        'usa': 'الولايات المتحدة',
        'uk': 'بريطانيا',
        'germany': 'ألمانيا',
        'france': 'فرنسا',
        'canada': 'كندا',
        'australia': 'أستراليا',
        'india': 'الهند',
        'pakistan': 'باكستان'
    };
    return countries[country?.toLowerCase()] || country;
};

const getPurpose = (details) => {
    const isChina = details?.countryCode === 'CN' || details?.countryCode === 'cn' ||
        details?.countryName === 'الصين' || details?.countryName === 'China';

    if (isChina) return 'تجارة';

    if (details?.purpose) {
        if (details.purpose === 'trade') return 'تجارة';
        if (details.purpose === 'family_expenses') return 'نفقات الأسرة';
        if (details.purpose === 'medical') return 'علاج';
        return details.purpose;
    }

    // Fallback for old orders
    const isBank = details?.methodId === 'bank' || details?.methodName === 'تحويل بنكي' ||
        details?.methodName?.toLowerCase().includes('bank');

    if (isBank) return 'تجارة';
    return 'نفقات الاسرة';
};

export const RECEIPT_CONFIGS = {
    traveler: {
        template: '/assets/receipts/traveler_recu.jpg',
        fields: (order, admin_data, customer, details, formatDate) => [
            { id: 'outlet_title', value: details?.pickupLocationName || admin_data?.travel_agency || 'وكيل المطار', x: 50.6, y: 39.4, bold: true, width: '40%', center: true, color: '#fff', size: 'text-[18px]', height: '30px' },
            { id: 'batch_number', value: admin_data?.batch_number, x: 82.6, y: 34.8, bold: true, width: '4%' },
            { id: 'batch_date', value: admin_data?.batch_date, x: 63, y: 34.8, bold: true, width: '10%' },
            { id: 'order_number', value: order.order_id, x: 46.1, y: 34.8, bold: true, width: '11%' },
            { id: 'order_date', value: formatDate(order.created_at), x: 20.5, y: 34.8, bold: true, width: '10%' },
            { id: 'full_name', value: customer?.full_name, x: 81.3, y: 38.1, bold: true, width: '20%' },
            { id: 'mother_name', value: admin_data?.mother_name, x: 39.1, y: 38.1, bold: true, width: '20%' },
            { id: 'phone', value: customer?.phone, x: 31.2, y: 41.2, bold: true, width: '15%' },
            { id: 'address', value: customer?.address, x: 81.3, y: 41.2, bold: true, width: '20%' },
            { id: 'ticket_number', value: admin_data?.ticket_number || details?.ticket_number, x: 82.2, y: 44.5, bold: true, width: '10%' },
            { id: 'travel_date', value: details?.travelDate, x: 54.3, y: 44.5, bold: true, width: '15%' },
            { id: 'travel_time', value: admin_data?.travel_time, x: 32.1, y: 44.5, bold: true, width: '10%' },
            { id: 'passport_number', value: admin_data?.passport_number, x: 83.4, y: 47.8, bold: true, width: '15%' },
            { id: 'issue_date', value: admin_data?.passport_issue_date, x: 53.5, y: 47.8, bold: true, width: '15%' },
            { id: 'expiry_date', value: admin_data?.passport_expiry_date, x: 32.6, y: 47.8, bold: true, width: '15%' },
            { id: 'destination', value: details?.destination, x: 82.2, y: 50.9, bold: true, width: '20%' },
            { id: 'travel_type', value: details?.travelType === 'air' ? 'جوي' : (details?.travelType === 'land' ? 'بري' : 'بحري'), x: 33.6, y: 50.9, bold: true, width: '10%' },
            { id: 'outlet_name', value: details?.pickupLocationName || admin_data?.travel_agency || 'وكيل المطار', x: 81.5, y: 54.2, bold: true, width: '20%' },
            { id: 'amount_usd', value: parseFloat(details?.usdAmount || details?.amountUSD || 0).toLocaleString(), x: 86, y: 57.4, bold: true, width: '10%' },
            { id: 'selling_rate', value: Math.round(parseFloat(details?.iqdAmount || 0) / parseFloat(details?.usdAmount || 1)).toLocaleString(), x: 83.9, y: 60.6, bold: true, width: '9%' },
            { id: 'commission', value: '0', x: 71, y: 60.5, bold: true, width: '7%' },
            { id: 'total_iqd_final', value: parseFloat(details?.iqdAmount || 0).toLocaleString(), x: 32.8, y: 60.5, bold: true, width: '10%' },
        ],
        stamps: {
            airport: { x: 67.9, y: 85.2, width: 300, height: 300, rotate: -12 },
            signature: { x: 22.2, y: 69.4, width: 350, height: 150, rotate: 0 },
            company: { x: 36.1, y: 84.8, width: 300, height: 300, rotate: 50 }
        },
        qr: { x: 13, y: 87.5, size: 80 }
    },
    western_union: {
        template: '/assets/receipts/western-union.jpg',
        fields: (order, admin_data, customer, details, formatDate) => [
            { id: 'order_id', value: details?.mtcn || order.order_id?.replace(/^WU-/, ''), x: 90, y: 28, bold: true, fontSize: 8 },
            { id: 'date', value: formatDate(order.created_at), x: 90, y: 30.7, bold: true, fontSize: 8 },
            { id: 'sender', value: details?.senderName, x: 34.9, y: 29.6, bold: true, fontSize: 8 },
            { id: 'sender_address', value: details?.senderAddress, x: 34.9, y: 34.8, bold: true, fontSize: 8 },
            { id: 'sender_phone', value: details?.senderPhone, x: 34.9, y: 60, bold: true, fontSize: 8 },
            { id: 'receiver', value: details?.receiverName, x: 60.1, y: 29.6, bold: true, fontSize: 8 },
            { id: 'receiver_address', value: details?.receiverAddress, x: 60.1, y: 57.3, bold: true, fontSize: 8 },
            { id: 'receiver_phone', value: details?.receiverPhone, x: 60.1, y: 61.5, bold: true, fontSize: 8 },
            { id: 'receiver_country', value: getCountryTranslation(details?.receiverCountry), x: 60.1, y: 45, bold: true, fontSize: 8 },
            { id: 'receiver_country_2', value: getCountryTranslation(details?.receiverCountry), x: 90, y: 34.7, bold: true, fontSize: 8 },
            { id: 'id_type', value: details?.idType === 'passport' ? 'جواز سفر' : details?.idType === 'national_id' ? 'بطاقة هوية' : details?.idType, x: 34.9, y: 36.9, bold: true, fontSize: 8 },
            { id: 'id_number', value: admin_data?.id_number, x: 34.9, y: 47.5, bold: true, fontSize: 8 },
            { id: 'id_issue_date', value: admin_data?.id_issue_date, x: 33.6, y: 41.1, bold: true, fontSize: 8 },
            { id: 'id_issuing_authority', value: admin_data?.id_issuing_authority, x: 34.9, y: 43.2, bold: true, fontSize: 8 },
            { id: 'id_expiry_date', value: admin_data?.id_expiry_date, x: 34.9, y: 45.3, bold: true, fontSize: 8 },
            { id: 'purpose', value: details?.purpose === 'trade' ? 'تجارة' : details?.purpose === 'family_expenses' ? 'نفقات الأسرة' : details?.purpose === 'medical' ? 'علاج' : (details?.purpose || ''), x: 90, y: 60.1, bold: true, fontSize: 8 },
            { id: 'amount', value: `${details?.amount} ${details?.currency}`, x: 90, y: 55.5, bold: true, fontSize: 8 },
            { id: 'currency_name', value: details?.currency, x: 90, y: 57.4, bold: true, fontSize: 8 },
            { id: 'usd_amount', value: details?.usdAmount ? `${parseFloat(details.usdAmount).toFixed(2)} USD` : '', x: 90, y: 38.8, bold: true, fontSize: 8 },
            { id: 'exchange_rate', value: details?.exchangeRateUSD ? parseFloat(details.exchangeRateUSD).toFixed(4) : '', x: 90, y: 53.3, bold: true, fontSize: 8 },
            { id: 'fee', value: `${details?.serviceFee?.toLocaleString()} IQD`, x: 90, y: 41, bold: true, fontSize: 8 },
        ],
        stamps: {
            company: { x: 83.3, y: 74.1, width: 250, height: 250, rotate: 0 }
        },
    },
    moneygram: {
        template: '/assets/receipts/moneygram.jpg',
        fields: (order, admin_data, customer, details, formatDate) => [
            // Sender Information
            { id: 'sender_first_name', value: details?.senderFirstName || details?.senderName, x: 60.4, y: 23.7, bold: true },
            { id: 'sender_last_name', value: details?.senderLastName, x: 60.4, y: 26.3, bold: true },
            { id: 'sender_dob', value: details?.senderDOB, x: 60.4, y: 35, bold: true },
            { id: 'sender_pob', value: details?.senderPOB, x: 60.4, y: 37, bold: true },
            { id: 'sender_phone', value: details?.senderPhone, x: 60.4, y: 32.2, bold: true },
            { id: 'sender_address', value: details?.senderAddress, x: 60.4, y: 28.2, bold: true },
            // Receiver Information
            { id: 'receiver_first_name', value: details?.receiverFirstName || details?.receiverName, x: 60.4, y: 45.5, bold: true },
            { id: 'receiver_last_name', value: details?.receiverLastName, x: 60.4, y: 48.5, bold: true },
            { id: 'receiver_dob', value: details?.receiverDOB, x: 60.4, y: 51.6, bold: true },
            { id: 'receiver_phone', value: details?.receiverPhone, x: 60.4, y: 54.3, bold: true },
            { id: 'receiver_country', value: getCountryTranslation(details?.receiverCountry), x: 60.4, y: 15.9, bold: true },
            // Transfer Details
            { id: 'total', value: `${details?.totalInCurrency || details?.amount} ${details?.currency}`, x: 35.4, y: 58.9, bold: true },
            { id: 'total_words', value: details?.totalInCurrency ? amountToUSDWords(parseFloat(details.totalInCurrency)) : '', x: 85.3, y: 58.9, bold: true, size: 'text-[11px]' },
            { id: 'purpose', value: getPurpose(details), x: 60.4, y: 39.7, bold: true },
            { id: 'ref_number', value: details?.reference_number, x: 59.9, y: 96.3, bold: true, fontSize: 21 },
        ],
        stamps: {
            signature: { x: 38.4, y: 82.3, width: 300, height: 200, rotate: 0 },
            company: { x: 71.8, y: 82.5, width: 250, height: 250, rotate: 0 }
        },
    },
    local: {
        template: '/assets/receipts/local.jpg',
        fields: (order, admin_data, customer, details, formatDate) => [
            { id: 'order_id_1', value: order.order_id, x: 37.7, y: 27.6, bold: true, size: 'text-[14px]' },
            { id: 'order_id_2', value: order.order_id, x: 32.5, y: 47.2, bold: true, size: 'text-[14px]' },
            { id: 'date', value: formatDate(order.created_at), x: 80, y: 27.6, bold: true, size: 'text-[14px]' },
            { id: 'sender', value: details?.senderName, x: 77.4, y: 50.7, bold: true, size: 'text-[16px]' },
            { id: 'receiver', value: details?.receiverName, x: 77.4, y: 53.8, bold: true, size: 'text-[16px]' },
            { id: 'sender_phone', value: details?.senderPhone, x: 29, y: 50.8, bold: true, size: 'text-[14px]' },
            { id: 'receiver_phone', value: details?.receiverPhone, x: 29, y: 54, bold: true, size: 'text-[14px]' },
            { id: 'from_prov', value: getProvinceTranslation(details?.senderProvince), x: 74.1, y: 57.1, bold: true, size: 'text-[14px]' },
            { id: 'to_prov', value: getProvinceTranslation(details?.receiverProvince), x: 30.6, y: 57.1, bold: true, size: 'text-[14px]' },
            { id: 'to_prov_2', value: getProvinceTranslation(details?.receiverProvince), x: 85, y: 44.8, bold: true, size: 'text-[14px]' },
            { id: 'to_separator', value: '-', x: 79, y: 44.8, bold: true, size: 'text-[14px]' },
            { id: 'to_dist', value: details?.receiverDistrict, x: 77, y: 44.8, bold: true, size: 'text-[14px]' },
            { id: 'amount_usd', value: `${details?.amount || details?.amountUSD} ${details?.senderCurrency || 'USD'}`, x: 74.6, y: 32.8, bold: true, size: 'text-[16px]' },
            { id: 'amount_in_words', value: amountToWords(details?.amount || details?.amountUSD, details?.senderCurrency || 'USD'), x: 45.4, y: 32.4, bold: true, size: 'text-[13px]', width: '50%' },
            { id: 'fee', value: `${details?.serviceFee?.toLocaleString()} IQD`, x: 46.7, y: 36.5, bold: true, size: 'text-[14px]' },
            { id: 'total', value: `${details?.total?.toLocaleString()} IQD`, x: 22, y: 36.5, bold: true, size: 'text-[18px]' },
            {
                id: 'status',
                value: getStatusTranslation(order.status).text,
                x: 29, y: 41.8, bold: true, color: getStatusTranslation(order.status).color,
                size: 'text-[16px]'
            },
        ],
        stamps: {
            signature: { x: 21.5, y: 61.3, width: 300, height: 200, rotate: 0 },
            company: { x: 79.8, y: 69.8, width: 300, height: 300, rotate: 0 }
        },
        qr: { x: 25.5, y: 85.1, size: 120 }
    },
    country_based: {
        template: '/assets/receipts/country_based.jpg',
        fields: (order, admin_data, customer, details, formatDate) => [
            { id: 'method_overlay', value: details?.methodName, x: 30.1, y: 37.6, bold: true, color: '#ffffff', size: 'text-[20px]', height: '35px' },
            { id: 'order_id', value: order.order_id, x: 22.1, y: 33.9, bold: true, size: 'text-[14px]' },
            { id: 'date', value: formatDate(order.created_at), x: 90.1, y: 33.9, bold: true, size: 'text-[14px]' },
            { id: 'receiver', value: details?.receiverName, x: 62, y: 55.4, bold: true, size: 'text-[16px]' },
            { id: 'amount_usd', value: `${details?.amount} USD`, x: 62, y: 41.6, bold: true, size: 'text-[16px]' },
            { id: 'receive_amount', value: `${details?.receiveAmount?.toLocaleString()} ${details?.receiverCurrency}`, x: 62, y: 44.9, bold: true, size: 'text-[16px]' },
            { id: 'purpose', value: getPurpose(details), x: 62.8, y: 60.9, bold: true, size: 'text-[15px]' },
            {
                id: 'status',
                value: getStatusTranslation(order.status).text,
                x: 63, y: 64.1, bold: true, color: getStatusTranslation(order.status).color,
                size: 'text-[16px]'
            },
        ],
        stamps: {
            signature: { x: 21.8, y: 67.9, width: 300, height: 200, rotate: 0 },
            company: { x: 77.6, y: 73.1, width: 300, height: 300, rotate: 0 }
        },
        qr: { x: 25, y: 85.5, size: 120 }
    },
    usdt_recharge: {
        template: '/assets/receipts/usdt_recharge.jpg',
        fields: (order, admin_data, customer, details, formatDate) => [
            { id: 'order_id', value: order.order_id, x: 22, y: 33.6, bold: true, size: 'text-[14px]' },
            { id: 'date', value: formatDate(order.created_at), x: 90.2, y: 33.6, bold: true, size: 'text-[14px]' },
            { id: 'wallet', value: details?.walletAddress, x: 71.8, y: 55.1, bold: true, size: 'text-[14px]' },
            { id: 'iqd_amount', value: `${details?.amountIQD?.toLocaleString()} IQD`, x: 55.8, y: 41.4, bold: true, size: 'text-[15px]' },
            {
                id: 'total',
                value: (() => {
                    const parseVal = (v) => {
                        if (typeof v === 'number') return v;
                        if (!v) return 0;
                        const cleaned = String(v).replace(/[^\d.]/g, '');
                        return parseFloat(cleaned) || 0;
                    };
                    const tot = parseVal(details?.total);
                    const usd = parseVal(details?.amountUSD || details?.usdAmount || details?.amount);
                    const iqd = parseVal(details?.amountIQD || details?.iqdAmount);

                    if (tot > 0 && usd > 0 && iqd > 0) {
                        return `$${(tot * (usd / iqd)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    }
                    return `$${(usd || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                })(),
                x: 55.8, y: 45.2, bold: true, size: 'text-[15px]'
            },
            {
                id: 'status',
                value: getStatusTranslation(order.status).text,
                x: 49.8, y: 63.9, bold: true,
                color: getStatusTranslation(order.status).color,
                size: 'text-[16px]'
            },
        ],
        stamps: {
            signature: { x: 21.2, y: 68, width: 300, height: 200, rotate: 0 },
            company: { x: 75.5, y: 73.1, width: 300, height: 300, rotate: 0 }
        },
        qr: { x: 25.5, y: 85.5, size: 130 }
    },
    card_recharge: {
        template: '/assets/receipts/card_recharge.jpg',
        fields: (order, admin_data, customer, details, formatDate) => [
            { id: 'order_id', value: order.order_id, x: 22, y: 33.6, bold: true, size: 'text-[14px]' },
            { id: 'date', value: formatDate(order.created_at), x: 90.2, y: 33.6, bold: true, size: 'text-[14px]' },
            { id: 'card_name', value: details?.cardName, x: 55.8, y: 55, bold: true, size: 'text-[14px]' },
            { id: 'card_number', value: details?.cardNumber || details?.accountNumber, x: 55.8, y: 57.1, bold: true, size: 'text-[14px]' },
            { id: 'iqd_amount', value: `${details?.amountIQD?.toLocaleString()} IQD`, x: 55.8, y: 41.4, bold: true, size: 'text-[15px]' },
            { id: 'total_iqd', value: `${details?.total?.toLocaleString()} IQD`, x: 55.8, y: 45.2, bold: true, size: 'text-[15px]' },
            {
                id: 'status',
                value: getStatusTranslation(order.status).text,
                x: 49.8, y: 63.9, bold: true,
                color: getStatusTranslation(order.status).color,
                size: 'text-[16px]'
            },
        ],
        stamps: {
            signature: { x: 21.2, y: 68, width: 300, height: 200, rotate: 0 },
            company: { x: 75.5, y: 73.1, width: 300, height: 300, rotate: 0 }
        },
        qr: { x: 25.5, y: 85.5, size: 130 }
    }
};
