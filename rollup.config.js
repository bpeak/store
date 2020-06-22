import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.esm.js',
            format: 'esm'
        },
        {
            file: 'dist/index.esm.min.js',
            plugins: [
                getBabelOutputPlugin({ presets: [['@babel/env', { modules: false }]] }),
                terser({
                    mangle: false
                })
            ]
        },
        {
            file: 'dist/index.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/index.cjs.min.js',
            plugins: [
                getBabelOutputPlugin({ presets: [['@babel/env', { modules: 'cjs' }]] }),
                terser({
                    mangle: false
                })
            ]
        },
        {
            file: 'dist/index.umd.js',
            plugins: [
                getBabelOutputPlugin({ presets: [['@babel/env', { modules: 'umd' }]] }),
            ]
        },
        {
            file: 'dist/index.umd.min.js',
            plugins: [
                getBabelOutputPlugin({ presets: [['@babel/env', { modules: 'umd' }]] }),
                terser({
                    mangle: false
                })
            ]
        },
    ]
};