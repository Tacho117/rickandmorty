const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const { dependencies } = require('./package.json');

// Dónde viven los remotos. El NAVEGADOR del usuario los descarga, por eso son URLs públicas
// (localhost:3001/3002), no nombres internos de Docker. Se pueden cambiar al construir.
const CHARACTERS_URL = process.env.CHARACTERS_URL || 'http://localhost:3001';
const DETAIL_URL = process.env.DETAIL_URL || 'http://localhost:3002';

module.exports = (_env, argv) => ({
  entry: './src/index.js',
  mode: argv.mode || 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
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
    port: 3000,
    historyApiFallback: true, // cualquier ruta (/character/1) devuelve index.html
    client: {
      overlay: {
        // Los errores en tiempo de ejecución (ej. un remoto caído) ya los manejan los ErrorBoundary
        // y el logger; el overlay de desarrollo los taparía. Los errores de compilación sí se muestran.
        runtimeErrors: false,
      },
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      // "alias local": "nombreGlobalDelRemoto@url/remoteEntry.js"
      remotes: {
        mfCharacters: `mfCharacters@${CHARACTERS_URL}/remoteEntry.js`,
        mfCharacterDetail: `mfCharacterDetail@${DETAIL_URL}/remoteEntry.js`,
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] },
        'react-router-dom': { singleton: true, requiredVersion: dependencies['react-router-dom'] },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
});
