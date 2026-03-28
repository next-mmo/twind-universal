import { Outlet } from '@tanstack/react-router'
import { TodoProvider } from '../-store/TodoContext'

export function RootRouteShell() {
    return (
        <TodoProvider>
            <Outlet />
        </TodoProvider>
    )
}
