import type { ReactNode } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import {
    AppWindow,
    ArrowRight,
    Blocks,
    BookOpenText,
    Boxes,
    Code2,
    Globe,
    Smartphone,
    TabletSmartphone,
    Workflow,
} from 'lucide-react'
import { FeatureGridBlock, PageIntroBlock, SummaryPanelBlock, SurfaceGridBlock } from 'ui/blocks'
import { baseOptions } from '@/lib/layout.shared'
import { siteConfig } from '@/lib/site'

export const Route = createFileRoute('/')({
    head: () => ({
        meta: [
            {
                title: `${siteConfig.navTitle} | TanStack Start + Fumadocs`,
            },
            {
                name: 'description',
                content: siteConfig.description,
            },
        ],
    }),
    component: Home,
})

function Home() {
    return (
        <HomeLayout {...baseOptions()}>
            <main className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_38%),linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(255,255,255,1)_55%,rgba(248,250,252,1)_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_38%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(15,23,42,1)_58%,rgba(2,6,23,1)_100%)]" />

                <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-6 md:pb-20 md:pt-20">
                    <PageIntroBlock
                        eyebrow="TanStack Start x Fumadocs x Uniwind"
                        title="Docs for the universal todo stack, not another starter shell."
                        description="`apps/docs` is now the project hub for the workspace: the shared todo flow, the web and native shell apps, the router bridge, and the shared React Native Reusables + Uniwind UI layer around them."
                        actions={
                            <>
                                <ActionLink to="/docs/$" params={{ _splat: '' }}>
                                    Open Docs
                                    <ArrowRight className="h-4 w-4" />
                                </ActionLink>
                                <a
                                    href={siteConfig.repoUrl}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-transform hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                >
                                    View Repository
                                    <Code2 className="h-4 w-4" />
                                </a>
                            </>
                        }
                        stats={[
                            {
                                label: 'Apps',
                                value: '4',
                                detail: 'Docs, web, Expo, and bare React Native entry points.',
                            },
                            {
                                label: 'Shared Routes',
                                value: '3',
                                detail: 'List, detail, and stats flows in the universal todo demo.',
                            },
                            {
                                label: 'Core Packages',
                                value: '4',
                                detail: 'Router, tools, UI, and the shared todo workspace itself.',
                            },
                        ]}
                        aside={
                            <>
                                <SummaryPanelBlock
                                    eyebrow="Universal Todo"
                                    title="One flow, multiple runtimes"
                                    description="The shared todo demo carries typed search state, route params, loader data, and runtime context across web and native shells."
                                    items={[
                                        { label: 'List', value: 'typed search params, sorting, and filter retention' },
                                        { label: 'Detail', value: 'panel state and back navigation that respects native history' },
                                        { label: 'Stats', value: 'loader deps, route context, and debug payload views' },
                                    ]}
                                />
                                <SummaryPanelBlock
                                    eyebrow="Shared UI"
                                    title="Reusables-first, repo-owned UI"
                                    description="The workspace now owns its UI surface directly: primitives, recipe cards, and larger page blocks built with Uniwind."
                                    items={[
                                        { label: 'Base', value: 'repo-owned reusables components' },
                                        { label: 'Recipes', value: 'shared cards and composed app UI' },
                                        { label: 'Blocks', value: 'docs and product sections from one package' },
                                    ]}
                                />
                            </>
                        }
                    />
                </section>

                <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
                    <FeatureGridBlock
                        eyebrow="Docs Stack"
                        title="Built with the same modern stack the repo is targeting"
                        description="TanStack Start handles routing and SSR, Fumadocs owns the docs surface and search, and the site content is tailored to this workspace instead of boilerplate examples."
                        items={[
                            {
                                icon: <BookOpenText className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'Fumadocs',
                                body: 'MDX content, page tree, search, and LLM output routes.',
                            },
                            {
                                icon: <AppWindow className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'TanStack',
                                body: 'Start, Router, loaders, and server functions underneath the docs UI.',
                            },
                            {
                                icon: <Blocks className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'Workspace',
                                body: 'Real packages, real shell apps, and current repo status notes.',
                            },
                            {
                                icon: <Boxes className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'Packages',
                                body: 'Uniwind Router, ui, and the shared todo workspace.',
                            },
                        ]}
                    />
                </section>

                <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
                    <SurfaceGridBlock
                        eyebrow="Demo Surface"
                        title="Where the universal todo story actually runs"
                        description="The docs site covers all four app entry points and shows how the shared feature package is meant to sit behind them."
                        items={[
                            {
                                icon: <BookOpenText className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'docs',
                                subtitle: 'TanStack Start + Fumadocs',
                                body: 'The hub for architecture notes, run commands, package guides, and migration context.',
                                action: (
                                    <ActionLink to="/docs/$" params={{ _splat: '' }}>
                                        Open docs
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                            {
                                icon: <Globe className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'todo-web',
                                subtitle: 'Web shell',
                                body: 'Thin SSR shell that mounts the shared todo route tree and exposes browser history.',
                                action: (
                                    <ActionLink to="/docs/$" params={{ _splat: 'app-shells' }}>
                                        View shell guide
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                            {
                                icon: <Smartphone className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'todo-expo',
                                subtitle: 'Expo shell',
                                body: 'Native shell using memory history and the same route definitions as web.',
                                action: (
                                    <ActionLink to="/docs/$" params={{ _splat: 'app-shells' }}>
                                        View shell guide
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                            {
                                icon: <TabletSmartphone className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'todo-bare',
                                subtitle: 'React Native CLI shell',
                                body: 'Native runtime with gesture and safe-area wrappers around the shared todo routes.',
                                action: (
                                    <ActionLink to="/docs/$" params={{ _splat: 'app-shells' }}>
                                        View shell guide
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                        ]}
                    />
                </section>

                <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
                    <SurfaceGridBlock
                        eyebrow="Read Next"
                        title="Start with the pieces that matter"
                        description="The docs tree is organized around getting the repo running, understanding the universal todo demo, and tracing the package boundaries."
                        items={[
                            {
                                icon: <ArrowRight className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'Getting Started',
                                subtitle: 'Run commands and repo map',
                                body: 'Install, build the docs app, and understand where the current shells and packages live.',
                                action: (
                                    <ActionLink to="/docs/$" params={{ _splat: 'getting-started' }}>
                                        Read guide
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                            {
                                icon: <Workflow className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'Universal Todo',
                                subtitle: 'Route behavior',
                                body: 'Walk through the list, detail, and stats flows that define the shared demo.',
                                action: (
                                    <ActionLink to="/docs/$" params={{ _splat: 'universal-todo' }}>
                                        Read guide
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                            {
                                icon: <Boxes className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'Packages',
                                subtitle: 'Library boundaries',
                                body: 'See how `uniwind-router`, `ui`, and the todo workspace fit together.',
                                action: (
                                    <ActionLink to="/docs/$" params={{ _splat: 'packages' }}>
                                        Read guide
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                            {
                                icon: <Blocks className="h-5 w-5 text-slate-950 dark:text-white" />,
                                title: 'UI Blocks',
                                subtitle: 'Shared verification surface',
                                body: 'Inspect the reusable page blocks that now power the docs home and shared UI story.',
                                action: (
                                    <ActionLink to="/ui-blocks">
                                        Open showcase
                                        <ArrowRight className="h-4 w-4" />
                                    </ActionLink>
                                ),
                            },
                        ]}
                    />
                </section>
            </main>
        </HomeLayout>
    )
}

function ActionLink({
    children,
    params,
    to,
}: {
    children: ReactNode
    params?: Record<string, string>
    to: string
}) {
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
