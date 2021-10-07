import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './test/index.js',
  output: {
    file: './dist/test.bundle.js',
    format: 'es',
  },
  plugins: [ nodeResolve(), commonjs() ],
};
