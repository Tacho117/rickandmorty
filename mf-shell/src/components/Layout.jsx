import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Diseño común (navbar + footer): responsabilidad del Shell según el examen.
// "children" es una prop especial: todo lo que pongas entre <Layout> y </Layout>.

// Los accesos por estado abren la lista ya filtrada (/?status=alive). Como MF-Characters
// guarda sus filtros en la URL, el Shell se "comunica" con él con un simple enlace.
const NAV_LINKS = [
  { label: 'Personajes', status: '' },
  { label: 'Vivos', status: 'alive' },
  { label: 'Muertos', status: 'dead' },
  { label: 'Desconocidos', status: 'unknown' },
];

// { status: 'alive' } → "/?status=alive"   ·   { status: '' } → "/"
const hrefOf = (link) => (link.status ? `/?status=${link.status}` : '/');

// Activo = estamos en la lista y el ?status= de la URL coincide con el del enlace.
// (NavLink no sirve aquí: solo compara la ruta "/" y marcaría los 4 a la vez.)
function isLinkActive(link, location) {
  if (location.pathname !== '/') return false;
  const status = new URLSearchParams(location.search).get('status') || '';
  return status === link.status;
}

export default function Layout({ children }) {
  const anioActual = new Date().getFullYear();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Al cambiar de página (clic en un enlace o botón "atrás") el menú se cierra solo
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  // Con el menú abierto, Escape lo cierra. El cleanup quita el listener al cerrarse
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <div className="app">
      <header className="navbar">
        <div className="container navbar__inner">
          <Link to="/" className="navbar__brand">
            <span className="navbar__portal" aria-hidden="true" />
            Rick & Morty <span>Explorer</span>
          </Link>

          <button
            type="button"
            className={`navbar__toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav id="menu-principal" className={`navbar__menu ${menuOpen ? 'is-open' : ''}`} aria-label="Principal">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link, location);
              return (
                <Link
                  key={link.label}
                  to={hrefOf(link)}
                  className={`navbar__link ${active ? 'is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container main">{children}</main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© {anioActual} Rick & Morty Explorer</span>
          <span>
            Datos de <a href="https://rickandmortyapi.com" target="_blank" rel="noreferrer">rickandmortyapi.com</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
