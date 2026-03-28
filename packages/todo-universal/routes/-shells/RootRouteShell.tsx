/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { Fragment, type ReactNode } from 'react'
import { Platform } from 'react-native'
import { TodoProvider } from '../-store/TodoContext'
import '../../styles/app.css'

export function RootRouteShell() {
    return (
        <RootDocument>
            <TodoProvider>
                <Outlet />
            </TodoProvider>
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    if (Platform.OS !== 'web') {
        return <Fragment>{children}</Fragment>
    }

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
