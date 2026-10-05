import { useEffect, useState } from 'react';
import { getCharacters } from '../services/characterService';
import { logger } from '../utils/logger';

const initialState = {
  characters: [],
  totalPages: 0,
  totalCount: 0,
  loading: true,
  error: null,
};

// Hook = capa de lógica. El componente solo recibe datos y estados; no sabe de fetch ni de la API.
export function useCharacters({ name, status, species }, page) {
  const [state, setState] = useState(initialState);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // AbortController evita "race conditions": si el usuario cambia el filtro rápido,
    // cancelamos la petición vieja para que no pise el resultado nuevo.
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    getCharacters({ name, status, species, page }, { signal: controller.signal })
      .then((data) => setState({ ...data, loading: false, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        logger.error('load_characters_failed', {
          filters: { name, status, species },
          page,
          message: error.message,
        });
        setState((prev) => ({ ...prev, loading: false, error }));
      });

    return () => controller.abort(); // cleanup del efecto
  }, [name, status, species, page, reloadKey]);

  const retry = () => setReloadKey((key) => key + 1);

  return { ...state, retry };
}
