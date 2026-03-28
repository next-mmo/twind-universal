import path from 'node:path'
import { createRequire } from 'node:module'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import mdx from 'fumadocs-mdx/vite'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const Module = require('node:module')
const originalResolveFilename = Module._resolveFilename

Module._resolveFilename = function (request: string, parent: unknown, isMain: boolean, options: unknown) {
    if (request === 'react-native') {
        return originalResolveFilename.call(this, 'react-native-web', parent, isMain, options)
    }

    return originalResolveFilename.call(this, request, parent, isMain, options)
}

export default defineConfig({
    server: {
        port: 3000,
    },
    ssr: {
        noExternal: ['react-native', 'react-native-web', 'ui', 'uniwind'],
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
            'react-native': 'react-native-web',
            'ui/blocks': path.resolve(import.meta.dirname, '../../packages/ui/src/blocks/index.ts'),
            tslib: 'tslib/tslib.es6.js',
        },
    },
})
