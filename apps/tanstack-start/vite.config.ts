import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { uniwind } from 'uniwind/vite'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * TanStack Start treats dependencies as entry points for SSR.
 * The Uniwind Vite plugin marks 'uniwind' and 'react-native' in
 * optimizeDeps.exclude, which conflicts with esbuild entry point handling.
 * This plugin removes those from the final resolved config.
 */
function fixOptimizeDeps(): Plugin {
    return {
        name: 'fix-optimize-deps-for-ssr',
        configResolved(config) {
            const exclude = config.optimizeDeps?.exclude
            if (Array.isArray(exclude)) {
                const toRemove = ['uniwind', 'react-native']
                for (const item of toRemove) {
                    const idx = exclude.indexOf(item)
                    if (idx !== -1) {
                        exclude.splice(idx, 1)
                    }
                }
            }
        },
    }
}

export default defineConfig({
    server: {
        port: 3000,
    },
    resolve: {
        // react-native → react-native-web alias (replaces vite-plugin-rnw)
        alias: {
            'react-native': 'react-native-web',
        },
    },
    plugins: [
        // 1. Tailwind CSS
        tailwindcss(),
        // 2. Uniwind (CSS build, LightningCSS visitor, RN aliasing, __reinit injection)
        // @ts-expect-error - vite version mismatch between uniwind and this project
        uniwind({
            cssEntryFile: './src/styles/app.css',
            extraThemes: ['premium'],
        }),
        // 3. Fix optimizeDeps conflict between Uniwind and TanStack Start SSR
        fixOptimizeDeps(),
        // 4. TypeScript path aliases
        tsconfigPaths(),
        // 5. TanStack Start (must be BEFORE viteReact per their requirement)
        tanstackStart(),
        // 6. React JSX transform (must be AFTER tanstackStart)
        viteReact(),
    ],
})
