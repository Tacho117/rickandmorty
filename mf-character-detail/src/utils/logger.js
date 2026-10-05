// Logger estructurado: cada log es un objeto JSON con campos fijos.
// Ventaja vs console.log("texto"): se puede filtrar/buscar por campo en herramientas
// como Datadog, Kibana o Sentry, y el campo "service" dice de qué microfrontend viene.
const SERVICE = 'mf-character-detail';

function write(level, event, context = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE,
    event,
    ...context,
  };

  // En las pruebas no imprimimos para no ensuciar la salida
  if (process.env.NODE_ENV !== 'test') {
    const method = level === 'debug' ? 'log' : level;
    // eslint-disable-next-line no-console
    console[method](JSON.stringify(entry));
  }
  return entry;
}

export const logger = {
  debug: (event, context) => write('debug', event, context),
  info: (event, context) => write('info', event, context),
  warn: (event, context) => write('warn', event, context),
  error: (event, context) => write('error', event, context),
};
