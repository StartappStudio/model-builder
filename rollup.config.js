import typescript from 'rollup-plugin-typescript2';

export default {
    input: './index.ts',
    output: {
        file: './dist/model-builder.esm',
        format: 'esm'
    },
    plugins: [
        typescript({ clean: true })
    ],
    external: ['react', 'styled-components', 'eventemitter3', 'object-path', '@start-app/form-builder-model']
}