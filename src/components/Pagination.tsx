import React from "react";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ page, pageCount, onPageChange }) => {
  return (
    <div className="pagination">
      {/* Botón de 'Prev' deshabilitado si estamos en la primera página */}
      <button 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 0} 
        className="nes-btn"
      >
        Prev
      </button>

      {/* Visualización de la página actual y total */}
      <span>Page {page + 1} of {pageCount}</span>

      {/* Botón de 'Next' deshabilitado si estamos en la última página */}
      <button 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === pageCount - 1} 
        className="nes-btn"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
