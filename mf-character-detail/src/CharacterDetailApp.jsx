import { useNavigate, useParams } from 'react-router-dom';
import { useCharacterDetail } from './hooks/useCharacterDetail';
import CharacterProfile from './components/CharacterProfile';
import EpisodeList from './components/EpisodeList';
import './styles.css';

// Componente expuesto vía Module Federation.
// El id llega por la URL (/character/:id), que controla el Router del Shell.
// También acepta la prop characterId para poder usarse embebido o en pruebas.
export default function CharacterDetailApp({ characterId }) {
  const params = useParams();
  const navigate = useNavigate();
  const id = characterId ?? params.id;
  const { character, episodes, loading, error, retry } = useCharacterDetail(id);

  const goBack = () => {
    // Si el usuario llegó desde la lista, regresamos conservando filtros; si entró directo, vamos al inicio
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate('/');
  };

  let content;
  if (loading) {
    content = <div className="rmd-skeleton" aria-busy="true" aria-label="Cargando personaje" />;
  } else if (error) {
    content = (
      <div className="rmd-state rmd-state--error" role="alert">
        <p>{error.status === 404 ? 'Personaje no encontrado.' : 'No pudimos cargar el personaje.'}</p>
        <p className="rmd-muted">{error.message}</p>
        {error.status !== 404 && (
          <button type="button" className="rmd-btn" onClick={retry}>Reintentar</button>
        )}
      </div>
    );
  } else {
    content = (
      <>
        <CharacterProfile character={character} episodeCount={episodes.length} />
        <section className="rmd-section">
          <h2>Aparece en {episodes.length} episodio{episodes.length === 1 ? '' : 's'}</h2>
          <EpisodeList episodes={episodes} />
        </section>
      </>
    );
  }

  return (
    <div className="rmd-detail">
      <button type="button" className="rmd-back" onClick={goBack}>← Volver a personajes</button>
      {content}
    </div>
  );
}
