// Pagination.tsx
import React from 'react';

type PaginationProps = {
  page: number;
  onPageChange: (newPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, onPageChange }) => {
  return (
    <div className="pagination">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 0} className="nes-btn">
        Prev
      </button>
      <button onClick={() => onPageChange(page + 1)} className="nes-btn">
        Next
      </button>
    </div>
  );
};

export default Pagination;
