module.exports = {
  configs: {
    base: {
      env: {
        es6: true,
      },
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'no-multi-spaces': 'error',
        'indent': ['error', 2],
        'curly': ['warn', 'error'],
        // debatable
        'quotes': ['warn', 'single'],
        'semi': ['warn', 'always'],
        //
        'comma-dangle': [
          'warn',
          {
            functions: 'always-multiline',
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
          },
        ],
        'object-curly-spacing': ['error', 'always'],
        //
        'max-statements-per-line': ['error', { max: 1 }],
        'max-depth': ['warn', 2],
        'max-lines': ['warn', 200],
        'max-lines-per-function': ['warn', 60],
        '@iameax/empty-lines': ['warn'],
        'padding-line-between-statements': [
          'error',
          {
            blankLine: 'always',
            prev: ['const', 'let', 'var'],
            next: '*',
          },
          {
            blankLine: 'always',
            prev: '*',
            next: ['const', 'let', 'var'],
          },
          {
            blankLine: 'always',
            prev: '*',
            next: ['export', 'return', 'block'],
          },
          {
            blankLine: 'any',
            prev: ['const', 'let', 'var'],
            next: ['const', 'let', 'var', 'return'],
          },
        ],
        // remove unused imports
        'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': 'off',
        //
        '@iameax/no-relative-parent-imports': ['warn', { baseUrl: 'src' }],
        'import/order': [
          'warn',
          {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            pathGroups: [
              {
                pattern: 'lodash/**',
                group: 'external',
                position: 'before',
              },
              {
                pattern: './*.*css',
                group: 'sibling',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
            'newlines-between': 'always',
          },
        ],
      },
      plugins: [
        'import',
        '@iameax',
        'unused-imports',
      ],
    },
    react: {
      rules: {
        'react/prop-types': [0],
        'react/display-name': 'off',
        'react/self-closing-comp': ['error', { component: true }],
        'react/jsx-indent-props': [2, 2],
        'react/jsx-indent': [2, 2],
        'react/jsx-curly-spacing': [
          2,
          {
            when: 'never',
            children: { when: 'always' },
            attributes: false,
            spacing: {
              objectLiterals: 'never',
            },
          },
        ],
        'react/jsx-tag-spacing': [
          'error',
          {
            beforeSelfClosing: 'always',
          },
        ],
        'react/jsx-max-props-per-line': [1, { 'when': 'multiline' }],
        'react/jsx-wrap-multilines': [
          1,
          {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'ignore',
            logical: 'ignore',
            prop: 'ignore',
          },
        ],
        'react/jsx-first-prop-new-line': [1, 'multiline'],
        'react/jsx-closing-tag-location': [1],
        'react/jsx-one-expression-per-line': [1, { allow: 'literal' }],
        'react/jsx-closing-bracket-location': [1, { selfClosing: 'tag-aligned', nonEmpty: 'tag-aligned' }],
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    typescript: {
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
      settings: {
        'import/resolver': 'typescript',
      },
    }
  },
  rules: {
    'no-relative-parent-imports': require('./rules/no-relative-parent-imports'),
    'empty-lines': require('./rules/empty-lines')
  },
};
