import StatusBadge from './StatusBadge';

// Componente de presentación puro: recibe props y pinta. Sin estado, sin fetch.
export default function CharacterCard({ character, onSelect }) {
  const { id, name, image, gender, status, species } = character;

  return (
    <button
      type="button"
      className="rm-card"
      onClick={() => onSelect(id)}
      aria-label={`Ver detalle de ${name}`}
    >
      <img className="rm-card__img" src={image} alt={name} loading="lazy" />
      <div className="rm-card__body">
        <h3 className="rm-card__name">{name}</h3>
        <StatusBadge status={status} />
        <dl className="rm-card__meta">
          <div>
            <dt>Especie</dt>
            <dd>{species}</dd>
          </div>
          <div>
            <dt>Género</dt>
            <dd>{gender}</dd>
          </div>
        </dl>
      </div>
    </button>
  );
}
