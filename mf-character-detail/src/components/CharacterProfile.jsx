import StatusBadge from './StatusBadge';

export default function CharacterProfile({ character, episodeCount }) {
  const facts = [
    ['Especie', character.species],
    ['Tipo', character.type || '—'],
    ['Género', character.gender],
    ['Origen', character.origin?.name],
    ['Última ubicación', character.location?.name],
    ['Episodios', episodeCount],
  ];

  return (
    <article className="rmd-profile">
      <img className="rmd-profile__img" src={character.image} alt={character.name} />
      <div className="rmd-profile__info">
        <h1 className="rmd-profile__name">{character.name}</h1>
        <StatusBadge status={character.status} />
        <dl className="rmd-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
