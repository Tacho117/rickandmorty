import { fetchJson, ApiError } from './httpClient';

// Capa de servicios: el ÚNICO lugar de este MF que conoce las URLs de la API.
export const API_BASE = 'https://rickandmortyapi.com/api';

export async function getCharacterById(id, { signal } = {}) {
  try {
    return await fetchJson(`${API_BASE}/character/${id}`, { signal });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError(`No existe un personaje con id ${id}`, { status: 404, url: error.url });
    }
    throw error;
  }
}

// ".../api/episode/28" → "28"
export function extractIds(urls = []) {
  return urls.map((url) => url.split('/').pop()).filter(Boolean);
}

// Una sola petición para todos los episodios: /episode/1,2,3
export async function getEpisodesByUrls(urls, { signal } = {}) {
  const ids = extractIds(urls);
  if (ids.length === 0) return [];

  const data = await fetchJson(`${API_BASE}/episode/${ids.join(',')}`, { signal });
  // Con un solo id la API regresa un objeto; con varios, un arreglo
  return Array.isArray(data) ? data : [data];
}
