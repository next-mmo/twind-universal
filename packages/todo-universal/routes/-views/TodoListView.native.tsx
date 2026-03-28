import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RouteFeatureTabs } from '../-components/RouteFeatureTabs'
import { TodoItem } from '../-components/TodoItem'
import { todoListRouteApi } from '../-router/api'
import type { TodoListSearch, TodoSort } from '../-router/search'
import { defaultTodoListSearch, filterAndSortTodos } from '../-router/search'
import { defaultTodoStatsSearch } from '../-router/stats'
import { useTodos } from '../-store/TodoContext'

const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
] as const

const sortOptions: Array<{ key: TodoSort; label: string }> = [
    { key: 'newest', label: 'Newest' },
    { key: 'oldest', label: 'Oldest' },
    { key: 'alpha', label: 'A-Z' },
]

export function TodoListView() {
    const insets = useSafeAreaInsets()
    const navigate = todoListRouteApi.useNavigate()
    const search = todoListRouteApi.useSearch()
    const { todos, addTodo, toggleTodo, clearCompleted, stats } = useTodos()
    const [text, setText] = useState('')
    const visibleTodos = filterAndSortTodos(todos, search)
    const statsSearch = { ...defaultTodoStatsSearch, ...search }

    const updateSearch = (patch: Partial<TodoListSearch>) => {
        navigate({
            to: '/',
            search: { ...defaultTodoListSearch, ...search, ...patch },
            replace: true,
        })
    }

    const handleSubmit = () => {
        const trimmed = text.trim()
        if (!trimmed) return
        addTodo(trimmed)
        setText('')
    }

    return (
        <View style={styles.screen}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.headerTitle}>Todos</Text>
                <Text style={styles.headerSubtitle}>
                    {stats.active} item{stats.active !== 1 ? 's' : ''} left
                </Text>
            </View>

            <View style={styles.headerNav}>
                <RouteFeatureTabs listSearch={search} statsSearch={statsSearch} />
            </View>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="What needs to be done?"
                    placeholderTextColor="#9ca3af"
                    returnKeyType="done"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleSubmit}
                />
                <Pressable style={styles.addButton} onPress={handleSubmit}>
                    <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
            </View>

            <View style={styles.queryPanel}>
                <TextInput
                    style={styles.queryInput}
                    placeholder="Search from route query params"
                    placeholderTextColor="#9ca3af"
                    value={search.q}
                    onChangeText={value => updateSearch({ q: value })}
                />
                <View style={styles.sortRow}>
                    {sortOptions.map(option => {
                        const active = search.sort === option.key

                        return (
                            <Pressable
                                key={option.key}
                                style={[styles.sortChip, active && styles.sortChipActive]}
                                onPress={() => updateSearch({ sort: option.key })}
                            >
                                <Text style={[styles.sortLabel, active && styles.sortLabelActive]}>{option.label}</Text>
                            </Pressable>
                        )
                    })}
                </View>
                <View style={styles.demoRow}>
                    <Pressable onPress={() => navigate({ to: '/', search: { filter: 'active', q: '', sort: 'newest' }, replace: true })}>
                        <Text style={styles.demoLink}>Active demo</Text>
                    </Pressable>
                    <Pressable onPress={() => navigate({ to: '/', search: { filter: 'completed', q: '', sort: 'alpha' }, replace: true })}>
                        <Text style={styles.demoLink}>Completed A-Z</Text>
                    </Pressable>
                    <Pressable onPress={() => navigate({ to: '/todo/stats', search: { ...statsSearch, focus: search.filter, view: 'summary' } })}>
                        <Text style={styles.demoLink}>Loader stats</Text>
                    </Pressable>
                    <Pressable onPress={() => navigate({ to: '/', search: defaultTodoListSearch, replace: true })}>
                        <Text style={styles.demoLinkMuted}>Reset route state</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.filters}>
                {filters.map(item => {
                    const count = item.key === 'all' ? stats.total : item.key === 'active' ? stats.active : stats.completed
                    const active = search.filter === item.key

                    return (
                        <Pressable
                            key={item.key}
                            style={[styles.filterChip, active && styles.filterChipActive]}
                            onPress={() => updateSearch({ filter: item.key })}
                        >
                            <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                                {item.label} ({count})
                            </Text>
                        </Pressable>
                    )
                })}
            </View>

            <ScrollView contentContainerStyle={styles.listContent} style={styles.list}>
                {visibleTodos.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {search.q
                                ? `No todos matching "${search.q}"`
                                : search.filter === 'all'
                                  ? 'No todos yet. Add one above!'
                                  : `No ${search.filter} todos`}
                        </Text>
                    </View>
                ) : (
                    visibleTodos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />)
                )}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <Text style={styles.footerText}>
                    Typed route search: {search.filter} / {search.q || '""'} / {search.sort}
                </Text>
                {stats.completed > 0 ? (
                    <Pressable onPress={clearCompleted}>
                        <Text style={styles.clearCompleted}>Clear completed ({stats.completed})</Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#f8fafc',
        flex: 1,
    },
    header: {
        backgroundColor: '#4f46e5',
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerNav: {
        backgroundColor: '#4f46e5',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: '#c7d2fe',
        fontSize: 14,
        marginTop: 6,
    },
    inputRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    queryPanel: {
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        color: '#111827',
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    addButton: {
        backgroundColor: '#4f46e5',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    queryInput: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        color: '#111827',
        fontSize: 15,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    sortRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sortChip: {
        backgroundColor: '#e5e7eb',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    sortChipActive: {
        backgroundColor: '#111827',
    },
    sortLabel: {
        color: '#4b5563',
        fontSize: 13,
        fontWeight: '600',
    },
    sortLabelActive: {
        color: '#ffffff',
    },
    demoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    demoLink: {
        color: '#4f46e5',
        fontSize: 13,
        fontWeight: '700',
    },
    demoLinkMuted: {
        color: '#6b7280',
        fontSize: 13,
        fontWeight: '600',
    },
    filters: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    filterChip: {
        backgroundColor: '#e5e7eb',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    filterChipActive: {
        backgroundColor: '#4f46e5',
    },
    filterLabel: {
        color: '#4b5563',
        fontSize: 13,
        fontWeight: '600',
    },
    filterLabelActive: {
        color: '#ffffff',
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 64,
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 18,
        textAlign: 'center',
    },
    footer: {
        alignItems: 'center',
        borderTopColor: '#e5e7eb',
        borderTopWidth: StyleSheet.hairlineWidth,
        gap: 8,
        paddingHorizontal: 16,
        paddingTop: 14,
    },
    footerText: {
        color: '#6b7280',
        fontSize: 13,
    },
    clearCompleted: {
        color: '#dc2626',
        fontSize: 14,
        fontWeight: '700',
    },
})
