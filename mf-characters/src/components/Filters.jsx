const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'alive', label: 'Vivo' },
  { value: 'dead', label: 'Muerto' },
  { value: 'unknown', label: 'Desconocido' },
];

const SPECIES_OPTIONS = [
  '', 'Human', 'Alien', 'Humanoid', 'Robot', 'Animal',
  'Mythological Creature', 'Poopybutthole', 'Cronenberg', 'Disease', 'unknown',
];

export default function Filters({ name, status, species, onChange, onClear }) {
  const hasFilters = Boolean(name || status || species);

  return (
    <form className="rm-filters" role="search" onSubmit={(e) => e.preventDefault()}>
      <label className="rm-field">
        <span>Nombre</span>
        <input
          type="search"
          placeholder="Ej. Rick"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </label>

      <label className="rm-field">
        <span>Estado</span>
        <select value={status} onChange={(e) => onChange('status', e.target.value)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      <label className="rm-field">
        <span>Especie</span>
        <select value={species} onChange={(e) => onChange('species', e.target.value)}>
          {SPECIES_OPTIONS.map((opt) => (
            <option key={opt || 'all'} value={opt}>{opt || 'Todas'}</option>
          ))}
        </select>
      </label>

      <button type="button" className="rm-btn rm-btn--ghost" onClick={onClear} disabled={!hasFilters}>
        Limpiar
      </button>
    </form>
  );
}
