import { retainSearchParams, stripSearchParams } from '@tanstack/react-router'

export type BlockCategory = 'all' | 'marketing' | 'ecommerce' | 'stats'

export interface BlocksSearch {
    category: BlockCategory
}

export const defaultBlocksSearch: BlocksSearch = {
    category: 'all',
}

const validCategories: BlockCategory[] = ['all', 'marketing', 'ecommerce', 'stats']

export function parseBlocksSearch(search: Record<string, unknown>): BlocksSearch {
    return {
        category: validCategories.includes(search.category as BlockCategory)
            ? (search.category as BlockCategory)
            : defaultBlocksSearch.category,
    }
}

export const blocksSearchMiddlewares = [
    retainSearchParams<BlocksSearch>(['category']),
    stripSearchParams<BlocksSearch>(defaultBlocksSearch),
]

export const blockCategories: Array<{ key: BlockCategory; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'ecommerce', label: 'E-Commerce' },
    { key: 'stats', label: 'Stats' },
]
