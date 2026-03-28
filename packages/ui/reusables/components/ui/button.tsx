import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Pressable } from 'uniwind/components'
import { TextClassContext } from '@/components/ui/text'
import { cn } from '@/lib/utils'

const buttonVariants = tv({
    base: 'flex-row items-center justify-center gap-2 rounded-2xl active:opacity-90 disabled:opacity-50',
    variants: {
        variant: {
            default: 'bg-indigo-500 shadow-sm',
            secondary: 'bg-zinc-100 dark:bg-zinc-800',
            outline: 'border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
            ghost: 'bg-transparent',
            destructive: 'bg-red-500 shadow-sm',
        },
        size: {
            sm: 'px-3 py-2',
            md: 'px-4 py-3',
            lg: 'px-5 py-3.5',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
})

const buttonTextVariants = tv({
    base: 'text-sm font-semibold',
    variants: {
        variant: {
            default: 'text-white',
            secondary: 'text-zinc-700 dark:text-zinc-200',
            outline: 'text-zinc-900 dark:text-zinc-100',
            ghost: 'text-zinc-700 dark:text-zinc-200',
            destructive: 'text-white',
        },
        size: {
            sm: '',
            md: '',
            lg: 'text-base',
            icon: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
})

type ButtonProps = ComponentProps<typeof Pressable> & VariantProps<typeof buttonVariants>

function Button({ className, disabled, size, variant, ...props }: ButtonProps) {
    return (
        <TextClassContext.Provider value={buttonTextVariants({ size, variant })}>
            <Pressable
                className={cn(disabled && 'opacity-50', buttonVariants({ size, variant }), className)}
                disabled={disabled}
                role="button"
                {...props}
            />
        </TextClassContext.Provider>
    )
}

export type { ButtonProps }
export { Button, buttonTextVariants, buttonVariants }
