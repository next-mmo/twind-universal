import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    failOnWarn: false,
    entries: [
        {
            builder: 'mkdist',
            input: './src',
            outDir: 'dist',
            ext: 'js',
            format: 'esm',
            declaration: true,
            esbuild: {
                jsx: 'automatic',
                jsxImportSource: 'react',
            },
        },
    ],
    outDir: 'dist',
    clean: true,
    externals: ['react', 'react-dom', '@heroui/react', '@heroui/styles', 'tailwind-variants', 'tailwindcss'],
})
