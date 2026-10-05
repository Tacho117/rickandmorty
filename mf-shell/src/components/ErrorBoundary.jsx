import { Component } from 'react';
import { logger } from '../utils/logger';

// Error Boundary: atrapa errores al RENDERIZAR sus hijos (incluido un remoto que no se pudo descargar)
// y muestra una pantalla de respaldo en vez de dejar la página en blanco.
// Es el único caso donde todavía se necesita un componente de clase:
// no existe un hook equivalente a componentDidCatch.
// OJO: no atrapa errores de fetch, setTimeout ni event handlers (esos se manejan con try/catch).
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    logger.error('remote_failed', {
      remote: this.props.name,
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="shell-state shell-state--error" role="alert">
          <p>No se pudo cargar <strong>{this.props.name}</strong>.</p>
          <p className="shell-muted">Verifica que el microfrontend esté corriendo e intenta de nuevo.</p>
          {/* Recargamos la página porque lazy() guarda en caché la descarga fallida */}
          <button type="button" className="shell-btn" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
