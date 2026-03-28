import type { ReactNode } from 'react'
import { cn } from '../reusables/lib/utils'

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
        <div className={cn('flex flex-col gap-3', className)}>
            {eyebrow ? (
                <div className="inline-flex w-fit rounded-full bg-indigo-500/12 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:bg-indigo-400/18 dark:text-indigo-300">
                    {eyebrow}
                </div>
            ) : null}
            {title ? <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h2> : null}
            {description ? <p className="leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
        </div>
    )
}

function StatTile({ detail, label, value }: StatItem) {
    return (
        <div className="min-w-[12rem] flex-1 rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
            {detail ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p> : null}
        </div>
    )
}

function PageIntroBlock({ actions, aside, className, description, eyebrow, stats, title }: PageIntroBlockProps) {
    return (
        <section
            className={cn(
                'flex flex-col gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 lg:flex-row',
                className,
            )}
        >
            <div className="flex-1 space-y-5">
                <BlockHeader eyebrow={eyebrow} title={title} description={description} />
                {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
                {stats?.length ? (
                    <div className="flex flex-wrap gap-3">
                        {stats.map(stat => (
                            <StatTile key={String(stat.label)} {...stat} />
                        ))}
                    </div>
                ) : null}
            </div>
            {aside ? <div className="flex flex-1 flex-col gap-4">{aside}</div> : null}
        </section>
    )
}

function StatsBlock({ className, description, eyebrow, items, title }: StatsBlockProps) {
    return (
        <section className={cn('space-y-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <div className="flex flex-wrap gap-3">
                {items.map(item => (
                    <StatTile key={String(item.label)} {...item} />
                ))}
            </div>
        </section>
    )
}

function FeatureGridBlock({ className, description, eyebrow, items, title }: FeatureGridBlockProps) {
    return (
        <section className={cn('space-y-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <div className="flex flex-wrap gap-4">
                {items.map(item => (
                    <article key={String(item.title)} className="min-w-[15rem] flex-1 rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
                        {item.icon ? <div className="mb-3">{item.icon}</div> : null}
                        {item.kicker ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.kicker}</p> : null}
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{item.title}</h3>
                        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}

function CalloutBlock({ actions, children, className, description, eyebrow, title }: CalloutBlockProps) {
    return (
        <section className={cn('rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80', className)}>
            <div className="space-y-4">
                <BlockHeader eyebrow={eyebrow} title={title} description={description} />
                {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
                {children ? <div>{children}</div> : null}
            </div>
        </section>
    )
}

function SummaryPanelBlock({ className, description, eyebrow, footer, items, meta, title }: SummaryPanelBlockProps) {
    return (
        <section className={cn('rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80', className)}>
            <div className="space-y-4">
                <BlockHeader eyebrow={eyebrow} title={title} description={description} />
                {meta ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{meta}</p> : null}
                {items?.length ? (
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={String(item.label)} className={cn(index > 0 && 'border-t border-slate-200 pt-3 dark:border-slate-800')}>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
                                <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>
                ) : null}
                {footer ? <div>{footer}</div> : null}
            </div>
        </section>
    )
}

function SurfaceGridBlock({ className, description, eyebrow, items, title }: SurfaceGridBlockProps) {
    return (
        <section className={cn('space-y-6', className)}>
            <BlockHeader eyebrow={eyebrow} title={title} description={description} />
            <div className="flex flex-wrap gap-4">
                {items.map(item => (
                    <article key={String(item.title)} className="min-w-[15rem] flex-1 rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
                        {item.icon ? <div className="mb-4">{item.icon}</div> : null}
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{item.title}</h3>
                        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{item.body}</p>
                        {item.action ? <div className="mt-4">{item.action}</div> : null}
                    </article>
                ))}
            </div>
        </section>
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
