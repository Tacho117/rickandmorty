import { Link } from 'react-router-dom';

// Página estática del Shell. No es un microfrontend aparte: no tiene lógica de negocio
// ni llama a la API, así que separarla en otra app solo agregaría complejidad.
const MICROFRONTENDS = [
  {
    name: 'MF-Shell',
    port: 3000,
    color: 'yellow',
    text: 'Contenedor: navbar, footer, rutas y aislamiento de errores de cada remoto.',
  },
  {
    name: 'MF-Characters',
    port: 3001,
    color: 'cyan',
    text: 'Listado en tarjetas con filtros por nombre, estado y especie, y paginación.',
  },
  {
    name: 'MF-CharacterDetail',
    port: 3002,
    color: 'pink',
    text: 'Información ampliada del personaje y los episodios donde aparece.',
  },
];

const STACK = [
  'React 18',
  'React Router 6',
  'Webpack 5 · Module Federation',
  'Jest + Testing Library',
  'Docker + nginx',
];

export default function AboutPage() {
  return (
    <section className="about">
      <header className="about__hero">
        <h1>Acerca del proyecto</h1>
        <p>
          Explorador de personajes de Rick and Morty construido con <strong>microfrontends</strong>: tres
          aplicaciones React independientes que se integran en el navegador con Module Federation.
        </p>
      </header>

      <h2 className="about__subtitle">Los 3 microfrontends</h2>
      <div className="about__grid">
        {MICROFRONTENDS.map((mf) => (
          <article key={mf.name} className={`about__card about__card--${mf.color}`}>
            <span className="about__port">:{mf.port}</span>
            <h3>{mf.name}</h3>
            <p>{mf.text}</p>
          </article>
        ))}
      </div>

      <h2 className="about__subtitle">Tecnologías</h2>
      <ul className="about__stack">
        {STACK.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <Link to="/" className="shell-btn">
        Ver personajes →
      </Link>
    </section>
  );
}
