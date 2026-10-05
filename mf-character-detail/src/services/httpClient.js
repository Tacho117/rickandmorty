import { logger } from '../utils/logger';

// Error tipado: el resto de la app puede preguntar error.status en vez de parsear mensajes.
export class ApiError extends Error {
  constructor(message, { status, url } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
  }
}

export async function fetchJson(url, { signal } = {}) {
  const startedAt = Date.now();
  let response;

  try {
    response = await fetch(url, { signal });
  } catch (error) {
    // Cancelación intencional (el usuario cambió el filtro): no es un error que reportar
    if (error.name === 'AbortError') throw error;
    logger.error('network_error', { url, message: error.message });
    throw new ApiError('No se pudo conectar con el servidor. Revisa tu conexión.', { url });
  }

  const durationMs = Date.now() - startedAt;

  if (!response.ok) {
    logger.warn('http_error', { url, status: response.status, durationMs });
    throw new ApiError(`La API respondió con error ${response.status}`, {
      status: response.status,
      url,
    });
  }

  logger.info('http_success', { url, status: response.status, durationMs });
  return response.json();
}
