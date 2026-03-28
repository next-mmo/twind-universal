import { tv, type VariantProps } from 'tailwind-variants'
import { View } from '../primitives'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    UIText,
} from '../reusables'

// ── Variants ──────────────────────────────────────────────────────────

const profileCardVariants = tv({
    base: '',
    variants: {
        size: {
            sm: 'max-w-xs',
            md: 'max-w-sm',
            lg: 'max-w-md',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

const profileAvatarVariants = tv({
    base: '',
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

// ── Types ─────────────────────────────────────────────────────────────

interface ProfileCardStatItem {
    label: string
    value: string
}

type ProfileCardVariants = VariantProps<typeof profileCardVariants>

interface ProfileCardProps extends ProfileCardVariants {
    actionLabel?: string
    avatarUrl?: string
    className?: string
    name: string
    onAction?: () => void
    role?: string
    stats?: ProfileCardStatItem[]
}

// ── Component ─────────────────────────────────────────────────────────

function ProfileCard({ actionLabel, avatarUrl, className, name, onAction, role, size, stats }: ProfileCardProps) {
    return (
        <Card className={profileCardVariants({ size, className })}>
            <CardHeader className="flex-row items-center gap-4">
                <Avatar className={profileAvatarVariants({ size })}>
                    {avatarUrl ? <AvatarImage source={{ uri: avatarUrl }} /> : <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>}
                </Avatar>
                <View className="flex-1">
                    <CardTitle className="text-lg">{name}</CardTitle>
                    {role ? <CardDescription>{role}</CardDescription> : null}
                </View>
            </CardHeader>

            {stats?.length ? (
                <CardContent>
                    <View className="flex-row flex-wrap gap-6">
                        {stats.map(stat => (
                            <View key={stat.label} className="items-center gap-1">
                                <UIText className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</UIText>
                                <UIText className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</UIText>
                            </View>
                        ))}
                    </View>
                </CardContent>
            ) : null}

            {actionLabel && onAction ? (
                <CardFooter>
                    <Button className="flex-1" onPress={onAction}>
                        <UIText>{actionLabel}</UIText>
                    </Button>
                </CardFooter>
            ) : null}
        </Card>
    )
}
ProfileCard.displayName = 'ProfileCard'

export type { ProfileCardProps, ProfileCardStatItem, ProfileCardVariants }
export { ProfileCard, profileAvatarVariants, profileCardVariants }
