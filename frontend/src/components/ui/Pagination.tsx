interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between p-4 bg-white border-t border-slate-200">
    <button 
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md disabled:opacity-50 hover:bg-slate-200"
    >
      Précédent
    </button>
    <span className="text-sm text-slate-500 font-medium">Page {currentPage} sur {totalPages}</span>
    <button 
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-md disabled:opacity-50 hover:bg-slate-200"
    >
      Suivant
    </button>
  </div>
);