import { lazy } from 'react';
import { render, screen } from '@testing-library/react';
import RemoteSlot from '../components/RemoteSlot';
import { logger } from '../utils/logger';

describe('RemoteSlot', () => {
  beforeEach(() => {
    // React reporta en consola los errores que atrapa un ErrorBoundary; se silencian para no ensuciar la salida
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(logger, 'error');
  });
  afterEach(() => jest.restoreAllMocks());

  it('muestra el indicador de carga y luego el remoto', async () => {
    const Remote = lazy(() => Promise.resolve({ default: () => <p>Contenido remoto</p> }));

    render(
      <RemoteSlot name="MF-Prueba">
        <Remote />
      </RemoteSlot>
    );

    expect(screen.getByText('Cargando MF-Prueba…')).toBeInTheDocument();
    expect(await screen.findByText('Contenido remoto')).toBeInTheDocument();
  });

  it('si el remoto no se puede descargar, aísla el error, lo registra y el resto sigue visible', async () => {
    // Simula lo que pasa cuando remoteEntry.js no responde (MF caído)
    const RemoteCaido = lazy(() => Promise.reject(new Error('Loading script failed')));

    render(
      <>
        <nav>Navbar del Shell</nav>
        <RemoteSlot name="MF-Caido">
          <RemoteCaido />
        </RemoteSlot>
      </>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo cargar MF-Caido');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
    expect(screen.getByText('Navbar del Shell')).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalledWith(
      'remote_failed',
      expect.objectContaining({ remote: 'MF-Caido', message: 'Loading script failed' })
    );
  });
});
