import { AlertTriangle, Info, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    type = 'danger' // danger, warning, info
}) => {
    // Handle history for back button to close modal
    useEffect(() => {
        if (isOpen) {
            const state = { confirmModalOpen: true };
            window.history.pushState(state, '');

            const handlePopState = () => {
                if (isOpen) {
                    onClose();
                }
            };

            window.addEventListener('popstate', handlePopState);
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.history.state?.confirmModalOpen) {
                    window.history.back();
                }
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const themes = {
        danger: {
            icon: Trash2,
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            btnBg: 'bg-red-600 hover:bg-red-700',
            borderColor: 'border-red-100'
        },
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-100',
            btnBg: 'bg-amber-600 hover:bg-amber-700',
            borderColor: 'border-amber-100'
        },
        info: {
            icon: Info,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            btnBg: 'bg-blue-600 hover:bg-blue-700',
            borderColor: 'border-blue-100'
        }
    };

    const theme = themes[type] || themes.danger;
    const Icon = theme.icon;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-12 h-12 ${theme.iconBg} rounded-2xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${theme.iconColor}`} />
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 text-right">
                            {title}
                        </h3>
                        <p className="text-slate-600 text-right leading-relaxed mb-8">
                            {message}
                        </p>

                        <div className="flex flex-row-reverse gap-3">
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 py-3 px-4 ${theme.btnBg} text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98]`}
                            >
                                {confirmText}
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                {cancelText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
