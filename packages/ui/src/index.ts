/**
 * ui — HeroUI-first universal UI surface
 *
 * This package provides:
 * - HeroUI Native as the main component surface
 * - Uniwind primitives as the fallback layer for primitives HeroUI does not expose
 * - Uniwind utilities for authoring
 * - Local recipe components under non-conflicting names
 *
 * Usage:
 *   import { Button, Card, Pressable, Text, ProfileCard, RecipeCard, HeroUI, Primitives, UniwindCore } from "ui";
 */

export * from './heroui'
export * from './primitives'
export * from './recipes'
export * from './uniwind'

export * as HeroUI from './heroui'
export * as Primitives from './primitives'
export * as Recipes from './recipes'
export * as UniwindCore from './uniwind'

export { HeroUINativeProvider as UIProvider } from './heroui'
