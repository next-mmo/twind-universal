import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { View } from 'uniwind/components'
import { UIText } from '@/components/ui/text'
import { cn } from '@/lib/utils'

const cardVariants = tv({
    base: 'rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
    variants: {
        variant: {
            default: '',
            outline: 'bg-transparent shadow-none',
            elevated: 'border-transparent shadow-lg',
            ghost: 'border-transparent bg-transparent shadow-none',
            transparent: 'border-transparent bg-transparent shadow-none',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

const cardHeaderVariants = tv({
    base: 'flex-col gap-1.5 p-6',
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
    base: 'flex-row items-center gap-3 p-6 pt-0',
})

type CardVariants = VariantProps<typeof cardVariants>
type CardProps = ComponentProps<typeof View> & CardVariants
type CardSlotProps = ComponentProps<typeof View> & {
    children?: ReactNode
}
type CardTextProps = ComponentProps<typeof UIText> & {
    children?: ReactNode
}

function Card({ className, variant, ...props }: CardProps) {
    return <View className={cn(cardVariants({ variant }), className)} {...props} />
}

function CardHeader({ className, ...props }: CardSlotProps) {
    return <View className={cn(cardHeaderVariants(), className)} {...props} />
}

function CardTitle({ className, ...props }: CardTextProps) {
    return <UIText className={cn(cardTitleVariants(), className)} {...props} />
}

function CardDescription({ className, ...props }: CardTextProps) {
    return <UIText className={cn(cardDescriptionVariants(), className)} {...props} />
}

function CardContent({ className, ...props }: CardSlotProps) {
    return <View className={cn(cardContentVariants(), className)} {...props} />
}

function CardFooter({ className, ...props }: CardSlotProps) {
    return <View className={cn(cardFooterVariants(), className)} {...props} />
}

export type { CardProps, CardSlotProps, CardTextProps, CardVariants }
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants }
