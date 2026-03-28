import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import mdx from 'fumadocs-mdx/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        mdx(await import('./source.config')),
        tailwindcss(),
        tanstackStart({
            prerender: {
                enabled: false,
            },
        }),
        react(),
        // please see https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro for guides on hosting
        nitro({
            preset: 'vercel',
        }),
    ],
    resolve: {
        tsconfigPaths: true,
        alias: {
            'ui/blocks': path.resolve(import.meta.dirname, '../../packages/ui/src/blocks.web.tsx'),
            tslib: 'tslib/tslib.es6.js',
        },
    },
})
