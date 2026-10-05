module.exports = {
  testEnvironment: 'jsdom', // simula un navegador (document, window) dentro de Node
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Jest no entiende CSS: cada import de .css se reemplaza por un objeto vacío
  moduleNameMapper: { '\.css$': '<rootDir>/test/styleMock.js' },
};
