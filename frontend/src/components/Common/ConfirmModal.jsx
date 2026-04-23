import React from 'react';
import './ConfirmModal.scss';

const VARIANT_CONFIG = {
    danger: {
        iconClass: 'ri-error-warning-line',
        iconColor: '#dc2626',
        btnClass: 'btn-danger',
        headerIcon: 'ri-delete-bin-line',
    },
    warning: {
        iconClass: 'ri-alert-line',
        iconColor: '#d97706',
        btnClass: 'btn-warning',
        headerIcon: 'ri-alert-line',
    },
    info: {
        iconClass: 'ri-information-line',
        iconColor: '#3b82f6',
        btnClass: 'btn-info',
        headerIcon: 'ri-information-line',
    },
};

const ConfirmModal = ({
    isOpen,
    toggle,
    title,
    message,
    onConfirm,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    variant = 'danger',
}) => {
    if (!isOpen) return null;

    const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.danger;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) toggle(); }}>
            <div className="modal-content custom-modal">

                {/* Header */}
                <div className="modal-header">
                    <h5 className="modal-title">
                        <i className={config.headerIcon} style={{ color: config.iconColor }}></i>
                        {title}
                    </h5>
                    <button type="button" className="btn-close" onClick={toggle} aria-label="Đóng">
                        <i className="ri-close-line"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="icon-wrapper">
                        <div className={`icon-circle bg-${variant}`}>
                            <i className={config.iconClass}></i>
                        </div>
                    </div>
                    <p>{message}</p>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={toggle}>
                        {cancelText}
                    </button>
                    <button type="button" className={`btn ${config.btnClass}`} onClick={handleConfirm}>
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmModal;
