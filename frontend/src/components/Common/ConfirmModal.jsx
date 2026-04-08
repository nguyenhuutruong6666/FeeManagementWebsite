import React from 'react';
import './ConfirmModal.scss';

const ConfirmModal = ({ isOpen, toggle, title, message, onConfirm, confirmText = 'Xác nhận', cancelText = 'Hủy', variant = 'danger' }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content custom-modal">
                <div className="modal-header">
                    <h5 className="modal-title">
                        <i className={`ri-error-warning-line text-${variant}`} style={{marginRight: '8px', color: variant === 'danger' ? '#ef4444' : '#f59e0b'}}></i>
                        {title}
                    </h5>
                    <button type="button" className="btn-close" onClick={toggle}>
                        <i className="ri-close-line"></i>
                    </button>
                </div>
                <div className="modal-body text-center">
                    <div className="icon-wrapper">
                        <div className={`icon-circle bg-${variant}`}>
                            <i className={`ri-error-warning-line text-${variant}`}></i>
                        </div>
                    </div>
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={toggle}>
                        {cancelText}
                    </button>
                    <button type="button" className={`btn btn-${variant}`} onClick={handleConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
