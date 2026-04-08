import React from 'react';
import './Pagination.scss';

const Pagination = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalItems);

    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const handlePrev = () => {
        if (canGoPrev) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (canGoNext) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalItems === 0) {
        return null;
    }

    return (
        <div className="pagination">
            <div className="pagination__info">
                Hiển thị <strong>{startIndex}</strong> – <strong>{endIndex}</strong> trong{' '}
                <strong>{totalItems}</strong>
            </div>

            <div className="pagination__controls">
                <button
                    className="pagination__btn"
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    aria-label="Trang trước"
                >
                    Trước
                </button>

                <div className="pagination__current">
                    Trang {currentPage} / {totalPages}
                </div>

                <button
                    className="pagination__btn"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    aria-label="Trang sau"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default Pagination;
