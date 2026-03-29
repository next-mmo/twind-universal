import { createFileRoute } from '@tanstack/react-router'
import { blocksSearchMiddlewares, parseBlocksSearch } from '../-router/blocks'
import { BlocksView } from '../-views/BlocksView'

export const Route = createFileRoute('/blocks')({
    ssr: false,
    validateSearch: search => parseBlocksSearch(search),
    search: {
        middlewares: blocksSearchMiddlewares as any,
    },
    component: BlocksView,
})
