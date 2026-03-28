import { type ComponentProps } from 'react'
import { View } from 'uniwind/components'
import { cn } from '../../lib/utils'

type SkeletonProps = ComponentProps<typeof View>

function Skeleton({ className, ...props }: SkeletonProps) {
    return <View className={cn('animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800', className)} {...props} />
}

export { Skeleton }
export type { SkeletonProps }
