import { Pressable, Text, View } from 'uniwind-ui'
import type { TodoFilter as FilterType } from '../-store/types'

interface Props {
    filter: FilterType
    onFilterChange: (filter: FilterType) => void
    stats: { total: number; active: number; completed: number }
}

const filters: Array<{ key: FilterType; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
]

export function TodoFilter({ filter, onFilterChange, stats }: Props) {
    return (
        <View className="flex-row items-center px-5 py-3 gap-2 border-b border-zinc-200 dark:border-zinc-800">
            {filters.map(f => {
                const isActive = filter === f.key
                const count = f.key === 'all' ? stats.total : f.key === 'active' ? stats.active : stats.completed

                return (
                    <Pressable
                        key={f.key}
                        className={`px-4 py-2 rounded-lg ${isActive ? 'bg-indigo-500' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                        onPress={() => onFilterChange(f.key)}
                    >
                        <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                            {f.label} ({count})
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}
