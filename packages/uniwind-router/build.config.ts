import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    failOnWarn: false,
    entries: [
        // Web entry (default for bundlers like Vite)
        {
            builder: 'mkdist',
            input: './src',
            outDir: 'dist/module',
            ext: 'js',
            format: 'esm',
            pattern: ['index.web.ts', 'web/**', 'shared/**'],
            declaration: true,
            esbuild: {
                jsx: 'automatic',
                jsxImportSource: 'react',
            },
        },
        {
            builder: 'mkdist',
            input: './src',
            outDir: 'dist/common',
            ext: 'js',
            format: 'cjs',
            pattern: ['index.web.ts', 'web/**', 'shared/**'],
            esbuild: {
                jsx: 'automatic',
                jsxImportSource: 'react',
            },
        },
        // Native entry (consumed via react-native condition → src directly)
        // No build needed — Metro reads src/ directly
        // But we still build types
        {
            builder: 'mkdist',
            input: './src',
            outDir: 'dist/module',
            ext: 'js',
            pattern: ['index.native.ts', 'native/**', 'shared/**'],
            declaration: true,
            format: 'esm',
            esbuild: {
                jsx: 'automatic',
                jsxImportSource: 'react',
            },
        },
    ],
    outDir: 'dist',
    clean: true,
    externals: ['react', 'react-native', 'uniwind', /@tanstack/],
})
