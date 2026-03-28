/**
 * ProfileCard — A pre-composed card for displaying user profile information.
 *
 * Built on top of the base Card components using rnr-reusables pattern
 * with uniwind for cross-platform styling.
 *
 * Usage:
 *   <ProfileCard
 *     name="Jane Doe"
 *     role="Senior Engineer"
 *     avatarUrl="https://..."
 *     stats={[
 *       { label: 'Projects', value: '42' },
 *       { label: 'Reviews', value: '128' },
 *     ]}
 *   />
 */
import { View, Text, Image, Pressable } from 'uniwind/components'
import { tv, type VariantProps } from 'tailwind-variants'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card'

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

const avatarVariants = tv({
  base: 'rounded-full bg-zinc-200 dark:bg-zinc-700',
  variants: {
    size: {
      sm: 'w-10 h-10',
      md: 'w-14 h-14',
      lg: 'w-20 h-20',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// ── Types ─────────────────────────────────────────────────────────────

interface StatItem {
  label: string
  value: string
}

type ProfileCardVariants = VariantProps<typeof profileCardVariants>

interface ProfileCardProps extends ProfileCardVariants {
  /** Display name */
  name: string
  /** Role / subtitle */
  role?: string
  /** Avatar image URI */
  avatarUrl?: string
  /** Optional stats to show in the footer */
  stats?: StatItem[]
  /** Optional action button label */
  actionLabel?: string
  /** Callback when the action button is pressed */
  onAction?: () => void
  /** Additional className to merge */
  className?: string
}

// ── Component ─────────────────────────────────────────────────────────

function ProfileCard({
  name,
  role,
  avatarUrl,
  stats,
  actionLabel,
  onAction,
  size,
  className,
}: ProfileCardProps) {
  return (
    <Card className={profileCardVariants({ size, className })}>
      <CardHeader className="flex-row items-center gap-4">
        {/* Avatar */}
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className={avatarVariants({ size })}
          />
        ) : (
          <View className={avatarVariants({ size }) + ' items-center justify-center'}>
            <Text className="text-zinc-500 dark:text-zinc-300 font-bold text-lg">
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {/* Name & Role */}
        <View className="flex-1">
          <CardTitle className="text-lg">{name}</CardTitle>
          {role ? (
            <CardDescription>{role}</CardDescription>
          ) : null}
        </View>
      </CardHeader>

      {/* Stats */}
      {stats && stats.length > 0 ? (
        <CardContent>
          <View className="flex-row gap-6">
            {stats.map((stat) => (
              <View key={stat.label} className="items-center">
                <Text className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </CardContent>
      ) : null}

      {/* Action Footer */}
      {actionLabel && onAction ? (
        <CardFooter>
          <Pressable
            className="flex-1 bg-indigo-500 rounded-xl py-3 items-center active:opacity-80"
            onPress={onAction}
          >
            <Text className="text-white font-semibold text-sm">
              {actionLabel}
            </Text>
          </Pressable>
        </CardFooter>
      ) : null}
    </Card>
  )
}
ProfileCard.displayName = 'ProfileCard'

export { ProfileCard, profileCardVariants, avatarVariants }
export type { ProfileCardProps, ProfileCardVariants, StatItem }
