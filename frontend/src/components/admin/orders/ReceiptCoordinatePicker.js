import React, { useState, useRef } from 'react';
import { RECEIPT_CONFIGS } from './ReceiptConfigs';
import { Copy, Check, Crosshair, Image as ImageIcon, MousePointer2, Info, AlertTriangle, Plus, Minus, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ReceiptCoordinatePicker = () => {
    const [selectedType, setSelectedType] = useState(Object.keys(RECEIPT_CONFIGS)[0]);
    const [coords, setCoords] = useState(null);
    const [copied, setCopied] = useState(false);
    const [zoom, setZoom] = useState(1);
    const containerRef = useRef(null);

    const template = RECEIPT_CONFIGS[selectedType]?.template;

    const handleContainerClick = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const width = rect.width;
        const height = rect.height;

        // FIXED: Calculate X relative to the LEFT to match UniversalReceipt.js (right: 100-x)
        const xPercent = (x / width) * 100;
        // y: distance from the top
        const yPercent = (y / height) * 100;

        setCoords({
            x: parseFloat(xPercent.toFixed(1)),
            y: parseFloat(yPercent.toFixed(1))
        });
    };

    const copyToClipboard = () => {
        if (!coords) return;
        const code = `{ id: 'field_id', value: '...', x: ${coords.x}, y: ${coords.y}, bold: true, width: '10%' },`;
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('تم نسخ الكود بنجاح!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">أداة تحديد إحداثيات الطباعة (A4)</h1>
                    <p className="text-slate-500 mt-1">تتم العمليات هنا بناءً على مقاسات ورقة A4 لضمان دقة الطباعة</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedType}
                        onChange={(e) => {
                            setSelectedType(e.target.value);
                            setCoords(null);
                        }}
                        className="bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none min-w-[200px]"
                    >
                        {Object.keys(RECEIPT_CONFIGS).map(type => (
                            <option key={type} value={type}>
                                {type.replace('_', ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Image Area */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-slate-300 rounded-2xl p-8 overflow-auto relative border-4 border-white shadow-inner h-[700px] flex items-start justify-center">
                        {/* A4 Container Wrapper for Zoom */}
                        <div
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: 'top center',
                                transition: 'transform 0.1s ease-out'
                            }}
                            className="py-4"
                        >
                            {/* The A4 Page Container */}
                            <div
                                ref={containerRef}
                                onClick={handleContainerClick}
                                className="relative bg-white shadow-2xl cursor-crosshair overflow-hidden border border-slate-400"
                                style={{
                                    width: '450px',
                                    height: '636px',
                                    aspectRatio: '210 / 297',
                                    fontFamily: 'Cairo, sans-serif'
                                }}
                            >
                                <img
                                    src={template}
                                    alt="Template Preview"
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                                    draggable={false}
                                />

                                <div className="absolute inset-0 pointer-events-none opacity-5"
                                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '5% 5%' }}>
                                </div>

                                {/* Visual Marker - FIXED: Correction for zoom scale */}
                                {coords && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute w-4 h-4 -ml-2 -mt-2 flex items-center justify-center pointer-events-none z-20"
                                        style={{
                                            left: `${coords.x}%`,
                                            top: `${coords.y}%`,
                                            transform: `scale(${1 / zoom})`, // SCALE CORRECTION
                                            color: RECEIPT_CONFIGS[selectedType]?.fields?.[0]?.color || 'inherit' // Just an example
                                        }}
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                                            <div className="relative bg-red-600 p-0.5 rounded-full shadow-lg border-[1px] border-white">
                                                <Crosshair className="w-2 h-2 text-white" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            >
                                <Minus className="w-5 h-5" />
                            </button>

                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.1"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-48 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                            />

                            <button
                                onClick={() => setZoom(prev => Math.min(5, prev + 0.2))}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                            </button>

                            <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 min-w-[60px] text-center">
                                {Math.round(zoom * 100)}%
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => { setZoom(1); setCoords(null); }}
                                className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#D4AF37] font-medium transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                إعادة الضبط
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-[#D4AF37]" />
                            إحداثيات الميدان
                        </h2>

                        {coords ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        <p className="text-xs text-slate-500 mb-1">X (من اليسار)</p>
                                        <p className="text-xl font-bold text-[#D4AF37]">{coords.x}%</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        <p className="text-xs text-slate-500 mb-1">Y (من الأعلى)</p>
                                        <p className="text-xl font-bold text-[#D4AF37]">{coords.y}%</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-6">
                                    <p className="text-sm font-medium text-slate-700">الكود المحدث:</p>
                                    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono break-all leading-relaxed relative group">
                                        <code>
                                            {`{ id: 'field_id', value: '...', x: ${coords.x}, y: ${coords.y}, bold: true, width: '10%' },`}
                                        </code>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                                            }`}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'تم النسخ' : 'نسخ الكود'}
                                    </button>
                                </div>

                                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                                    <AlertTriangle className="w-10 h-10 text-blue-600 flex-shrink-0" />
                                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                                        <strong>تعديل مهم:</strong> تم تغيير حساب X ليكون من اليسار ليتوافق تماماً مع كود الطباعة. الآن القيم ستظهر في مكانها الصحيح تماماً.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                                <div className="p-4 bg-slate-50 rounded-full text-slate-400">
                                    <MousePointer2 className="w-8 h-8" />
                                </div>
                                <p className="text-sm text-slate-500 px-4">اضغط على <strong>الورقة البيضاء</strong> في المعاينة لتحديد الإحداثيات</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptCoordinatePicker;
