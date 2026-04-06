export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('vi-VN');
};

export const generateTransactionCode = () => {
  return 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const generateReceiptCode = (paymentId) => {
  return `RC-${paymentId}-${new Date().getFullYear()}`;
};

export const generateReferenceCode = (identifyCard, periodLabel) => {
  return `DV-${identifyCard}-${periodLabel}`;
};
