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
                    <div className="grid gap-8 xl:grid-cols-[1.18fr_0.82fr]">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                                <Workflow className="h-3.5 w-3.5" />
                                TanStack Start x Fumadocs x Uniwind
                            </div>

                            <div className="space-y-4">
                                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl dark:text-white">
                                    Docs for the universal todo stack, not another starter shell.
                                </h1>
                                <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                                    `apps/docs` is now the project hub for the workspace: the shared todo flow, the web and native shell apps,
                                    the router bridge, and the UI layer that sit around them.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/docs/$"
                                    params={{ _splat: '' }}
                                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                                >
                                    Open Docs
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href={siteConfig.repoUrl}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition-transform hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                                >
                                    View Repository
                                    <Code2 className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <StatCard label="Apps" value="4" detail="Docs, web, Expo, and bare React Native entry points." />
                                <StatCard label="Shared Routes" value="3" detail="List, detail, and stats flows in the universal todo demo." />
                                <StatCard label="Core Packages" value="5" detail="Router, tools, UI, call UI, and the todo workspace itself." />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <PanelCard
                                eyebrow="Universal Todo"
                                title="One flow, multiple runtimes"
                                description="The shared todo demo carries typed search state, route params, loader data, and runtime context across web and native shells."
                            >
                                <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
                                    <FeatureRow label="List" value="typed search params, sorting, and filter retention" />
                                    <FeatureRow label="Detail" value="panel state and back navigation that respects native history" />
                                    <FeatureRow label="Stats" value="loader deps, route context, and debug payload views" />
                                </div>
                            </PanelCard>

                            <PanelCard
                                eyebrow="Docs Stack"
                                title="Built with the same modern stack the repo is targeting"
                                description="TanStack Start handles routing and SSR, Fumadocs owns the docs surface and search, and the site content is tailored to this workspace instead of boilerplate examples."
                            >
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <MiniPill icon={BookOpenText} title="Fumadocs" copy="MDX content, page tree, search, and LLM output routes." />
                                    <MiniPill icon={AppWindow} title="TanStack" copy="Start, Router, loaders, and server functions underneath the docs UI." />
                                    <MiniPill icon={Blocks} title="Workspace" copy="Real packages, real shell apps, and current repo status notes." />
                                    <MiniPill icon={Boxes} title="Packages" copy="Uniwind Router, Uniwind UI, call-ui, and more." />
                                </div>
                            </PanelCard>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
                    <SectionHeader
                        eyebrow="Demo Surface"
                        title="Where the universal todo story actually runs"
                        description="The docs site covers all four app entry points and shows how the shared feature package is meant to sit behind them."
                    />
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <SurfaceCard
                            icon={BookOpenText}
                            title="docs"
                            subtitle="TanStack Start + Fumadocs"
                            body="The new hub for architecture notes, run commands, package guides, and migration context."
                            href="/docs"
                        />
                        <SurfaceCard
                            icon={Globe}
                            title="todo-web"
                            subtitle="Web shell"
                            body="Thin SSR shell that mounts the shared todo route tree and exposes browser history."
                            href="/docs/app-shells"
                        />
                        <SurfaceCard
                            icon={Smartphone}
                            title="todo-expo"
                            subtitle="Expo shell"
                            body="Native shell using memory history and the same route definitions as web."
                            href="/docs/app-shells"
                        />
                        <SurfaceCard
                            icon={TabletSmartphone}
                            title="todo-bare"
                            subtitle="React Native CLI shell"
                            body="Native runtime with gesture and safe-area wrappers around the shared todo routes."
                            href="/docs/app-shells"
                        />
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
                    <SectionHeader
                        eyebrow="Read Next"
                        title="Start with the pieces that matter"
                        description="The docs tree is organized around getting the repo running, understanding the universal todo demo, and tracing the package boundaries."
                    />
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <SurfaceCard
                            icon={ArrowRight}
                            title="Getting Started"
                            subtitle="Run commands and repo map"
                            body="Install, build the docs app, and understand where the current shells and packages live."
                            href="/docs/getting-started"
                        />
                        <SurfaceCard
                            icon={Workflow}
                            title="Universal Todo"
                            subtitle="Route behavior"
                            body="Walk through the list, detail, and stats flows that define the shared demo."
                            href="/docs/universal-todo"
                        />
                        <SurfaceCard
                            icon={Boxes}
                            title="Packages"
                            subtitle="Library boundaries"
                            body="See how `uniwind-router`, `uniwind-ui`, `call-ui`, and the todo workspace fit together."
                            href="/docs/packages"
                        />
                        <SurfaceCard
                            icon={Code2}
                            title="Workspace Status"
                            subtitle="Current migration notes"
                            body="Track the `packages/todo` to `packages/todo-universal` rename gap that still affects the shell apps."
                            href="/docs/workspace-status"
                        />
                    </div>
                </section>
            </main>
        </HomeLayout>
    )
}

function SectionHeader({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string
    title: string
    description: string
}) {
    return (
        <div className="mb-6 flex max-w-3xl flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">{eyebrow}</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl dark:text-white">{title}</h2>
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
    )
}

function StatCard({
    label,
    value,
    detail,
}: {
    label: string
    value: string
    detail: string
}) {
    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p>
        </div>
    )
}

function PanelCard({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string
    title: string
    description: string
    children: React.ReactNode
}) {
    return (
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600 dark:text-orange-300">{eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
            <div className="mt-5">{children}</div>
        </div>
    )
}

function FeatureRow({
    label,
    value,
}: {
    label: string
    value: string
}) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/80">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-right leading-6">{value}</span>
        </div>
    )
}

function MiniPill({
    icon: Icon,
    title,
    copy,
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    copy: string
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-2 text-slate-950 dark:text-white">
                <Icon className="h-4 w-4" />
                <p className="text-sm font-semibold">{title}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy}</p>
        </div>
    )
}

function SurfaceCard({
    icon: Icon,
    title,
    subtitle,
    body,
    href,
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    subtitle: string
    body: string
    href: string
}) {
    return (
        <Link
            to="/docs/$"
            params={{ _splat: href.replace(/^\/docs\/?/, '') }}
            className="group rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/70"
        >
            <div className="flex h-full flex-col">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{subtitle}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{body}</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 dark:text-teal-300">
                    Open section
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}
