import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from '../components/Layout';

const renderAt = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <p>Contenido</p>
      </Layout>
    </MemoryRouter>
  );

describe('Layout (navbar con menú hamburguesa)', () => {
  it('el botón hamburguesa abre y cierra el menú, y Escape también lo cierra', () => {
    renderAt('/');
    const toggle = screen.getByRole('button', { name: 'Abrir menú' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Principal' })).toHaveClass('is-open');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('al elegir una opción navega, la marca como activa y cierra el menú', () => {
    renderAt('/');
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));

    fireEvent.click(screen.getByRole('link', { name: 'Vivos' }));

    expect(screen.getByRole('link', { name: 'Vivos' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Personajes' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('los accesos rápidos abren la lista ya filtrada por estado', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: 'Vivos' })).toHaveAttribute('href', '/?status=alive');
    expect(screen.getByRole('link', { name: 'Muertos' })).toHaveAttribute('href', '/?status=dead');
    expect(screen.getByRole('link', { name: 'Desconocidos' })).toHaveAttribute('href', '/?status=unknown');
    expect(screen.getByRole('link', { name: 'Personajes' })).toHaveAttribute('aria-current', 'page');
  });

  it('el footer muestra el año actual y la fuente de los datos', () => {
    renderAt('/');

    expect(screen.getByRole('contentinfo')).toHaveTextContent(`© ${new Date().getFullYear()} Rick & Morty Explorer`);
    expect(screen.getByRole('link', { name: 'rickandmortyapi.com' })).toHaveAttribute(
      'href',
      'https://rickandmortyapi.com'
    );
  });
});
