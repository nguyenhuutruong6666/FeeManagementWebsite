export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
};

export const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Handle dd/mm/yyyy
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const getGenderLabel = (genderVal) => {
    if (genderVal === 1 || genderVal === '1') return 'Nam';
    if (genderVal === 0 || genderVal === '0') return 'Nữ';
    return 'Khác';
};
