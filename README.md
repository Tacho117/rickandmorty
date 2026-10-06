# Rick and Morty Explorer: microfrontends con Module Federation

Aplicación web que consume la [Rick and Morty API](https://rickandmortyapi.com/), construida con una arquitectura de **microfrontends** (Webpack 5 Module Federation), React 18 con Hooks y despliegue local con Docker.

## Arquitectura

```
                 Navegador (http://localhost:3000)
                              │
                ┌─────────────▼─────────────┐
                │   MF-Shell (host) :3000   │  navbar · footer · ruteo · manejo de errores
                └──────┬─────────────┬──────┘
          remoteEntry.js             remoteEntry.js
                       │             │
     ┌─────────────────▼───┐   ┌─────▼──────────────────────┐
     │ MF-Characters :3001 │   │ MF-CharacterDetail :3002   │
     │ listado + filtros   │   │ detalle + episodios        │
     └─────────┬───────────┘   └─────────────┬──────────────┘
               └──────────┬──────────────────┘
                          ▼
              https://rickandmortyapi.com/api
```

| Microfrontend | Puerto | Responsabilidad | Expone |
|---|---|---|---|
| `mf-shell` | 3000 | App contenedora: layout común, ruteo (`/` y `/character/:id`), carga diferida y aislamiento de errores de cada remoto | (consume) |
| `mf-characters` | 3001 | Listado en tarjetas (imagen, nombre, género, estado, especie), filtros por nombre/estado/especie y paginación | `./CharactersApp` |
| `mf-character-detail` | 3002 | Información ampliada del personaje y lista de episodios donde aparece | `./CharacterDetailApp` |

### Decisiones clave
- **Comunicación entre MFs por la URL.** El Shell crea el único `BrowserRouter`; `react-router-dom` se comparte como *singleton*, así que los remotos usan el mismo router. MF-Characters navega a `/character/:id` y MF-CharacterDetail lee el `id` de la URL. No hay acoplamiento directo entre remotos.
- **Filtros en la URL** (`?name=rick&status=alive&page=2`): al volver del detalle se conserva la búsqueda y los enlaces se pueden compartir.
- **Dependencias compartidas como singleton** (`react`, `react-dom`, `react-router-dom`): una sola copia en el navegador. Dos copias de React rompen los hooks.
- **Aislamiento de fallos:** cada remoto se monta dentro de `RemoteSlot` (`Suspense` + `ErrorBoundary`). Si un MF está caído, solo esa zona muestra un error y el resto del Shell sigue funcionando.
- **Estilos aislados por prefijo** (`rm-`, `rmd-`, `shell-`) para evitar choques de CSS entre MFs.
- **Tema compartido con variables CSS:** el Shell define los colores, fuentes y sombras (`--ink`, `--yellow`, `--shadow`…) y los remotos los usan con `var(--x, respaldo)`. Así toda la app luce igual sin compartir archivos CSS, y cada remoto se ve bien también en modo standalone.
- **Menú con accesos rápidos por estado** (`/?status=alive`): como los filtros viven en la URL, el Shell abre la lista ya filtrada con un simple enlace, sin acoplarse al código de MF-Characters.

### Estructura de cada remoto (separación de lógica, UI y servicios)
```
src/
├── components/   UI pura: recibe props y pinta (sin fetch ni estado de negocio)
├── hooks/        Lógica: estado, efectos, AbortController, debounce
├── services/     Acceso a la API (único lugar que conoce las URLs)
├── utils/        Logger estructurado
├── __tests__/    Pruebas con React Testing Library
├── bootstrap.jsx Arranque en modo standalone
└── index.js      import('./bootstrap'), requerido por Module Federation
```

## Requisitos
- Node.js 20 o superior y npm 10 o superior (para desarrollo local)
- Docker y Docker Compose (para el despliegue)

## Opción 1: Docker (recomendada)

```bash
docker compose up --build
```

Abre **http://localhost:3000**.

- Cada MF tiene su propio `Dockerfile` multi-etapa: Node instala, **corre las pruebas** y compila; **nginx** sirve los archivos estáticos. Si una prueba falla, la imagen no se construye.
- Los remotos tienen `HEALTHCHECK` sobre su `remoteEntry.js`. El Shell arranca hasta que ambos están sanos (`depends_on: condition: service_healthy`).
- Para detener todo: `docker compose down`.

## Opción 2: Desarrollo local

```bash
npm run install:all   # instala dependencias de los 3 MFs
npm start             # levanta los 3 servidores en paralelo
```

| URL | Qué ves |
|---|---|
| http://localhost:3000 | App completa (Shell + remotos) |
| http://localhost:3001 | MF-Characters en modo standalone |
| http://localhost:3002/character/1 | MF-CharacterDetail en modo standalone |

### Correr cada microfrontend por separado
```bash
cd mf-characters && npm start          # :3001
cd mf-character-detail && npm start    # :3002
cd mf-shell && npm start               # :3000 (necesita los remotos arriba)
```

Si el puerto 3000 está ocupado, el Shell puede correr en otro sin cambiar nada más (los remotos aceptan peticiones de cualquier origen):
```bash
cd mf-shell && npx webpack serve --mode development --port 3010
```

### Variables de entorno (tiempo de compilación)
| Variable | MF | Default | Uso |
|---|---|---|---|
| `CHARACTERS_URL` | shell | `http://localhost:3001` | Dónde buscar MF-Characters |
| `DETAIL_URL` | shell | `http://localhost:3002` | Dónde buscar MF-CharacterDetail |
| `PUBLIC_URL` | remotos | `http://localhost:300X/` | URL pública de los archivos del remoto |

## Pruebas

```bash
npm test   # corre las pruebas de los 3 microfrontends

# o por separado
cd mf-shell && npm test
cd mf-characters && npm test
cd mf-character-detail && npm test
```

18 pruebas con **Jest + React Testing Library**. No dependen de internet: en los remotos se mockea la capa de servicios y en el Shell los remotos se sustituyen por componentes falsos (`moduleNameMapper`).

| Archivo | Qué verifica |
|---|---|
| `mf-shell/.../App.test.jsx` | Layout común; `/` carga MF-Characters (con su indicador de carga); `/character/:id` carga MF-CharacterDetail y le comparte el Router; página "Acerca de"; página 404 |
| `mf-shell/.../Layout.test.jsx` | El menú hamburguesa abre y cierra (también con Escape), se cierra al navegar, marca la opción activa; accesos rápidos por estado; footer con el año actual |
| `mf-shell/.../RemoteSlot.test.jsx` | Suspense muestra la carga; si un remoto no se puede descargar, el ErrorBoundary aísla el error, lo registra en el logger y el resto de la página sigue visible |
| `mf-characters/.../CharacterCard.test.jsx` | La tarjeta muestra imagen, nombre, estado, especie y género; el clic avisa al padre con el `id` |
| `mf-characters/.../CharactersApp.test.jsx` | Estado de carga → tarjetas; error → botón Reintentar → recupera; filtros sin resultados → mensaje vacío; si la URL cambia desde fuera (menú o botón atrás), el buscador se actualiza |
| `mf-character-detail/.../CharacterDetailApp.test.jsx` | Lee el `id` de la URL y muestra detalle y episodios; un 404 muestra "Personaje no encontrado" |

## Manejo de errores y logging

- **`httpClient.js`** centraliza `fetch` y convierte fallos en un `ApiError` tipado (`status`, `url`):
  - error de red → mensaje amigable;
  - HTTP no-2xx → `ApiError` con el código;
  - `AbortError` (petición cancelada a propósito) → no se reporta como error.
- **404 con significado:** en el listado, un 404 de la API significa "sin coincidencias" y se muestra como estado vacío. En el detalle significa "el personaje no existe".
- **Estados de UI:** carga (skeletons o spinner), error con **Reintentar** y vacío.
- **Race conditions:** cada efecto crea un `AbortController` y en su *cleanup* cancela la petición anterior, así una respuesta vieja nunca pisa a la nueva.
- **Logger estructurado** (`utils/logger.js`): cada evento es un JSON con `timestamp`, `level`, `service` (qué MF), `event` y contexto:
  ```json
  {"timestamp":"2026-10-01T23:05:12.345Z","level":"info","service":"mf-characters","event":"http_success","url":"https://rickandmortyapi.com/api/character?page=1","status":200,"durationMs":182}
  ```
  Este formato está listo para enviarse a Datadog, Kibana o Sentry y filtrarse por campo.

## Diseño
- Estilo **cómic / neo-brutalista**: bordes negros gruesos, sombras duras, colores planos y tipografías Bangers (títulos) y Nunito (texto).
- **Responsivo:** en pantallas de hasta 860 px el navbar cambia a un **menú hamburguesa** accesible (`aria-expanded`, `aria-controls`, se cierra con Escape o al navegar). Los filtros y las tarjetas se reacomodan en celular.
- Respeta `prefers-reduced-motion`: sin animaciones para quien lo pide en su sistema.
- Página **Acerca de** (`/about`) en el Shell, con los 3 microfrontends y el stack.

## Stack
React 18 · React Router 6 · Webpack 5 (Module Federation) · Babel · Jest · React Testing Library · Docker · nginx · CSS puro (responsivo)

## Mejoras posibles
- Compartir un *design system* como un MF adicional en lugar de duplicar `StatusBadge`.
- Caché de peticiones (React Query o SWR).
- Pruebas end-to-end (Playwright) sobre el ecosistema completo con Docker.
- URLs de remotos configurables en tiempo de ejecución (manifest JSON) en lugar de en compilación.
