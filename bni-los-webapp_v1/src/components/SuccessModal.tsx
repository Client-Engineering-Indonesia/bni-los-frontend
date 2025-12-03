import { CheckCircle, X, XCircle } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: 'success' | 'error';
}

export const SuccessModal = ({ isOpen, onClose, title, message, type = 'success' }: SuccessModalProps) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
    const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
    const buttonBg = isSuccess ? 'bg-green-600' : 'bg-red-600';
    const buttonHover = isSuccess ? 'hover:bg-green-700' : 'hover:bg-red-700';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
                            {isSuccess ? (
                                <CheckCircle className={`w-6 h-6 ${iconColor}`} />
                            ) : (
                                <XCircle className={`w-6 h-6 ${iconColor}`} />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">{title || (isSuccess ? 'Success' : 'Error')}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-700 text-base leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2.5 ${buttonBg} text-white rounded-lg ${buttonHover} font-medium transition-colors`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};
