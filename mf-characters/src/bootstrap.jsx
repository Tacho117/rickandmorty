import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CharactersApp from './CharactersApp';

// MODO STANDALONE: permite correr este MF solo (npm start → http://localhost:3001)
// para desarrollarlo sin depender del Shell.
// Dentro del Shell este archivo NO se ejecuta: el Shell importa CharactersApp directamente
// y lo envuelve con SU Router.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<CharactersApp />} />
        <Route
          path="/character/:id"
          element={<p>Modo standalone: el detalle vive en MF-CharacterDetail. Abre el Shell en http://localhost:3000.</p>}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
