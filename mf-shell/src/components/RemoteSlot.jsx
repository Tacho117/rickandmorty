import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

// "Enchufe" para un microfrontend remoto. Resuelve los 2 problemas de cargar código por red:
// 1. Mientras se descarga → Suspense muestra un indicador de carga.
// 2. Si el remoto está caído o falla al renderizar → ErrorBoundary muestra un error
//    SOLO en esa zona; el navbar y el resto del Shell siguen funcionando.
export default function RemoteSlot({ name, children }) {
  return (
    <ErrorBoundary name={name}>
      <Suspense
        fallback={
          <div className="shell-state" aria-busy="true">
            <span className="shell-spinner" aria-hidden="true" />
            <p>Cargando {name}…</p>
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
