import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { View } from 'uniwind/components'
import { TextClassContext, UIText } from '@/components/ui/text'
import { cn } from '@/lib/utils'

const badgeVariants = tv({
    base: 'self-start rounded-full px-3 py-1.5',
    variants: {
        variant: {
            default: 'bg-zinc-950 dark:bg-zinc-100',
            secondary: 'bg-zinc-100 dark:bg-zinc-800',
            outline: 'border border-zinc-200 bg-transparent dark:border-zinc-800',
            accent: 'bg-indigo-500/12 dark:bg-indigo-400/18',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

const badgeTextVariants = tv({
    base: 'text-xs font-semibold uppercase tracking-[0.18em]',
    variants: {
        variant: {
            default: 'text-white dark:text-zinc-950',
            secondary: 'text-zinc-600 dark:text-zinc-300',
            outline: 'text-zinc-600 dark:text-zinc-300',
            accent: 'text-indigo-600 dark:text-indigo-300',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

type BadgeProps = ComponentProps<typeof View> &
    VariantProps<typeof badgeVariants> & {
        children?: ReactNode
    }

function Badge({ children, className, variant, ...props }: BadgeProps) {
    return (
        <TextClassContext.Provider value={badgeTextVariants({ variant })}>
            <View className={cn(badgeVariants({ variant }), className)} {...props}>
                {typeof children === 'string' || typeof children === 'number' ? <UIText>{children}</UIText> : children}
            </View>
        </TextClassContext.Provider>
    )
}

export type { BadgeProps }
export { Badge, badgeTextVariants, badgeVariants }
