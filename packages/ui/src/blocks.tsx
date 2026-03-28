import type { ReactNode } from 'react'
import { View } from 'uniwind/components'
import { cn } from '../reusables/lib/utils'
import { Badge, Card, CardContent, CardHeader, Separator, UIText } from './reusables'

interface BlockChromeProps {
    className?: string
    description?: ReactNode
    eyebrow?: ReactNode
    title?: ReactNode
}

interface StatItem {
    detail?: ReactNode
    label: ReactNode
    value: ReactNode
}

interface FeatureItem {
    body: ReactNode
    icon?: ReactNode
    kicker?: ReactNode
    title: ReactNode
}

interface SurfaceItem {
    action?: ReactNode
    body: ReactNode
    icon?: ReactNode
    subtitle: ReactNode
    title: ReactNode
}

interface SummaryItem {
    label: ReactNode
    value: ReactNode
}

interface PageIntroBlockProps extends BlockChromeProps {
    actions?: ReactNode
    aside?: ReactNode
    stats?: StatItem[]
}

interface StatsBlockProps extends BlockChromeProps {
    items: StatItem[]
}

interface FeatureGridBlockProps extends BlockChromeProps {
    items: FeatureItem[]
}

interface CalloutBlockProps extends BlockChromeProps {
    actions?: ReactNode
    children?: ReactNode
}

interface SummaryPanelBlockProps extends BlockChromeProps {
    footer?: ReactNode
    items?: SummaryItem[]
    meta?: ReactNode
}

interface SurfaceGridBlockProps extends BlockChromeProps {
    items: SurfaceItem[]
}

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
                {actions ? <View className="flex-row flex-wrap gap-3">{actions}</View> : null}
                {stats?.length ? (
                    <View className="flex-row flex-wrap gap-3">
                        {stats.map(stat => (
                            <StatTile key={String(stat.label)} {...stat} />
                        ))}
                    </View>
                ) : null}
            </View>
            {aside ? <View className="flex-1 gap-4">{aside}</View> : null}
        </View>
    )
}

function StatsBlock({ className, description, eyebrow, items, title }: StatsBlockProps) {
    return (
        <View className={cn('flex-col gap-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <View className="flex-row flex-wrap gap-3">
                {items.map(item => (
                    <StatTile key={String(item.label)} {...item} />
                ))}
            </View>
        </View>
    )
}

function FeatureGridBlock({ className, description, eyebrow, items, title }: FeatureGridBlockProps) {
    return (
        <View className={cn('flex-col gap-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <View className="flex-row flex-wrap gap-4">
                {items.map(item => (
                    <Card key={String(item.title)} className="min-w-[15rem] flex-1">
                        <CardContent className="gap-3 pt-6">
                            {item.icon ? <View className="self-start">{item.icon}</View> : null}
                            {item.kicker ? <UIText variant="eyebrow">{item.kicker}</UIText> : null}
                            <UIText variant="subtitle">{item.title}</UIText>
                            <UIText className="leading-7 text-zinc-600 dark:text-zinc-300">{item.body}</UIText>
                        </CardContent>
                    </Card>
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
                {actions ? <View className="flex-row flex-wrap gap-3">{actions}</View> : null}
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
            {items?.length ? (
                <CardContent className="gap-3">
                    {items.map((item, index) => (
                        <View key={String(item.label)} className="gap-3">
                            {index > 0 ? <Separator /> : null}
                            <View className="gap-1">
                                <UIText variant="eyebrow">{item.label}</UIText>
                                <UIText className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{item.value}</UIText>
                            </View>
                        </View>
                    ))}
                </CardContent>
            ) : null}
            {footer ? <CardContent className="pt-0">{footer}</CardContent> : null}
        </Card>
    )
}

function SurfaceGridBlock({ className, description, eyebrow, items, title }: SurfaceGridBlockProps) {
    return (
        <View className={cn('flex-col gap-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <View className="flex-row flex-wrap gap-4">
                {items.map(item => (
                    <Card key={String(item.title)} className="min-w-[15rem] flex-1">
                        <CardContent className="gap-4 pt-6">
                            {item.icon ? <View className="self-start">{item.icon}</View> : null}
                            <View className="gap-2">
                                <UIText variant="eyebrow">{item.subtitle}</UIText>
                                <UIText variant="subtitle">{item.title}</UIText>
                                <UIText className="leading-7 text-zinc-600 dark:text-zinc-300">{item.body}</UIText>
                            </View>
                            {item.action ? <View className="pt-2">{item.action}</View> : null}
                        </CardContent>
                    </Card>
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
}
