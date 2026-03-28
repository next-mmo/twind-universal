/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { TodoProvider } from '@todo/features/todo/TodoContext'
import type { ReactNode } from 'react'
import '~/styles/app.css'

export const Route = createRootRoute({
    head: () => ({
        meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { title: 'Todo — Uniwind Universal' }],
    }),
    component: RootComponent,
})

import { HeroUINativeProvider } from 'uniwind-ui'

function RootComponent() {
    return (
        <RootDocument>
            <HeroUINativeProvider>
                <TodoProvider>
                    <Outlet />
                </TodoProvider>
            </HeroUINativeProvider>
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body style={{ margin: 0, height: '100vh' }}>
                {children}
                <Scripts />
            </body>
        </html>
    )
}
