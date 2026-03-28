import { type ComponentProps, createContext, useContext } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Text as PrimitiveText } from 'uniwind/components'
import { cn } from '@/lib/utils'

const textVariants = tv({
    base: 'text-zinc-950 dark:text-zinc-50',
    variants: {
        variant: {
            default: 'text-base',
            title: 'text-2xl font-semibold tracking-tight',
            subtitle: 'text-lg font-semibold',
            lead: 'text-lg leading-8 text-zinc-600 dark:text-zinc-300',
            muted: 'text-sm text-zinc-500 dark:text-zinc-400',
            small: 'text-sm font-medium',
            eyebrow: 'text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

const TextClassContext = createContext<string | undefined>(undefined)

type UITextProps = ComponentProps<typeof PrimitiveText> & VariantProps<typeof textVariants>

function UIText({ className, variant, ...props }: UITextProps) {
    const inheritedClassName = useContext(TextClassContext)

    return <PrimitiveText className={cn(textVariants({ variant }), inheritedClassName, className)} {...props} />
}

export type { UITextProps }
export { TextClassContext, textVariants, UIText }
