// @ts-nocheck
module.exports = (api) => {
  const isTest = api.env('test');
  
  return {
    presets: [
      ['@babel/preset-env', { 
        targets: isTest ? { node: 'current' } : 'defaults',
        modules: isTest ? 'commonjs' : false
      }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      isTest && '@babel/plugin-transform-modules-commonjs'
    ].filter(Boolean)
  };
};
