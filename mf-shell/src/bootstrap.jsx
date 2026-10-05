import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

// Punto de entrada del Shell: monta React en <div id="root">.
// El Shell es el ÚNICO que crea el Router; los remotos usan este mismo Router
// gracias a que react-router-dom está compartido como singleton.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
