import dotenv from 'dotenv';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import { nodeResolve } from '@rollup/plugin-node-resolve';

dotenv.config();

export default {
  input: 'dist/main.js',
  output: {
    file: 'bundle/main.js',
    name: 'IntExtDirector',
    format: 'iife',
  },
  plugins: [
    injectProcessEnv(process.env),
    nodeResolve(),
  ]
};