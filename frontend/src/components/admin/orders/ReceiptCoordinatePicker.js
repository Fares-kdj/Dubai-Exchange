import React, { useState, useRef, useEffect } from 'react';
import { RECEIPT_CONFIGS } from './ReceiptConfigs';
import {
    Copy, Check, Image as ImageIcon, MousePointer2, Info,
    Plus, Minus, RotateCcw, Eye, EyeOff, FileText, QrCode,
    Download, Search, Move, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

// ── بيانات تجريبية لعرض الحقول ──────────────────────────────────────────────
const DUMMY_ORDER = { order_id: '123456', created_at: new Date().toISOString(), status: 'completed' };
const DUMMY_ADMIN = {
    company_stamp_id: 1, signature_id: 1, travel_type: 'air',
    ticket_number: 'TK-123', passport_number: 'P09876', travel_time: '14:30',
    batch_number: 'B-01', batch_date: '2023-10-01', id_number: '123456789',
    mother_name: 'فاطمة محمد', passport_issue_date: '2020-01-01', passport_expiry_date: '2030-01-01',
    travel_agency: 'وكيل المطار'
};
const DUMMY_CUSTOMER = { full_name: 'أحمد محمد', phone: '07712345678', address: 'بغداد' };
const DUMMY_DETAILS = {
    amountUSD: 1000, amountIQD: 1320000, amount: 1000, total: 1320000,
    currency: 'USD', senderName: 'ياسر رضا', receiverName: 'عمر كاظم',
    purpose: 'trade', cardName: 'MasterCard', cardNumber: '1234 5678 9101 1121',
    usdAmount: 1000, iqdAmount: 1320000, travelDate: '2024-03-15',
    travelType: 'air', destination: 'دبي', pickupLocationName: 'وكيل المطار',
    senderPhone: '07700000001', receiverPhone: '07700000002',
    senderProvince: 'baghdad', receiverProvince: 'basra', receiverDistrict: 'الجزائر',
    senderCurrency: 'USD', serviceFee: 5000, walletAddress: 'TRC20-XXXX',
    methodName: 'تحويل بنكي', receiveAmount: 1000, receiverCurrency: 'EUR', countryCode: 'FR'
};
const DUMMY_CONTACT = {
    phone: '077000000', email: 'test@test.com', address: 'Iraq',
    ar: { phone: '077000000', email: 'test@test.com', address: 'العراق' }
};
const FORMAT_DATE = () => '2024-01-15';

const getInitialFields = (config) => {
    if (!config?.fields) return [];
    try {
        return config.fields(DUMMY_ORDER, DUMMY_ADMIN, DUMMY_CUSTOMER, DUMMY_DETAILS, FORMAT_DATE, DUMMY_CONTACT, 'مطار بغداد').filter(Boolean);
    } catch {
        return [];
    }
};

// ── المكوّن الرئيسي ───────────────────────────────────────────────────────────
const ReceiptCoordinatePicker = () => {
    const [selectedType, setSelectedType] = useState(Object.keys(RECEIPT_CONFIGS)[0]);
    const [fieldOverrides, setFieldOverrides] = useState({});   // { [id]: { x, y } }
    const [draggingFieldId, setDraggingFieldId] = useState(null);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [zoom, setZoom] = useState(0.8);
    const [showExisting, setShowExisting] = useState(true);
    const [elementMode, setElementMode] = useState('text');
    const [newFieldCoords, setNewFieldCoords] = useState(null);
    const [copied, setCopied] = useState(false);
    const [copiedExport, setCopiedExport] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFieldsList, setShowFieldsList] = useState(true);

    const containerRef = useRef(null);
    const draggingRef = useRef(null);

    const config = RECEIPT_CONFIGS[selectedType];
    const baseFields = getInitialFields(config);

    // دمج الحقول الأصلية مع التعديلات
    const fields = baseFields.map(f => ({
        ...f,
        x: fieldOverrides[f.id]?.x ?? f.x,
        y: fieldOverrides[f.id]?.y ?? f.y,
    }));

    // ── حساب الإحداثيات من موضع المؤشر ──────────────────────────────────────
    const getCoordsFromPointer = (clientX, clientY) => {
        if (!containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        const x = parseFloat(Math.min(100, Math.max(0, 100 - ((clientX - rect.left) / rect.width * 100))).toFixed(1));
        const y = parseFloat(Math.min(100, Math.max(0, (clientY - rect.top) / rect.height * 100)).toFixed(1));
        return { x, y };
    };

    // ── إضافة مستمعات الأحداث عند السحب ─────────────────────────────────────
    useEffect(() => {
        if (!draggingFieldId) return;

        const handleMove = (e) => {
            if (!draggingRef.current) return;
            const coords = getCoordsFromPointer(e.clientX, e.clientY);
            if (!coords) return;
            const id = draggingRef.current;
            setFieldOverrides(prev => ({
                ...prev,
                [id]: { ...(prev[id] || {}), ...coords }
            }));
        };

        const handleUp = () => {
            draggingRef.current = null;
            setDraggingFieldId(null);
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerup', handleUp);
        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleUp);
        };
    }, [draggingFieldId]);

    // ── بدء السحب على حقل ────────────────────────────────────────────────────
    const handleFieldPointerDown = (e, fieldId) => {
        e.stopPropagation();
        e.preventDefault();
        draggingRef.current = fieldId;
        setDraggingFieldId(fieldId);
        setSelectedFieldId(fieldId);
        setNewFieldCoords(null);
    };

    // ── النقر على الحاوية (لتحديد إحداثيات جديدة) ────────────────────────────
    const handleContainerClick = (e) => {
        if (draggingRef.current) return;
        if (e.target.closest('[data-field-draggable]')) return;
        const coords = getCoordsFromPointer(e.clientX, e.clientY);
        if (coords) {
            setNewFieldCoords(coords);
            setSelectedFieldId(null);
        }
    };

    // ── تغيير النوع ───────────────────────────────────────────────────────────
    const handleTypeChange = (newType) => {
        setSelectedType(newType);
        setFieldOverrides({});
        setSelectedFieldId(null);
        setNewFieldCoords(null);
        setSearchQuery('');
    };

    // ── تحديث إحداثي حقل يدوياً ──────────────────────────────────────────────
    const updateFieldCoord = (id, axis, value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return;
        const clamped = parseFloat(Math.min(100, Math.max(0, num)).toFixed(1));
        setFieldOverrides(prev => ({
            ...prev,
            [id]: { ...(prev[id] || {}), [axis]: clamped }
        }));
    };

    const resetField = (id) => {
        setFieldOverrides(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const resetAll = () => {
        setFieldOverrides({});
        setNewFieldCoords(null);
        setSelectedFieldId(null);
        toast.success('تم إعادة تعيين جميع الحقول');
    };

    // ── توليد كود التصدير ─────────────────────────────────────────────────────
    const generateExportCode = () => {
        const lines = fields.map(f => {
            // نحذف value لأنه ديناميكي ونحتفظ بباقي الخصائص
            const { value, ...rest } = f;
            const props = Object.entries(rest)
                .map(([k, v]) => typeof v === 'string' ? `${k}: '${v}'` : `${k}: ${v}`)
                .join(', ');
            return `    { ${props} },`;
        });
        return `// تم التحديث بواسطة ReceiptCoordinatePicker\nfields: (order, admin_data, customer, details, formatDate, contactInfo, airportNameOrBorder) => [\n${lines.join('\n')}\n],`;
    };

    const copyExport = () => {
        navigator.clipboard.writeText(generateExportCode());
        setCopiedExport(true);
        toast.success(`تم نسخ ${fields.length} حقل بنجاح!`);
        setTimeout(() => setCopiedExport(false), 2500);
    };

    const copyNewFieldCode = () => {
        if (!newFieldCoords) return;
        const templates = {
            text: `{ id: 'field_id', value: '...', x: ${newFieldCoords.x}, y: ${newFieldCoords.y}, width: '20%', fontSize: 14 },`,
            stamp: `new_stamp: { x: ${newFieldCoords.x}, y: ${newFieldCoords.y}, width: 250, height: 250, rotate: 0 }`,
            qr: `qr: { x: ${newFieldCoords.x}, y: ${newFieldCoords.y}, size: 120 }`
        };
        navigator.clipboard.writeText(templates[elementMode]);
        setCopied(true);
        toast.success('تم نسخ الكود!');
        setTimeout(() => setCopied(false), 2000);
    };

    const selectedField = selectedFieldId ? fields.find(f => f.id === selectedFieldId) : null;
    const filteredFields = fields.filter(f => f.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const modifiedCount = Object.keys(fieldOverrides).length;

    return (
        <div className="space-y-4 p-4" style={{ direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>

            {/* ── رأس الصفحة ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">أداة تحديد إحداثيات الطباعة (A4)</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        🖱️ <strong>اسحب</strong> أي حقل لتغيير موضعه مباشرةً &nbsp;•&nbsp;
                        🖱️ <strong>انقر</strong> منطقة فارغة للحصول على إحداثيات جديدة
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {modifiedCount > 0 && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                            ✏️ {modifiedCount} تعديل غير محفوظ
                        </span>
                    )}
                    <button
                        onClick={() => setShowExisting(!showExisting)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${showExisting
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                    >
                        {showExisting ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {showExisting ? 'إخفاء الحقول' : 'عرض الحقول'}
                    </button>
                    <select
                        value={selectedType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none min-w-[180px]"
                    >
                        {Object.keys(RECEIPT_CONFIGS).map(type => (
                            <option key={type} value={type}>{type.replace(/_/g, ' ').toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* ── لوحة الرسم ── */}
                <div className="lg:col-span-3 space-y-3">
                    <div
                        className="bg-slate-300 rounded-2xl p-6 overflow-auto border-4 border-white shadow-inner flex items-start justify-center"
                        style={{ height: '820px' }}
                    >
                        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.1s', paddingBottom: '60px' }}>
                            <div
                                ref={containerRef}
                                className="relative bg-white shadow-2xl overflow-hidden border border-slate-400"
                                style={{
                                    width: '794px', height: '1123px',
                                    fontFamily: 'Cairo, sans-serif', direction: 'rtl',
                                    cursor: draggingFieldId ? 'grabbing' : 'crosshair'
                                }}
                                onClick={handleContainerClick}
                            >
                                {/* قالب الخلفية */}
                                <img
                                    src={config?.template}
                                    alt="Template"
                                    className="absolute inset-0 w-full h-full pointer-events-none object-fill"
                                    draggable={false}
                                />

                                {/* شبكة الإرشاد */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-5"
                                    style={{
                                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                                        backgroundSize: '5% 5%'
                                    }}
                                />

                                {/* ── حقول قابلة للسحب ── */}
                                {showExisting && fields.map(field => {
                                    const isSelected = selectedFieldId === field.id;
                                    const isDragging = draggingFieldId === field.id;
                                    const isModified = !!fieldOverrides[field.id];
                                    return (
                                        <div
                                            key={field.id}
                                            data-field-draggable="true"
                                            onPointerDown={(e) => handleFieldPointerDown(e, field.id)}
                                            title={`${field.id}  x:${field.x} y:${field.y}`}
                                            className={`absolute flex items-center whitespace-nowrap overflow-hidden select-none border
                                                ${field.center ? 'justify-center' : 'justify-start'}
                                                ${isSelected
                                                    ? 'ring-2 ring-red-500 bg-red-50/60 border-red-400 z-30'
                                                    : isModified
                                                        ? 'bg-amber-400/25 border-amber-500 z-20'
                                                        : 'bg-blue-500/10 border-blue-400/60 z-10'
                                                }
                                                ${isDragging ? 'opacity-70 z-40 shadow-lg' : ''}
                                            `}
                                            style={{
                                                right: `${100 - field.x}%`,
                                                top: `${field.y}%`,
                                                width: field.width || 'auto',
                                                maxWidth: field.width || '28%',
                                                height: field.height || '22px',
                                                transform: field.center
                                                    ? `translate(50%, -50%) ${selectedType === 'traveler' ? 'rotate(90deg)' : ''}`
                                                    : `translate(0, -50%) ${selectedType === 'traveler' ? 'rotate(90deg)' : ''}`,
                                                fontSize: '11px',
                                                color: isSelected ? '#991b1b' : isModified ? '#92400e' : '#1e40af',
                                                padding: '0 5px',
                                                cursor: isDragging ? 'grabbing' : 'grab',
                                                touchAction: 'none',
                                                transition: isDragging ? 'none' : 'right 0.05s, top 0.05s'
                                            }}
                                        >
                                            <Move className="w-2.5 h-2.5 shrink-0 ml-1 opacity-50" />
                                            <span className="truncate font-medium">{field.id}</span>
                                            {isModified && <span className="mr-1 text-amber-500">●</span>}
                                        </div>
                                    );
                                })}

                                {/* الأختام */}
                                {showExisting && config?.stamps && Object.entries(config.stamps).map(([key, stamp]) => (
                                    <div
                                        key={`stamp-${key}`}
                                        className="absolute flex items-center justify-center border-2 border-green-500/60 bg-green-500/15 text-green-900 text-xs font-bold pointer-events-none"
                                        style={{
                                            right: `${100 - stamp.x}%`, top: `${stamp.y}%`,
                                            width: `${stamp.width}px`, height: `${stamp.height}px`,
                                            transform: `translate(50%, -50%) rotate(${stamp.rotate || 0}deg)`, zIndex: 15
                                        }}
                                    >
                                        <ImageIcon className="w-5 h-5 mr-1 opacity-40" />
                                        {key.toUpperCase()}
                                    </div>
                                ))}

                                {/* QR Code */}
                                {showExisting && config?.qr && (
                                    <div
                                        className="absolute flex flex-col items-center justify-center border-2 border-dashed border-slate-700 bg-white/80 text-slate-800 font-bold pointer-events-none"
                                        style={{
                                            right: `${100 - config.qr.x}%`, top: `${config.qr.y}%`,
                                            width: `${config.qr.size}px`, height: `${config.qr.size}px`,
                                            transform: 'translate(50%, -50%)', zIndex: 15
                                        }}
                                    >
                                        <QrCode className="w-6 h-6 mb-1" />
                                        <span className="text-xs">QR</span>
                                    </div>
                                )}

                                {/* علامة النقطة الجديدة */}
                                {newFieldCoords && (
                                    <div
                                        className="absolute w-4 h-4 flex items-center justify-center z-50 pointer-events-none"
                                        style={{
                                            left: `${100 - newFieldCoords.x}%`,
                                            top: `${newFieldCoords.y}%`,
                                            transform: `translate(-50%, -50%) scale(${1 / zoom})`
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                                        <div className="relative bg-red-600 p-0.5 rounded-full shadow-lg border border-white">
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* أدوات التكبير */}
                    <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setZoom(p => Math.max(0.3, parseFloat((p - 0.1).toFixed(1))))}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                                <Minus className="w-4 h-4" />
                            </button>
                            <input type="range" min="0.3" max="2" step="0.1" value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-32 accent-amber-500 cursor-pointer" />
                            <button onClick={() => setZoom(p => Math.min(2, parseFloat((p + 0.1).toFixed(1))))}
                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold text-slate-700 min-w-[48px] text-center">
                                {Math.round(zoom * 100)}%
                            </span>
                        </div>
                        <button onClick={() => { setZoom(0.8); resetAll(); }}
                            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors font-medium">
                            <RotateCcw className="w-4 h-4" />
                            إعادة الضبط الكاملة
                        </button>
                    </div>
                </div>

                {/* ── الشريط الجانبي ── */}
                <div className="space-y-4">

                    {/* لوحة الحقل المحدد / الإحداثيات الجديدة */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-h-[160px]">
                        {selectedField ? (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                                        <Move className="w-4 h-4 text-blue-500" />
                                        <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{selectedField.id}</code>
                                    </h3>
                                    <div className="flex items-center gap-1">
                                        {fieldOverrides[selectedField.id] && (
                                            <button onClick={() => resetField(selectedField.id)}
                                                className="text-[10px] text-red-500 hover:text-red-700 px-2 py-0.5 border border-red-200 rounded-full transition-colors">
                                                إعادة تعيين
                                            </button>
                                        )}
                                        <button onClick={() => setSelectedFieldId(null)}
                                            className="text-slate-400 hover:text-slate-600 text-sm w-5 h-5 flex items-center justify-center">
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    {[['X (من اليمين)', 'x'], ['Y (من الأعلى)', 'y']].map(([label, axis]) => (
                                        <div key={axis} className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                                            <label className="text-[10px] text-slate-500 block mb-1">{label}</label>
                                            <input
                                                type="number"
                                                step="0.1" min="0" max="100"
                                                value={selectedField[axis]}
                                                onChange={(e) => updateFieldCoord(selectedField.id, axis, e.target.value)}
                                                className="w-full text-center font-bold text-amber-600 bg-transparent border-none outline-none text-sm focus:bg-amber-50 rounded"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="text-[10px] font-mono bg-slate-900 text-slate-300 p-2 rounded-lg" style={{ direction: 'ltr' }}>
                                    x: {selectedField.x}, y: {selectedField.y}
                                    {fieldOverrides[selectedField.id] && (
                                        <span className="text-amber-400 mr-2">← معدّل</span>
                                    )}
                                </div>
                            </div>
                        ) : newFieldCoords ? (
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
                                    <Info className="w-4 h-4 text-amber-500" />
                                    إحداثيات النقطة الجديدة
                                </h3>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <p className="text-[10px] text-slate-500">X (يمين)</p>
                                        <p className="font-bold text-amber-600 text-lg">{newFieldCoords.x}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                        <p className="text-[10px] text-slate-500">Y (أعلى)</p>
                                        <p className="font-bold text-amber-600 text-lg">{newFieldCoords.y}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-1.5 mb-3">
                                    {[['text', 'نص', FileText], ['stamp', 'ختم', ImageIcon], ['qr', 'QR', QrCode]].map(([mode, label, Icon]) => (
                                        <button key={mode} onClick={() => setElementMode(mode)}
                                            className={`py-1.5 flex flex-col items-center gap-0.5 rounded-lg text-[11px] font-medium transition-colors border
                                                ${elementMode === mode
                                                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <button onClick={copyNewFieldCode}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all
                                        ${copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'تم النسخ!' : 'نسخ كود الحقل الجديد'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-8 text-center text-slate-400 space-y-2">
                                <div className="p-3 bg-slate-50 rounded-full">
                                    <MousePointer2 className="w-7 h-7 opacity-40" />
                                </div>
                                <p className="text-xs leading-relaxed px-2">
                                    <strong className="text-slate-600">اسحب</strong> أي حقل أزرق لتعديل موضعه<br />
                                    أو <strong className="text-slate-600">انقر</strong> على منطقة فارغة لإحداثيات جديدة
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── زر تصدير جميع الإحداثيات ── */}
                    <button
                        onClick={copyExport}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95
                            ${copiedExport ? 'bg-green-500 text-white' : 'bg-[#D4AF37] hover:bg-amber-500 text-white'}`}
                    >
                        {copiedExport ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                        {copiedExport
                            ? `✔ تم نسخ ${fields.length} حقل!`
                            : `تصدير كل الإحداثيات${modifiedCount > 0 ? ` (${modifiedCount} تعديل)` : ''}`
                        }
                    </button>

                    {modifiedCount > 0 && (
                        <button onClick={resetAll}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 transition-all font-medium">
                            <RotateCcw className="w-4 h-4" />
                            تراجع عن كل التعديلات
                        </button>
                    )}

                    {/* ── قائمة الحقول ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <button
                            onClick={() => setShowFieldsList(p => !p)}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-bold text-slate-800 text-sm">
                                قائمة الحقول
                                <span className="mr-2 text-slate-400 font-normal text-xs">({fields.length} حقل)</span>
                                {modifiedCount > 0 && (
                                    <span className="mr-1 text-amber-500 text-xs">• {modifiedCount} معدّل</span>
                                )}
                            </span>
                            {showFieldsList
                                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                                : <ChevronDown className="w-4 h-4 text-slate-400" />
                            }
                        </button>

                        {showFieldsList && (
                            <div>
                                <div className="px-4 pb-3">
                                    <div className="relative">
                                        <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="بحث عن حقل..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pr-8 pl-3 py-1.5 text-xs outline-none focus:border-amber-400 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                    {filteredFields.length === 0 ? (
                                        <p className="text-center text-slate-400 text-xs py-4">لا توجد نتائج</p>
                                    ) : filteredFields.map(field => {
                                        const isModified = !!fieldOverrides[field.id];
                                        const isSelected = selectedFieldId === field.id;
                                        return (
                                            <div
                                                key={field.id}
                                                onClick={() => { setSelectedFieldId(field.id); setNewFieldCoords(null); }}
                                                className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-50 transition-colors
                                                    ${isSelected ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    {isModified
                                                        ? <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="تم التعديل" />
                                                        : <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                                                    }
                                                    <span className={`text-xs font-mono ${isSelected ? 'text-blue-600 font-bold' : isModified ? 'text-amber-700 font-semibold' : 'text-slate-600'}`}>
                                                        {field.id}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                                                    {field.x}, {field.y}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* تلميح */}
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
                        💡 <strong>نصيحة:</strong> بعد السحب، اضغط زر <strong>"تصدير كل الإحداثيات"</strong> لنسخ الكود المحدّث مباشرةً إلى <code>ReceiptConfigs.js</code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptCoordinatePicker;