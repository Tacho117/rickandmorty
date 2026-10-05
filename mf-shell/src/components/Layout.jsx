import { Link, NavLink } from 'react-router-dom';

// Diseño común (navbar + footer): responsabilidad del Shell según el examen.
// "children" es una prop especial: todo lo que pongas entre <Layout> y </Layout>.
export default function Layout({ children }) {
  return (
    <div className="app">
      <header className="navbar">
        <div className="container navbar__inner">
          <Link to="/" className="navbar__brand">🛸 Rick & Morty Explorer</Link>
          <nav>
            <NavLink to="/" end className="navbar__link">Personajes</NavLink>
          </nav>
        </div>
      </header>
      <main className="container main">{children}</main>
      <footer className="footer">
        <div className="container">Datos de rickandmortyapi.com · Microfrontends con Module Federation</div>
      </footer>
    </div>
  );
}
