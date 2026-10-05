import { fetchJson, ApiError } from './httpClient';

// Capa de servicios: el ÚNICO lugar de este MF que conoce las URLs de la API.
// Los componentes nunca llaman fetch directamente.
export const API_BASE = 'https://rickandmortyapi.com/api';

// { page: 2, name: 'rick' } → ".../character?page=2&name=rick"
export function buildCharactersUrl({ page = 1, name = '', status = '', species = '' } = {}) {
  const params = new URLSearchParams({ page: String(page) });
  if (name) params.set('name', name);
  if (status) params.set('status', status);
  if (species) params.set('species', species);
  return `${API_BASE}/character?${params.toString()}`;
}

export async function getCharacters(filters = {}, { signal } = {}) {
  try {
    const data = await fetchJson(buildCharactersUrl(filters), { signal });
    return {
      characters: data.results,
      totalPages: data.info.pages,
      totalCount: data.info.count,
    };
  } catch (error) {
    // La API responde 404 cuando un filtro no tiene coincidencias: para el usuario es "sin resultados"
    if (error instanceof ApiError && error.status === 404) {
      return { characters: [], totalPages: 0, totalCount: 0 };
    }
    throw error;
  }
}
