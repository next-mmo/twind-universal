import { Pressable, Text, View } from 'ui/primitives'
import { Link, useMatchRoute } from 'uniwind-router'
import type { BlocksSearch } from '../-router/blocks'
import { blockCategories, defaultBlocksSearch } from '../-router/blocks'
import type { TodoListSearch } from '../-router/search'
import { defaultTodoListSearch } from '../-router/search'
import type { TodoFilter } from '../-store/types'

interface Props {
    listSearch: TodoListSearch
    blocksSearch?: BlocksSearch
}

const todoSubFilters: Array<{ key: TodoFilter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
]

export function RouteFeatureTabs({ listSearch, blocksSearch }: Props) {
    const matchRoute = useMatchRoute()
    const todoActive = Boolean(matchRoute({ to: '/', fuzzy: false }))
    const blocksActive = Boolean(matchRoute({ to: '/blocks', fuzzy: false }))

    return (
        <View className="px-5 pt-4 pb-2 gap-2">
            <Text className="text-xs uppercase tracking-[0.2em] text-indigo-200/80 font-semibold">Menu</Text>
            <View className="flex-row gap-2">
                <Link to="/" search={listSearch as any} className={`px-4 py-2 rounded-full ${todoActive ? 'bg-white' : 'bg-indigo-400/35'}`}>
                    <Text className={todoActive ? 'text-indigo-600 font-semibold' : 'text-white font-medium'}>Todo</Text>
                </Link>
                <Link
                    to="/blocks"
                    search={(blocksSearch ?? defaultBlocksSearch) as any}
                    className={`px-4 py-2 rounded-full ${blocksActive ? 'bg-white' : 'bg-indigo-400/35'}`}
                >
                    <Text className={blocksActive ? 'text-indigo-600 font-semibold' : 'text-white font-medium'}>Blocks</Text>
                </Link>
            </View>

            {/* Sub-filter categories under active tab */}
            {todoActive ? (
                <View className="flex-row gap-1.5 mt-1">
                    {todoSubFilters.map(f => {
                        const isActive = listSearch.filter === f.key
                        return (
                            <Link
                                key={f.key}
                                to="/"
                                search={{ ...listSearch, filter: f.key } as any}
                                className={`px-3 py-1 rounded-full ${isActive ? 'bg-white/90' : 'bg-indigo-400/20'}`}
                            >
                                <Text className={`text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-indigo-100'}`}>
                                    {f.label}
                                </Text>
                            </Link>
                        )
                    })}
                </View>
            ) : null}

            {blocksActive ? (
                <View className="flex-row gap-1.5 mt-1 flex-wrap">
                    {blockCategories.map(cat => {
                        const isActive = (blocksSearch?.category ?? 'all') === cat.key
                        return (
                            <Link
                                key={cat.key}
                                to="/blocks"
                                search={{ category: cat.key } as any}
                                className={`px-3 py-1 rounded-full ${isActive ? 'bg-white/90' : 'bg-indigo-400/20'}`}
                            >
                                <Text className={`text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-indigo-100'}`}>
                                    {cat.label}
                                </Text>
                            </Link>
                        )
                    })}
                </View>
            ) : null}
        </View>
    )
}
