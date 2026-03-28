import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { View } from 'uniwind/components'
import { cn } from '@/lib/utils'

const separatorVariants = tv({
    base: 'bg-zinc-200 dark:bg-zinc-800',
    variants: {
        orientation: {
            horizontal: 'h-px w-full',
            vertical: 'h-full w-px',
        },
        tone: {
            default: '',
            soft: 'bg-zinc-100 dark:bg-zinc-900',
            strong: 'bg-zinc-300 dark:bg-zinc-700',
        },
    },
    defaultVariants: {
        orientation: 'horizontal',
        tone: 'default',
    },
})

type SeparatorProps = ComponentProps<typeof View> & VariantProps<typeof separatorVariants>

function Separator({ className, orientation, tone, ...props }: SeparatorProps) {
    return <View className={cn(separatorVariants({ orientation, tone }), className)} {...props} />
}

export type { SeparatorProps }
export { Separator, separatorVariants }
