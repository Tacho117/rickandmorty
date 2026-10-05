module.exports = {
  testEnvironment: 'jsdom', // simula un navegador (document, window) dentro de Node
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Jest no entiende CSS: cada import de .css se reemplaza por un objeto vacío
    '\\.css$': '<rootDir>/test/styleMock.js',
    // En pruebas no hay Module Federation: los remotos se reemplazan por componentes falsos
    '^mfCharacters/CharactersApp$': '<rootDir>/test/remotes/CharactersApp.jsx',
    '^mfCharacterDetail/CharacterDetailApp$': '<rootDir>/test/remotes/CharacterDetailApp.jsx',
  },
};
