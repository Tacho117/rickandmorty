import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Link } from 'react-router-dom';
import CharactersApp from '../CharactersApp';
import { getCharacters } from '../services/characterService';

// Mockeamos la capa de servicios: la prueba no depende de internet ni de la API real
jest.mock('../services/characterService');

const renderApp = () =>
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CharactersApp />
    </MemoryRouter>
  );

describe('CharactersApp', () => {
  afterEach(() => jest.resetAllMocks());

  it('muestra el estado de carga y luego las tarjetas', async () => {
    getCharacters.mockResolvedValue({
      characters: [
        { id: 1, name: 'Rick Sanchez', image: 'r.png', gender: 'Male', status: 'Alive', species: 'Human' },
        { id: 2, name: 'Morty Smith', image: 'm.png', gender: 'Male', status: 'Alive', species: 'Human' },
      ],
      totalPages: 1,
      totalCount: 2,
    });

    renderApp();

    expect(screen.getByLabelText('Cargando personajes')).toBeInTheDocument();
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getByText('2 personajes encontrados')).toBeInTheDocument();
  });

  it('muestra el error y permite reintentar', async () => {
    getCharacters
      .mockRejectedValueOnce(new Error('La API respondió con error 500'))
      .mockResolvedValueOnce({
        characters: [{ id: 1, name: 'Rick Sanchez', image: 'r.png', gender: 'Male', status: 'Alive', species: 'Human' }],
        totalPages: 1,
        totalCount: 1,
      });

    renderApp();

    expect(await screen.findByRole('alert')).toHaveTextContent('error 500');
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('muestra un mensaje cuando no hay resultados', async () => {
    getCharacters.mockResolvedValue({ characters: [], totalPages: 0, totalCount: 0 });

    renderApp();

    expect(await screen.findByText(/no se encontraron personajes/i)).toBeInTheDocument();
  });

  it('si la URL cambia desde fuera (menú del Shell o "atrás"), el buscador de nombre se actualiza', async () => {
    getCharacters.mockResolvedValue({ characters: [], totalPages: 0, totalCount: 0 });

    render(
      <MemoryRouter initialEntries={['/?name=rick']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* Simula el enlace "Vivos" del menú del Shell */}
        <Link to="/?status=alive">Vivos</Link>
        <CharactersApp />
      </MemoryRouter>
    );

    const nameInput = screen.getByRole('searchbox', { name: /nombre/i });
    expect(nameInput).toHaveValue('rick');

    await userEvent.click(screen.getByRole('link', { name: 'Vivos' }));

    expect(nameInput).toHaveValue('');
    expect(screen.getByRole('combobox', { name: /estado/i })).toHaveValue('alive');
  });
});
