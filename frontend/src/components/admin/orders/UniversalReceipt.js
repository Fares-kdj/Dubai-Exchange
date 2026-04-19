import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RECEIPT_CONFIGS } from './ReceiptConfigs';

const UniversalReceipt = ({
    order,
    debug = false,
    airports = [],
    borders = [],
    companyStamps = [],
    signatures = [],
    contactInfo = null,
    onImageLoad = () => { }
}) => {
    if (!order) return null;

    const { customer, details, admin_data, order_id, created_at, order_type } = order;
    const API_URL = process.env.REACT_APP_BACKEND_URL || '';

    // Get config for this order type, fallback to traveler if not found
    const config = RECEIPT_CONFIGS[order_type] || RECEIPT_CONFIGS.traveler;
    const shouldRotate = order_type === 'traveler' || order_type === 'western_union';

    // Format dates helper
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('ar-IQ');
        } catch {
            return dateStr;
        }
    };

    // Find stamps and signatures
    const companyStamp = companyStamps?.find(s => s.stamp_id === admin_data?.company_stamp_id);
    const signatureStamp = signatures?.find(s => s.stamp_id === admin_data?.signature_id);

    // For traveler booking, distinguish between airport and border
    const airportStamp = (admin_data?.travel_type === 'air' ? airports : borders)?.find(
        s => s.stamp_id === (admin_data?.airport_id || admin_data?.border_id)
    );

    // For traveler booking, distinguish between airport and border name for the title
    const airportNameOrBorder = admin_data?.travel_type === 'air'
        ? (airports.find(a => String(a.stamp_id) === String(admin_data?.airport_id))?.name_ar || 'مطار')
        : 'منافذ حدودية';

    // Get fields from config
    const fields = config.fields(order, admin_data, customer, details, formatDate, contactInfo, airportNameOrBorder);

    // Dynamic Image Fields (Stamps and Signatures)
    const imageFields = [];

    if (config.stamps?.airport && airportStamp) {
        imageFields.push({
            id: 'airport_stamp',
            image: airportStamp?.stamp_image || airportStamp?.image_url,
            ...config.stamps.airport
        });
    }

    if (config.stamps?.signature && signatureStamp) {
        imageFields.push({
            id: 'signature_stamp',
            image: signatureStamp?.stamp_image || signatureStamp?.image_url,
            ...config.stamps.signature
        });
    }

    if (config.stamps?.company && companyStamp) {
        imageFields.push({
            id: 'company_stamp',
            image: companyStamp?.stamp_image || companyStamp?.image_url,
            ...config.stamps.company
        });
    }

    return (
        <div
            id="universal-receipt"
            className="relative mx-auto bg-white overflow-hidden"
            style={{
                width: shouldRotate ? '297mm' : '210mm',
                height: shouldRotate ? '210mm' : '297mm',
                fontFamily: 'Cairo, sans-serif',
                direction: 'rtl',
                color: '#1e293b'
            }}
        >
            {/* Background JPG Template */}
            <img
                src={config.template}
                alt="Receipt Template"
                onLoad={onImageLoad}
                className={`absolute inset-0 w-full h-full pointer-events-none ${shouldRotate ? 'object-fill' : 'object-contain'}`}
            />

            {/* Dynamic Overlay Fields */}
            {fields.filter(f => f).map((field) => (
                <div
                    key={field.id}
                    className={`absolute pointer-events-none flex items-center 
                        ${field.center ? 'justify-center' : 'justify-start'} 
                        ${field.bold ? 'font-bold' : ''} 
                        ${field.size || 'text-[12px]'}
                    `}
                    style={{
                        right: `${100 - field.x}%`,
                        top: `${field.y}%`,
                        width: field.width || 'auto',
                        maxWidth: field.width || 'auto',
                        height: field.height || '20px',
                        transform: field.center ? 'translate(50%, -50%)' : 'translate(0, -50%)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '0 4px',
                        zIndex: 10,
                        color: field.color || 'inherit',
                        fontSize: field.fontSize ? `${field.fontSize}px` : undefined,
                        direction: (field.value?.toString().startsWith('+') || field.id === 'phone') ? 'ltr' : 'inherit'
                    }}
                >
                    {field.value || ''}
                    {debug && (
                        <span className="absolute -top-3 right-0 text-[8px] text-blue-600 bg-white px-1 no-print">
                            {field.id} ({field.x},{field.y})
                        </span>
                    )}
                </div>
            ))}

            {/* Stamp and Signature Images */}
            {imageFields.map((field) => (
                field.image && (
                    <div
                        key={field.id}
                        className="absolute pointer-events-none flex items-center justify-center"
                        style={{
                            right: `${100 - field.x}%`,
                            top: `${field.y}%`,
                            width: `${field.width}px`,
                            height: `${field.height}px`,
                            transform: `translate(50%, -50%) rotate(${field.rotate || 0}deg)`,
                            zIndex: 50 // Highest priority
                        }}
                    >
                        <img
                            src={field.image.startsWith('data:') ? field.image : `${API_URL}${field.image}`}
                            alt={field.id}
                            className="max-w-full max-h-full object-contain mix-blend-multiply"
                            onError={(e) => console.error(`Failed to load ${field.id}:`, field.image)}
                        />
                        {debug && (
                            <span className="absolute -top-3 right-0 text-[8px] text-green-600 bg-white px-1 no-print">
                                {field.id} ({field.x},{field.y})
                            </span>
                        )}
                    </div>
                )
            ))}

            {/* QR Code */}
            {config.qr && (
                <div
                    className="absolute"
                    style={{
                        right: `${100 - config.qr.x}%`,
                        top: `${config.qr.y}%`,
                        transform: 'translate(50%, -50%)',
                        zIndex: 20 // Above fields but below stamps
                    }}
                >
                    <QRCodeSVG
                        value={`رقم الطلب: ${order_id}
الاسم: ${customer?.full_name || ''}
التاريخ: ${formatDate(created_at)}
http://dubai-international-iq.online/track-order?id=${order_id}`}
                        size={config.qr.size || 130}
                        level="H"
                        marginSize={0}
                        bgColor="transparent"
                    />
                </div>
            )}

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page {
                        size: A4 ${shouldRotate ? 'landscape' : 'portrait'};
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    /* Hide everything by default */
                    body * {
                        visibility: hidden !important;
                    }
                    /* Show only the receipt and its content */
                    #universal-receipt, 
                    #universal-receipt * {
                        visibility: visible !important;
                    }
                    #universal-receipt {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: ${shouldRotate ? '297mm' : '210mm'} !important;
                        height: ${shouldRotate ? '210mm' : '297mm'} !important;
                        overflow: hidden !important; /* Prevent overflow into a second page */
                        transform: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        break-inside: avoid !important;
                        page-break-inside: avoid !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default UniversalReceipt;
