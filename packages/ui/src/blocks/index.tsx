import type { ReactNode } from 'react'
import { View } from 'uniwind/components'
import { cn } from '../../reusables/lib/utils'
import { Badge, Card, CardContent, CardHeader, Separator, UIText } from '../reusables'
import type {
    BlockChromeProps,
    CalloutBlockProps,
    FeatureGridBlockProps,
    FeatureItem,
    PageIntroBlockProps,
    StatItem,
    StatsBlockProps,
    SummaryItem,
    SummaryPanelBlockProps,
    SurfaceGridBlockProps,
    SurfaceItem,
} from './types'

function BlockHeader({ className, description, eyebrow, title }: BlockChromeProps) {
    if (!eyebrow && !title && !description) {
        return null
    }

    return (
        <View className={cn('flex-col gap-3', className)}>
            {eyebrow ? <Badge variant="accent">{eyebrow}</Badge> : null}
            {title ? <UIText variant="title">{title}</UIText> : null}
            {description ? <UIText className="leading-7 text-zinc-600 dark:text-zinc-300">{description}</UIText> : null}
        </View>
    )
}

function getBlockItemKey(prefix: string, index: number, value: ReactNode) {
    return typeof value === 'string' || typeof value === 'number' ? `${prefix}-${value}` : `${prefix}-${index}`
}

function ActionRow({ children }: { children: ReactNode }) {
    return <View className="flex-row flex-wrap gap-3">{children}</View>
}

function StatTile({ detail, label, value }: StatItem) {
    return (
        <Card className="min-w-[12rem] flex-1">
            <CardContent className="gap-2 pt-6">
                <UIText variant="eyebrow">{label}</UIText>
                <UIText className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{value}</UIText>
                {detail ? <UIText className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{detail}</UIText> : null}
            </CardContent>
        </Card>
    )
}

function StatGrid({ items }: { items: StatItem[] }) {
    return (
        <View className="flex-row flex-wrap gap-3">
            {items.map((item, index) => (
                <StatTile key={getBlockItemKey('stat', index, item.label)} {...item} />
            ))}
        </View>
    )
}

function FeatureCard({ body, icon, kicker, title }: FeatureItem) {
    return (
        <Card className="min-w-[15rem] flex-1">
            <CardContent className="gap-3 pt-6">
                {icon ? <View className="self-start">{icon}</View> : null}
                {kicker ? <UIText variant="eyebrow">{kicker}</UIText> : null}
                <UIText variant="subtitle">{title}</UIText>
                <UIText className="leading-7 text-zinc-600 dark:text-zinc-300">{body}</UIText>
            </CardContent>
        </Card>
    )
}

function SummaryItems({ items }: { items: SummaryItem[] }) {
    return (
        <CardContent className="gap-3">
            {items.map((item, index) => (
                <View key={getBlockItemKey('summary', index, item.label)} className="gap-3">
                    {index > 0 ? <Separator /> : null}
                    <View className="gap-1">
                        <UIText variant="eyebrow">{item.label}</UIText>
                        <UIText className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{item.value}</UIText>
                    </View>
                </View>
            ))}
        </CardContent>
    )
}

function SurfaceCard({ action, body, icon, subtitle, title }: SurfaceItem) {
    return (
        <Card className="min-w-[15rem] flex-1">
            <CardContent className="gap-4 pt-6">
                {icon ? <View className="self-start">{icon}</View> : null}
                <View className="gap-2">
                    <UIText variant="eyebrow">{subtitle}</UIText>
                    <UIText variant="subtitle">{title}</UIText>
                    <UIText className="leading-7 text-zinc-600 dark:text-zinc-300">{body}</UIText>
                </View>
                {action ? <View className="pt-2">{action}</View> : null}
            </CardContent>
        </Card>
    )
}

function PageIntroBlock({ actions, aside, className, description, eyebrow, stats, title }: PageIntroBlockProps) {
    return (
        <View
            className={cn(
                'flex-col gap-6 rounded-[2rem] border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80 lg:flex-row lg:items-stretch',
                className,
            )}
        >
            <View className="flex-1 gap-5">
                <BlockHeader eyebrow={eyebrow} title={title} description={description} />
                {actions ? <ActionRow>{actions}</ActionRow> : null}
                {stats?.length ? <StatGrid items={stats} /> : null}
            </View>
            {aside ? <View className="flex-1 gap-4">{aside}</View> : null}
        </View>
    )
}

function StatsBlock({ className, description, eyebrow, items, title }: StatsBlockProps) {
    return (
        <View className={cn('flex-col gap-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <StatGrid items={items} />
        </View>
    )
}

function FeatureGridBlock({ className, description, eyebrow, items, title }: FeatureGridBlockProps) {
    return (
        <View className={cn('flex-col gap-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <View className="flex-row flex-wrap gap-4">
                {items.map((item, index) => (
                    <FeatureCard key={getBlockItemKey('feature', index, item.title)} {...item} />
                ))}
            </View>
        </View>
    )
}

function CalloutBlock({ actions, children, className, description, eyebrow, title }: CalloutBlockProps) {
    return (
        <Card className={cn('overflow-hidden', className)}>
            <CardHeader className="gap-4">
                <BlockHeader eyebrow={eyebrow} title={title} description={description} />
                {actions ? <ActionRow>{actions}</ActionRow> : null}
            </CardHeader>
            {children ? <CardContent>{children}</CardContent> : null}
        </Card>
    )
}

function SummaryPanelBlock({ className, description, eyebrow, footer, items, meta, title }: SummaryPanelBlockProps) {
    return (
        <Card className={cn('overflow-hidden', className)}>
            <CardHeader className="gap-3">
                <BlockHeader eyebrow={eyebrow} title={title} description={description} />
                {meta ? <UIText className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">{meta}</UIText> : null}
            </CardHeader>
            {items?.length ? <SummaryItems items={items} /> : null}
            {footer ? <CardContent className="pt-0">{footer}</CardContent> : null}
        </Card>
    )
}

function SurfaceGridBlock({ className, description, eyebrow, items, title }: SurfaceGridBlockProps) {
    return (
        <View className={cn('flex-col gap-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <View className="flex-row flex-wrap gap-4">
                {items.map((item, index) => (
                    <SurfaceCard key={getBlockItemKey('surface', index, item.title)} {...item} />
                ))}
            </View>
        </View>
    )
}

export { CalloutBlock, FeatureGridBlock, PageIntroBlock, StatsBlock, SummaryPanelBlock, SurfaceGridBlock }
export type {
    CalloutBlockProps,
    FeatureGridBlockProps,
    FeatureItem,
    PageIntroBlockProps,
    StatItem,
    StatsBlockProps,
    SummaryItem,
    SummaryPanelBlockProps,
    SurfaceGridBlockProps,
    SurfaceItem,
} from './types'
