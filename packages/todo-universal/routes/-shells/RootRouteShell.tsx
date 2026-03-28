/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { HeroUINativeProvider } from 'uniwind-ui'
import { TodoProvider } from '../-store/TodoContext'
import '../../styles/app.css'

export function RootRouteShell() {
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
