import { lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import RemoteSlot from './components/RemoteSlot';
import AboutPage from './pages/AboutPage';

// "mfCharacters/CharactersApp" NO es una carpeta local: Module Federation lo descarga
// en tiempo de ejecución desde http://localhost:3001/remoteEntry.js.
// lazy() hace que cada remoto se descargue solo cuando el usuario entra a su ruta.
const CharactersApp = lazy(() => import('mfCharacters/CharactersApp'));
const CharacterDetailApp = lazy(() => import('mfCharacterDetail/CharacterDetailApp'));

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <RemoteSlot name="MF-Characters">
              <CharactersApp />
            </RemoteSlot>
          }
        />
        <Route
          path="/character/:id"
          element={
            <RemoteSlot name="MF-CharacterDetail">
              <CharacterDetailApp />
            </RemoteSlot>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="*"
          element={
            <div className="shell-state">
              <p>Esta página no existe.</p>
              <Link to="/">Ir a personajes</Link>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
