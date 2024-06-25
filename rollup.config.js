import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'iife',
    name: 'IntExtDirector',
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(
      {
        tsconfig: 'tsconfig.json',
      },
    ),
  ],
}
