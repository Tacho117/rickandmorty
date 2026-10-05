export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="rm-pagination" aria-label="Paginación">
      <button
        type="button"
        className="rm-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ← Anterior
      </button>
      <span className="rm-pagination__info">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        className="rm-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente →
      </button>
    </nav>
  );
}
