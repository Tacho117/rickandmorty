import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CharacterDetailApp from './CharacterDetailApp';

// MODO STANDALONE: permite correr este MF solo (npm start → http://localhost:3002/character/1).
// Dentro del Shell este archivo NO se ejecuta.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/character/:id" element={<CharacterDetailApp />} />
        <Route path="*" element={<Navigate to="/character/1" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
