import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCharacters } from './hooks/useCharacters';
import { useDebounce } from './hooks/useDebounce';
import CharacterCard from './components/CharacterCard';
import Filters from './components/Filters';
import Pagination from './components/Pagination';
import { LoadingGrid, ErrorState, EmptyState } from './components/StatusViews';
import './styles.css';

// Componente expuesto vía Module Federation.
// Los filtros y la página viven en la URL (?name=rick&page=2): así, al volver del detalle,
// el usuario encuentra la lista tal como la dejó y los links se pueden compartir.
export default function CharactersApp() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const status = searchParams.get('status') || '';
  const species = searchParams.get('species') || '';
  const nameInUrl = searchParams.get('name') || '';

  // El input de nombre es local para que escribir sea fluido; se sincroniza a la URL con debounce
  const [nameInput, setNameInput] = useState(nameInUrl);
  const debouncedName = useDebounce(nameInput, 400);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, String(value));
      else next.delete(key);
    });
    // Cualquier cambio de filtro regresa a la página 1
    if (!('page' in changes)) next.delete('page');
    setSearchParams(next);
  };

  useEffect(() => {
    if (debouncedName !== nameInUrl) updateParams({ name: debouncedName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  // Si la URL cambia desde fuera (un enlace del menú del Shell o el botón "atrás"), el input la sigue.
  // Cuando el cambio lo provocó el propio debounce, nameInUrl === debouncedName y no se toca nada.
  useEffect(() => {
    if (nameInUrl !== debouncedName) setNameInput(nameInUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameInUrl]);

  const { characters, totalPages, totalCount, loading, error, retry } = useCharacters(
    { name: nameInUrl, status, species },
    page
  );

  const handleFilterChange = (field, value) => {
    if (field === 'name') setNameInput(value);
    else updateParams({ [field]: value });
  };

  const handleClear = () => {
    setNameInput('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage > 1 ? nextPage : '' });
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  let content;
  if (loading) content = <LoadingGrid />;
  else if (error) content = <ErrorState message={error.message} onRetry={retry} />;
  else if (characters.length === 0) content = <EmptyState />;
  else {
    content = (
      <>
        <p className="rm-results-count">{totalCount} personajes encontrados</p>
        <div className="rm-grid">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onSelect={(id) => navigate(`/character/${id}`)}
            />
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <section className="rm-characters">
      <header className="rm-characters__header">
        <h1>Personajes</h1>
        <p>Explora el multiverso y filtra por nombre, estado o especie.</p>
      </header>
      <Filters
        name={nameInput}
        status={status}
        species={species}
        onChange={handleFilterChange}
        onClear={handleClear}
      />
      {content}
    </section>
  );
}
