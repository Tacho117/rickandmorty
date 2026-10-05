// Babel traduce JSX y JavaScript moderno a algo que el navegador (o Jest) entiende.
module.exports = (api) => {
  const isTest = api.env('test');
  return {
    presets: [
      // En pruebas compilamos para la versión de Node instalada; en el navegador, para navegadores modernos
      ['@babel/preset-env', { targets: isTest ? { node: 'current' } : 'defaults and supports es6-module' }],
      // runtime "automatic": ya no hace falta escribir `import React from 'react'` en cada archivo
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
  };
};
