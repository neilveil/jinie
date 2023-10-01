import { defineConfig } from 'rollup'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'
import fs from 'fs'

fs.rmSync('dist', { force: true, recursive: true })

export default defineConfig({
  input: 'src/lib/index.tsx',
  output: [
    {
      file: 'dist/jinie.js',
      format: 'umd',
      name: 'Jinie',
      globals: {
        react: 'React',
        cropperjs: 'Cropper',
        'compression-loop': 'CompressionLoop'
      }
    },
    {
      file: 'dist/jinie.common.js',
      format: 'cjs'
    },
    {
      file: 'dist/jinie.esm.js',
      format: 'es'
    }
  ],
  external: ['react', 'react-dom', 'cropperjs', 'compression-loop'],

  plugins: [
    nodeResolve(),
    typescript({ tsconfig: './rollup.tsconfig.json' }),
    postcss({
      // extract: true,
      modules: true,
      use: ['sass']
    }),
    babel({
      plugins: ['@babel/plugin-transform-runtime'],
      presets: ['@babel/env', '@babel/react'],
      exclude: ['node_modules/**'],
      babelHelpers: 'runtime'
    }),
    terser()
  ]
})
