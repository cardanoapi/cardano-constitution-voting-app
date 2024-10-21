// Most of the directories listed below in importOrder are just an example. As we add more directories, we should update this file.
/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '^node:$',
    '',
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/types$',
    '^@/types/(.*)$',
    '^@/config$',
    '^@/config/(.*)$',
    '^@/paths$',
    '^@/data/(.*)$',
    '^@/lib/(.*)$',
    '^@/actions/(.*)$',
    '^@/contexts/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/(.*)$',
    '^@/styles/(.*)$',
    '',
    '^[./]',
  ],
};

export default config;
