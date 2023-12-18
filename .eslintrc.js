module.exports = {
    'extends': 'eslint:recommended',
    'env': {
        'node': true,
        'es6': true
    },
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-cond-assign': ['error', 'always'],
    }
};