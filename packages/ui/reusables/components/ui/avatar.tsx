import type { ComponentProps, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Image, View } from 'uniwind/components'
import { UIText } from '@/components/ui/text'
import { cn } from '@/lib/utils'

const avatarVariants = tv({
    base: 'items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800',
    variants: {
        size: {
            sm: 'h-10 w-10',
            md: 'h-14 w-14',
            lg: 'h-20 w-20',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

type AvatarProps = ComponentProps<typeof View> & VariantProps<typeof avatarVariants>
type AvatarImageProps = ComponentProps<typeof Image>
type AvatarFallbackProps = ComponentProps<typeof View> & {
    children?: ReactNode
}

function Avatar({ className, size, ...props }: AvatarProps) {
    return <View className={cn(avatarVariants({ size }), className)} {...props} />
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
    return <Image className={cn('h-full w-full', className)} {...props} />
}

function AvatarFallback({ children, className, ...props }: AvatarFallbackProps) {
    return (
        <View className={cn('h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-700', className)} {...props}>
            {typeof children === 'string' || typeof children === 'number' ? (
                <UIText className="font-semibold text-zinc-600 dark:text-zinc-100">{children}</UIText>
            ) : (
                children
            )}
        </View>
    )
}

export type { AvatarFallbackProps, AvatarImageProps, AvatarProps }
export { Avatar, AvatarFallback, AvatarImage, avatarVariants }
