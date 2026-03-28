import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { RootProvider } from 'fumadocs-ui/provider/tanstack'
import * as React from 'react'
import { siteConfig } from '@/lib/site'
import appCss from '@/styles/app.css?url'

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: siteConfig.title,
            },
            {
                name: 'description',
                content: siteConfig.description,
            },
        ],
        links: [{ rel: 'stylesheet', href: appCss }],
    }),
    component: RootComponent,
})

function RootComponent() {
    return (
        <html suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body className="flex min-h-screen flex-col bg-white text-slate-950 antialiased dark:bg-slate-950 dark:text-slate-50">
                <RootProvider>
                    <Outlet />
                </RootProvider>
                <Scripts />
            </body>
        </html>
    )
}
