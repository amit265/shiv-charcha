import expoConfig from 'eslint-config-expo/flat.js';
import globals from 'globals';

export default [
  ...expoConfig,
  {
    ignores: ['node_modules/', '.expo/', 'dist/', 'build/'],
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];

