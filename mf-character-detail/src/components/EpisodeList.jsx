export default function EpisodeList({ episodes }) {
  if (episodes.length === 0) {
    return <p className="rmd-muted">Este personaje no aparece en ningún episodio.</p>;
  }

  return (
    <ul className="rmd-episodes" aria-label="Episodios">
      {episodes.map((ep) => (
        <li key={ep.id} className="rmd-episode">
          <span className="rmd-episode__code">{ep.episode}</span>
          <span className="rmd-episode__name">{ep.name}</span>
          <span className="rmd-episode__date">{ep.air_date}</span>
        </li>
      ))}
    </ul>
  );
}
