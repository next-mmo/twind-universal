import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TodoItem } from '../features/todo/components/TodoItem'
import { useTodos } from '../features/todo/TodoContext'

const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
] as const

export function TodoListScreen() {
    const insets = useSafeAreaInsets()
    const { filteredTodos, filter, setFilter, addTodo, toggleTodo, clearCompleted, stats } = useTodos()
    const [text, setText] = useState('')

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

            <View style={styles.filters}>
                {filters.map(item => {
                    const count = item.key === 'all' ? stats.total : item.key === 'active' ? stats.active : stats.completed
                    const active = filter === item.key

                    return (
                        <Pressable
                            key={item.key}
                            style={[styles.filterChip, active && styles.filterChipActive]}
                            onPress={() => setFilter(item.key)}
                        >
                            <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                                {item.label} ({count})
                            </Text>
                        </Pressable>
                    )
                })}
            </View>

            <ScrollView contentContainerStyle={styles.listContent} style={styles.list}>
                {filteredTodos.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            {filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos`}
                        </Text>
                    </View>
                ) : (
                    filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />)
                )}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <Text style={styles.footerText}>Shared todo state, native stack routing.</Text>
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
