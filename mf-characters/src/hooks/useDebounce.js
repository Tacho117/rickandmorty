import { useEffect, useState } from 'react';

// Espera a que el usuario deje de escribir antes de actualizar el valor.
// Evita disparar una petición a la API por cada tecla.
export function useDebounce(value, delayMs = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer); // si llega otra tecla, se cancela el timer anterior
  }, [value, delayMs]);

  return debounced;
}
