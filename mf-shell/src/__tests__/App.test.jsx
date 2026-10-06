import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Los remotos reales se sustituyen por los de test/remotes (ver moduleNameMapper en jest.config.js)
const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );

describe('App (Shell)', () => {
  it('en "/" muestra el layout común y carga MF-Characters', async () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: /rick & morty explorer/i })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('rickandmortyapi.com');
    expect(screen.getByText('Cargando MF-Characters…')).toBeInTheDocument();
    expect(await screen.findByText('Remoto MF-Characters')).toBeInTheDocument();
  });

  it('en "/character/:id" carga MF-CharacterDetail y le comparte el Router', async () => {
    renderAt('/character/7');

    expect(await screen.findByText('Remoto MF-CharacterDetail id=7')).toBeInTheDocument();
    expect(screen.queryByText('Remoto MF-Characters')).not.toBeInTheDocument();
  });

  it('en "/about" muestra la página Acerca de, que vive en el propio Shell', () => {
    renderAt('/about');

    expect(screen.getByRole('heading', { level: 1, name: 'Acerca del proyecto' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'MF-Characters' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Acerca de' })).toHaveAttribute('aria-current', 'page');
  });

  it('muestra una página 404 en rutas desconocidas', () => {
    renderAt('/no-existe');

    expect(screen.getByText('Esta página no existe.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir a personajes' })).toHaveAttribute('href', '/');
  });
});
