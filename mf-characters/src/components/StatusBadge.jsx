const LABELS = { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' };

export default function StatusBadge({ status }) {
  const modifier = (status || 'unknown').toLowerCase();
  return (
    <span className={`rm-status rm-status--${modifier}`}>
      <span className="rm-status__dot" aria-hidden="true" />
      {LABELS[status] || status}
    </span>
  );
}
