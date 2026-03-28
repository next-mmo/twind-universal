/**
 * call-ui — React Native Reusables-style components for Uniwind
 *
 * This package provides shadcn/ui-inspired components built with
 * tailwind-variants and uniwind for universal React Native + Web usage.
 *
 * Usage:
 *   import { Card, CardHeader, CardTitle, ProfileCard } from "call-ui";
 */

// ── Base Card components (rnr-reusables composition pattern) ──────────
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
} from './components/Card'
export type { CardProps, CardVariants, CardSubProps } from './components/Card'

// ── Pre-composed ProfileCard ──────────────────────────────────────────
export {
  ProfileCard,
  profileCardVariants,
  avatarVariants,
} from './components/ProfileCard'
export type {
  ProfileCardProps,
  ProfileCardVariants,
  StatItem,
} from './components/ProfileCard'

// ── Re-export tailwind-variants for custom component authoring ────────
export { tv } from 'tailwind-variants'
export type { VariantProps } from 'tailwind-variants'

// ── Re-export uniwind core utilities ──────────────────────────────────
export { useUniwind, useResolveClassNames } from 'uniwind'
export { withUniwind } from 'uniwind'
export * from 'uniwind/components'
