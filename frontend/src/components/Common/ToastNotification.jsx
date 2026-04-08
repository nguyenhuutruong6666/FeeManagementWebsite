import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import './ToastNotification.scss';

const ToastContext = createContext(null);

const ToastNotification = ({ message, type = 'success', isOpen, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return 'ri-checkbox-circle-line';
            case 'error': return 'ri-error-warning-line';
            case 'warning': return 'ri-alert-line';
            case 'info': return 'ri-information-line';
            default: return 'ri-information-line';
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`toast-notification-wrapper show`}>
            <div className={`toast-notification toast-${type}`}>
                <div className="toast-body">
                    <div className="d-flex align-items-center justify-content-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <i className={`${getIcon()} toast-icon`}></i>
                            <span className="toast-message">{message}</span>
                        </div>
                        <button className="toast-close" onClick={onClose} style={{ marginLeft: '16px' }}>
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);
        return id;
    }, []);

    const toast = useMemo(() => ({
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        info: (message, duration) => addToast(message, 'info', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
    }), [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, toast, removeToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toastItem) => (
                    <ToastNotification
                        key={toastItem.id}
                        message={toastItem.message}
                        type={toastItem.type}
                        isOpen={true}
                        onClose={() => removeToast(toastItem.id)}
                        duration={toastItem.duration}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastNotification;
