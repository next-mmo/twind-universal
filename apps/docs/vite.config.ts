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

const reactNativeWebPlus = path.resolve(import.meta.dirname, 'rn-stubs/react-native-web-plus.js')

Module._resolveFilename = function (request: string, parent: unknown, isMain: boolean, options: unknown) {
    if (request === 'react-native') {
        return reactNativeWebPlus
    }

    return originalResolveFilename.call(this, request, parent, isMain, options)
}

const rnWebPkgDir = path.dirname(require.resolve('react-native-web/package.json'))
const rnAppContainer = path.join(rnWebPkgDir, 'dist/exports/AppRegistry/AppContainer.js')

/** Metro sets this; pre-bundled deps (Rolldown) need it too — string is a valid JS expression. */
function devFlag(mode: string): string {
    return mode !== 'production' ? 'true' : 'false'
}

const depDefine = (mode: string) => ({
    __DEV__: devFlag(mode),
    'process.env.NODE_ENV': mode === 'production' ? '"production"' : '"development"',
})

export default defineConfig(async ({ mode }) => ({
    define: {
        // RN / Uniwind code expects Metro-style globals (must survive dep pre-bundle + SSR).
        __DEV__: JSON.stringify(mode !== 'production'),
        'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
        global: 'globalThis',
    },
    server: {
        port: 3000,
    },
    optimizeDeps: {
        esbuildOptions: {
            // @rn-primitives ships JSX inside .js/.mjs; dep scan needs JSX loaders.
            loader: { '.js': 'jsx', '.mjs': 'jsx' },
            define: depDefine(mode),
        },
        rolldownOptions: {
            transform: {
                define: depDefine(mode),
            },
        },
    },
    ssr: {
        noExternal: ['react-native', 'react-native-web', 'ui', 'uniwind'],
        optimizeDeps: {
            esbuildOptions: {
                loader: { '.js': 'jsx', '.mjs': 'jsx' },
                define: depDefine(mode),
            },
            rolldownOptions: {
                transform: {
                    define: depDefine(mode),
                },
            },
        },
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
        alias: [
            // Deep RN paths used by native-oriented deps — map to web equivalents or stubs.
            {
                find: 'react-native/Libraries/ReactNative/AppContainer',
                replacement: rnAppContainer,
            },
            {
                find: 'react-native/Libraries/Renderer/shims/ReactFabric',
                replacement: path.resolve(import.meta.dirname, 'rn-stubs/react-fabric.js'),
            },
            {
                find: 'react-native/Libraries/Utilities/codegenNativeComponent',
                replacement: path.resolve(import.meta.dirname, 'rn-stubs/codegenNativeComponent.js'),
            },
            {
                find: /^react-native$/,
                replacement: path.resolve(import.meta.dirname, 'rn-stubs/react-native-web-plus.js'),
            },
            {
                find: 'ui/blocks',
                replacement: path.resolve(import.meta.dirname, '../../packages/ui/src/blocks/index.ts'),
            },
            // lucide-react-native@1.7.0 barrel can be broken; web uses lucide-react (same icon names).
            { find: /^lucide-react-native$/, replacement: 'lucide-react' },
            { find: 'tslib', replacement: 'tslib/tslib.es6.js' },
        ],
    },
}))
