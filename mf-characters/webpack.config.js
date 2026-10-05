const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { dependencies } = require('./package.json');

const PORT = 3001;
// URL pública desde donde el NAVEGADOR descarga los archivos de este MF.
// Se puede cambiar al construir con la variable PUBLIC_URL (ej. en un servidor real).
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}/`;

module.exports = (_env, argv) => ({
  entry: './src/index.js',
  mode: argv.mode || 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: PUBLIC_URL,
    filename: '[name].[contenthash].js',
    clean: true,
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  devServer: {
    port: PORT,
    historyApiFallback: true, // cualquier ruta (/character/1) devuelve index.html
    headers: { 'Access-Control-Allow-Origin': '*' }, // el Shell (puerto 3000) descarga desde aquí
    // remoteEntry.js también carga el cliente de desarrollo de ESTE servidor dentro de la página del Shell.
    // Sin esto, su overlay taparía errores que ya manejan los ErrorBoundary (ej. otro remoto caído).
    client: { overlay: { runtimeErrors: false } },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfCharacters', // nombre global con el que el Shell encuentra a este MF
      filename: 'remoteEntry.js', // el "índice" que el Shell descarga primero
      exposes: {
        './CharactersApp': './src/CharactersApp.jsx',
      },
      // singleton: una sola copia de cada librería para toda la app.
      // Dos copias de React rompen los hooks; dos de react-router rompen el ruteo compartido.
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] },
        'react-router-dom': { singleton: true, requiredVersion: dependencies['react-router-dom'] },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
});
