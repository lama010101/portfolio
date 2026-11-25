import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.astro/**', 'public/**', '**/*.astro'],
  },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly', document: 'readonly', localStorage: 'readonly',
        navigator: 'readonly', performance: 'readonly', requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly', IntersectionObserver: 'readonly', URL: 'readonly',
        URLSearchParams: 'readonly', history: 'readonly', console: 'readonly',
        process: 'readonly', import: 'readonly', require: 'readonly', module: 'readonly',
        __dirname: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
        setInterval: 'readonly', clearInterval: 'readonly', Response: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      semi: ['warn', 'always'],
      'no-multiple-empty-lines': ['warn', { max: 2 }],
    },
  },
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'off',
      semi: ['warn', 'always'],
      'no-multiple-empty-lines': ['warn', { max: 2 }],
    },
  },
];
