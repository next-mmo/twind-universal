import type { ReactNode } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { ArrowRight, Blocks, BookOpenText, Code2, Layers3, Sparkles, Workflow } from 'lucide-react'
import { CalloutBlock, FeatureGridBlock, PageIntroBlock, StatsBlock, SummaryPanelBlock, SurfaceGridBlock } from 'ui/blocks'
import { baseOptions } from '@/lib/layout.shared'

export const Route = createFileRoute('/ui-blocks')({
    component: UIBlocksPage,
})

function UIBlocksPage() {
    return (
        <HomeLayout {...baseOptions()}>
            <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 md:px-6">
                <PageIntroBlock
                    eyebrow="Shared UI Blocks"
                    title="A single verification surface for the new universal block layer."
                    description="These blocks live in `packages/ui`, render through the docs app, and are meant to stay portable enough for real app flows rather than docs-only one-offs."
                    actions={
                        <>
                            <ActionLink to="/docs/$" params={{ _splat: 'packages' }}>
                                Package docs
                                <ArrowRight className="h-4 w-4" />
                            </ActionLink>
                            <ActionLink to="/">
                                Back home
                                <ArrowRight className="h-4 w-4" />
                            </ActionLink>
                        </>
                    }
                    stats={[
                        { label: 'Blocks', value: '6', detail: 'Intro, stats, features, callouts, summary panels, and surface grids.' },
                        { label: 'Consumers', value: '2+', detail: 'Docs renders them directly, and app flows can consume them without DOM assumptions.' },
                        { label: 'Stack', value: 'Uniwind', detail: 'Repo-owned reusables and blocks on top of the shared Uniwind primitives layer.' },
                    ]}
                    aside={
                        <SummaryPanelBlock
                            eyebrow="Why this exists"
                            title="Verification without throwaway demo code"
                            description="The showcase is both a design reference and the e2e target for the shared UI migration."
                            items={[
                                { label: 'Visual', value: 'Shared layout and content blocks rendered in the docs app.' },
                                { label: 'Technical', value: 'Ensures the package resolves and renders in a second consumer beyond todo-universal.' },
                                { label: 'Future', value: 'A stable place to add more recipes and layout primitives over time.' },
                            ]}
                        />
                    }
                />

                <StatsBlock
                    eyebrow="Stats Block"
                    title="Compact summary cards for counts, health, and rollout state."
                    description="This block is useful for overview sections, migration scorecards, and app dashboard summaries."
                    items={[
                        { label: 'Migration', value: 'Single package', detail: 'Shared UI now sits in `packages/ui` only.' },
                        { label: 'Runtime', value: 'Universal', detail: 'Cards and blocks are built for shared use, not a web-only surface.' },
                        { label: 'Evidence', value: 'Docs + e2e', detail: 'The showcase route exists specifically to make the migration testable.' },
                    ]}
                />

                <FeatureGridBlock
                    eyebrow="Feature Grid"
                    title="Richer explanatory sections without one-off local components."
                    description="Each item supports an icon, title, body, and optional kicker so docs and product surfaces can share the same composition vocabulary."
                    items={[
                        {
                            icon: <Sparkles className="h-5 w-5 text-slate-950 dark:text-white" />,
                            kicker: 'Composed',
                            title: 'Layout-first primitives',
                            body: 'The block layer focuses on section composition, not just low-level controls.',
                        },
                        {
                            icon: <Workflow className="h-5 w-5 text-slate-950 dark:text-white" />,
                            kicker: 'Universal',
                            title: 'RN-safe assumptions',
                            body: 'Action areas and icons are passed in instead of hardcoding web routing or DOM-specific affordances.',
                        },
                        {
                            icon: <Layers3 className="h-5 w-5 text-slate-950 dark:text-white" />,
                            kicker: 'Repo-owned',
                            title: 'Local control',
                            body: 'The code is copied and shaped inside this workspace instead of being delegated to an upstream runtime dependency.',
                        },
                    ]}
                />

                <CalloutBlock
                    eyebrow="Callout Block"
                    title="Use this for transitions, migration notes, or launch banners."
                    description="It supports the same content model as the other blocks while leaving room for custom child content."
                    actions={
                        <ActionLink to="/docs/$" params={{ _splat: 'workspace-status' }}>
                            Workspace status
                            <ArrowRight className="h-4 w-4" />
                        </ActionLink>
                    }
                >
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                        A shared callout block is useful because repos often end up with five slightly different “important note” panels that never get unified again.
                    </p>
                </CalloutBlock>

                <SummaryPanelBlock
                    eyebrow="Summary Panel"
                    title="Good for route summaries, operational snapshots, and small detail panels."
                    description="This is the block shape reused in the todo stats screen during the migration."
                    meta="Shared block in a second runtime surface"
                    items={[
                        { label: 'Loader data', value: 'Headline, platform, app name, generated timestamp.' },
                        { label: 'Derived stats', value: 'Summary metrics turned into a consistent presentation layer.' },
                        { label: 'Reuse path', value: 'Docs showcase and todo-universal both consume the same component.' },
                    ]}
                />

                <SurfaceGridBlock
                    eyebrow="Surface Grid"
                    title="Use this for app maps, next-step sections, or grouped entry points."
                    description="It keeps repeated cards aligned while still allowing custom actions per tile."
                    items={[
                        {
                            icon: <BookOpenText className="h-5 w-5 text-slate-950 dark:text-white" />,
                            title: 'Docs',
                            subtitle: 'Primary hub',
                            body: 'The docs app now doubles as the visual verification surface for shared UI work.',
                            action: (
                                <ActionLink to="/docs/$" params={{ _splat: '' }}>
                                    Open docs
                                    <ArrowRight className="h-4 w-4" />
                                </ActionLink>
                            ),
                        },
                        {
                            icon: <Blocks className="h-5 w-5 text-slate-950 dark:text-white" />,
                            title: 'Shared UI',
                            subtitle: 'packages/ui',
                            body: 'Reusables, recipes, primitives, and blocks now live in the same package boundary.',
                            action: (
                                <ActionLink to="/docs/$" params={{ _splat: 'packages' }}>
                                    Inspect package map
                                    <ArrowRight className="h-4 w-4" />
                                </ActionLink>
                            ),
                        },
                        {
                            icon: <Code2 className="h-5 w-5 text-slate-950 dark:text-white" />,
                            title: 'Todo runtime',
                            subtitle: 'Real consumer',
                            body: 'The migration is also exercised in todo-universal instead of being isolated to a docs-only showcase.',
                            action: (
                                <ActionLink to="http://127.0.0.1:3001/" external>
                                    Open web shell
                                    <ArrowRight className="h-4 w-4" />
                                </ActionLink>
                            ),
                        },
                    ]}
                />
            </main>
        </HomeLayout>
    )
}

function ActionLink({
    children,
    external = false,
    params,
    to,
}: {
    children: ReactNode
    external?: boolean
    params?: Record<string, string>
    to: string
}) {
    if (external) {
        return (
            <a
                href={to}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            >
                {children}
            </a>
        )
    }

    return (
        <Link
            to={to}
            params={params as never}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
        >
            {children}
        </Link>
    )
}
