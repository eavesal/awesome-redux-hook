// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const env = process.env.NODE_ENV

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
}

const reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux',
}

const reactReduxExternal = {
  root: 'ReactRedux',
  commonjs2: 'react-redux',
  commonjs: 'react-redux',
  amd: 'react-redux',
}

const reduxSagaExternal = {
  root: 'ReduxSaga',
  commonjs2: 'redux-saga',
  commonjs: 'redux-saga',
  amd: 'redux-saga',
}

const config = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'awesome-redux-hook.js',
    library: 'AwesomeReduxHook',
    libraryTarget: 'umd',
  },
  mode: env,
  devtool: env === 'development' ? 'source-map' : undefined,
  externals: {
    react: reactExternal,
    redux: reduxExternal,
    'react-redux': reactReduxExternal,
    'redux-saga': reduxSagaExternal,
  },
  resolve: {
    extensions: ['.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
}

module.exports = config
