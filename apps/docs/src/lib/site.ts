export const siteConfig = {
    title: 'Uniwind Universal Docs',
    navTitle: 'Uniwind Universal',
    description:
        'Documentation for the Uniwind universal workspace built with TanStack Start, TanStack Router, and Fumadocs around the shared todo demo.',
    repoUrl: 'https://github.com/next-mmo/twind-universal',
    repoOwner: 'next-mmo',
    repoName: 'twind-universal',
    repoBranch: 'main',
    navLinks: [
        {
            text: 'Docs',
            url: '/docs',
            active: 'nested-url' as const,
        },
        {
            text: 'Universal Todo',
            url: '/docs/universal-todo',
            active: 'nested-url' as const,
        },
        {
            text: 'Packages',
            url: '/docs/packages',
            active: 'nested-url' as const,
        },
        {
            text: 'Workspace Status',
            url: '/docs/workspace-status',
            active: 'nested-url' as const,
        },
    ],
}
