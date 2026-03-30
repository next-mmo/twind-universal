/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, useRouter } from '@tanstack/react-router'
import { Fragment, type ReactNode } from 'react'
import { Platform } from 'react-native'
import { TodoProvider } from '../-store/TodoContext'
import '../../styles/app.css'

export function RootRouteShell() {
    const router = useRouter()
    const shouldRenderDocumentShell = Platform.OS === 'web' && router.options.context?.platform === 'web'

    return (
        <RootDocument shouldRenderDocumentShell={shouldRenderDocumentShell}>
            <TodoProvider>
                <Outlet />
            </TodoProvider>
        </RootDocument>
    )
}

function RootDocument({ children, shouldRenderDocumentShell }: Readonly<{ children: ReactNode; shouldRenderDocumentShell: boolean }>) {
    if (!shouldRenderDocumentShell) {
        return <Fragment>{children}</Fragment>
    }

    // Web-only TanStack Router components (HeadContent renders <meta>, <title>, etc.)
    // They are only rendered on web, so it's safe to import them statically.

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
