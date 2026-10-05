const LABELS = { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' };

export default function StatusBadge({ status }) {
  const modifier = (status || 'unknown').toLowerCase();
  return (
    <span className={`rmd-status rmd-status--${modifier}`}>
      <span className="rmd-status__dot" aria-hidden="true" />
      {LABELS[status] || status}
    </span>
  );
}
