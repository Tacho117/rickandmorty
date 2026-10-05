import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CharacterDetailApp from '../CharacterDetailApp';
import { getCharacterById, getEpisodesByUrls } from '../services/characterService';

jest.mock('../services/characterService');

const rick = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
  image: 'rick.png',
  episode: ['https://rickandmortyapi.com/api/episode/1', 'https://rickandmortyapi.com/api/episode/2'],
};

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/character/:id" element={<CharacterDetailApp />} />
      </Routes>
    </MemoryRouter>
  );

describe('CharacterDetailApp', () => {
  afterEach(() => jest.resetAllMocks());

  it('lee el id de la URL y muestra el detalle con sus episodios', async () => {
    getCharacterById.mockResolvedValue(rick);
    getEpisodesByUrls.mockResolvedValue([
      { id: 1, name: 'Pilot', episode: 'S01E01', air_date: 'December 2, 2013' },
      { id: 2, name: 'Lawnmower Dog', episode: 'S01E02', air_date: 'December 9, 2013' },
    ]);

    renderAt('/character/1');

    expect(screen.getByLabelText('Cargando personaje')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
    expect(getCharacterById).toHaveBeenCalledWith('1', expect.anything());
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('S01E02')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Aparece en 2 episodios' })).toBeInTheDocument();
  });

  it('muestra "no encontrado" cuando la API responde 404', async () => {
    const notFound = Object.assign(new Error('No existe un personaje con id 9999'), { status: 404 });
    getCharacterById.mockRejectedValue(notFound);

    renderAt('/character/9999');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Personaje no encontrado');
    expect(screen.queryByRole('button', { name: 'Reintentar' })).not.toBeInTheDocument();
  });
});
