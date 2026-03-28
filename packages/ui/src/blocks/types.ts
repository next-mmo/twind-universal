import type { ReactNode } from 'react'

export interface BlockChromeProps {
    className?: string
    description?: ReactNode
    eyebrow?: ReactNode
    title?: ReactNode
}

export interface StatItem {
    detail?: ReactNode
    label: ReactNode
    value: ReactNode
}

export interface FeatureItem {
    body: ReactNode
    icon?: ReactNode
    kicker?: ReactNode
    title: ReactNode
}

export interface SurfaceItem {
    action?: ReactNode
    body: ReactNode
    icon?: ReactNode
    subtitle: ReactNode
    title: ReactNode
}

export interface SummaryItem {
    label: ReactNode
    value: ReactNode
}

export interface PageIntroBlockProps extends BlockChromeProps {
    actions?: ReactNode
    aside?: ReactNode
    stats?: StatItem[]
}

export interface StatsBlockProps extends BlockChromeProps {
    items: StatItem[]
}

export interface FeatureGridBlockProps extends BlockChromeProps {
    items: FeatureItem[]
}

export interface CalloutBlockProps extends BlockChromeProps {
    actions?: ReactNode
    children?: ReactNode
}

export interface SummaryPanelBlockProps extends BlockChromeProps {
    footer?: ReactNode
    items?: SummaryItem[]
    meta?: ReactNode
}

export interface SurfaceGridBlockProps extends BlockChromeProps {
    items: SurfaceItem[]
}
