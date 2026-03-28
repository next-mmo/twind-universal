// Mirrors apps/*/uniwind-types.d.ts so this package typechecks standalone (uniwind generator output).
/// <reference types="uniwind/types" />

declare module 'uniwind' {
    export interface UniwindConfig {
        themes: readonly ['light', 'dark']
    }
}

export {}
