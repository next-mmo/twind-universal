import { HomeLayout } from 'fumadocs-ui/layouts/home'
import { baseOptions } from '@/lib/layout.shared'

export function NotFound() {
    return (
        <HomeLayout {...baseOptions()}>
            <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">404</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Page not found</h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    The docs route you requested does not exist in the current workspace guide.
                </p>
            </div>
        </HomeLayout>
    )
}
