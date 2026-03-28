/**
 * Card — react-native-reusables style Card component
 *
 * A composable Card built with uniwind (Tailwind CSS for React Native)
 * following the rnr-reusables composition pattern:
 *
 *   <Card>
 *     <CardHeader>
 *       <CardTitle>Title</CardTitle>
 *       <CardDescription>Description</CardDescription>
 *     </CardHeader>
 *     <CardContent>
 *       <Text>Content here</Text>
 *     </CardContent>
 *     <CardFooter>
 *       <Text>Footer</Text>
 *     </CardFooter>
 *   </Card>
 */
import type { ReactNode } from 'react'
import { View, Text } from 'uniwind/components'
import { tv, type VariantProps } from 'tailwind-variants'

// ── Variants ──────────────────────────────────────────────────────────

const cardVariants = tv({
  base: 'rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
  variants: {
    variant: {
      default: '',
      outline: 'bg-transparent shadow-none',
      elevated: 'shadow-lg border-0',
      ghost: 'border-0 bg-transparent shadow-none',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const cardHeaderVariants = tv({
  base: 'flex flex-col gap-1.5 p-6',
})

const cardTitleVariants = tv({
  base: 'text-2xl font-semibold leading-none tracking-tight text-zinc-950 dark:text-zinc-50',
})

const cardDescriptionVariants = tv({
  base: 'text-sm text-zinc-500 dark:text-zinc-400',
})

const cardContentVariants = tv({
  base: 'p-6 pt-0',
})

const cardFooterVariants = tv({
  base: 'flex flex-row items-center p-6 pt-0',
})

// ── Types ─────────────────────────────────────────────────────────────

type CardVariants = VariantProps<typeof cardVariants>

interface CardProps extends CardVariants {
  className?: string
  children?: ReactNode
}

interface CardSubProps {
  className?: string
  children?: ReactNode
}

// ── Components ────────────────────────────────────────────────────────

function Card({ className, variant, children, ...props }: CardProps) {
  return (
    <View className={cardVariants({ variant, className })} {...props}>
      {children}
    </View>
  )
}
Card.displayName = 'Card'

function CardHeader({ className, children, ...props }: CardSubProps) {
  return (
    <View className={cardHeaderVariants({ className })} {...props}>
      {children}
    </View>
  )
}
CardHeader.displayName = 'CardHeader'

function CardTitle({ className, children, ...props }: CardSubProps) {
  return (
    <Text className={cardTitleVariants({ className })} {...props}>
      {children}
    </Text>
  )
}
CardTitle.displayName = 'CardTitle'

function CardDescription({ className, children, ...props }: CardSubProps) {
  return (
    <Text className={cardDescriptionVariants({ className })} {...props}>
      {children}
    </Text>
  )
}
CardDescription.displayName = 'CardDescription'

function CardContent({ className, children, ...props }: CardSubProps) {
  return (
    <View className={cardContentVariants({ className })} {...props}>
      {children}
    </View>
  )
}
CardContent.displayName = 'CardContent'

function CardFooter({ className, children, ...props }: CardSubProps) {
  return (
    <View className={cardFooterVariants({ className })} {...props}>
      {children}
    </View>
  )
}
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
}
export type { CardProps, CardVariants, CardSubProps }
