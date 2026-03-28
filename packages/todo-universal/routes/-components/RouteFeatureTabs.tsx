import { Text, View } from 'ui/primitives'
import { Link, useMatchRoute } from 'uniwind-router'
import type { TodoListSearch } from '../-router/search'
import type { TodoStatsSearch } from '../-router/stats'

interface Props {
    listSearch: TodoListSearch
    statsSearch: TodoStatsSearch
}

export function RouteFeatureTabs({ listSearch, statsSearch }: Props) {
    const matchRoute = useMatchRoute()
    const listActive = Boolean(matchRoute({ to: '/', fuzzy: false }))
    const statsActive = Boolean(matchRoute({ to: '/todo/stats', fuzzy: false }))

    return (
        <View className="px-5 pt-4 pb-2 gap-2">
            <Text className="text-xs uppercase tracking-[0.2em] text-indigo-200/80 font-semibold">Hook Navigation</Text>
            <View className="flex-row gap-2">
                <Link to="/" search={listSearch as any} className={`px-4 py-2 rounded-full ${listActive ? 'bg-white' : 'bg-indigo-400/35'}`}>
                    <Text className={listActive ? 'text-indigo-600 font-semibold' : 'text-white font-medium'}>Todos</Text>
                </Link>
                <Link
                    to="/todo/stats"
                    search={statsSearch as any}
                    className={`px-4 py-2 rounded-full ${statsActive ? 'bg-white' : 'bg-indigo-400/35'}`}
                >
                    <Text className={statsActive ? 'text-indigo-600 font-semibold' : 'text-white font-medium'}>Stats</Text>
                </Link>
            </View>
        </View>
    )
}
