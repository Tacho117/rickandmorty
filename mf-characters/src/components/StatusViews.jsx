export function LoadingGrid({ count = 8 }) {
  return (
    <div className="rm-grid" aria-busy="true" aria-label="Cargando personajes">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rm-card rm-card--skeleton" />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rm-state rm-state--error" role="alert">
      <p>Ocurrió un problema al cargar los personajes.</p>
      <p className="rm-state__detail">{message}</p>
      <button type="button" className="rm-btn" onClick={onRetry}>Reintentar</button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="rm-state">
      <p>No se encontraron personajes con esos filtros.</p>
    </div>
  );
}
