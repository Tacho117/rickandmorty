import { useEffect, useState } from 'react';
import { getCharacterById, getEpisodesByUrls } from '../services/characterService';
import { logger } from '../utils/logger';

export function useCharacterDetail(id) {
  const [state, setState] = useState({ character: null, episodes: [], loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return undefined;
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      setState({ character: null, episodes: [], loading: true, error: null });
      try {
        // Peticiones dependientes: necesitamos el personaje para saber qué episodios pedir
        const character = await getCharacterById(id, { signal });
        const episodes = await getEpisodesByUrls(character.episode, { signal });
        setState({ character, episodes, loading: false, error: null });
      } catch (error) {
        if (error.name === 'AbortError') return;
        logger.error('load_character_detail_failed', { characterId: id, message: error.message });
        setState({ character: null, episodes: [], loading: false, error });
      }
    }

    load();
    return () => controller.abort();
  }, [id, reloadKey]);

  return { ...state, retry: () => setReloadKey((key) => key + 1) };
}
