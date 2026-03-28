import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useNavigate } from 'uniwind-router'
import { todoListRouteApi } from '../-router/api'
import { defaultTodoDetailSearch, pickTodoListSearch } from '../-router/search'
import type { Todo } from '../-store/types'

interface Props {
    todo: Todo
    onToggle: (id: string) => void
}

export function TodoItem({ todo, onToggle }: Props) {
    const navigate = useNavigate()
    const listSearch = todoListRouteApi.useSearch()

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Pressable style={styles.checkbox} onPress={() => onToggle(todo.id)}>
                    {todo.completed ? <View style={styles.checkboxInner} /> : null}
                </Pressable>

                <Pressable
                    style={styles.content}
                    onPress={() =>
                        navigate({
                            to: '/todo/$id',
                            params: { id: todo.id },
                            search: { ...defaultTodoDetailSearch, ...pickTodoListSearch(listSearch), panel: 'summary' },
                        })
                    }
                >
                    <Text style={[styles.title, todo.completed && styles.titleCompleted]}>{todo.text}</Text>
                    {todo.notes ? (
                        <Text numberOfLines={1} style={styles.notes}>
                            {todo.notes}
                        </Text>
                    ) : null}
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 18,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#111827',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    checkbox: {
        alignItems: 'center',
        borderColor: '#6366f1',
        borderRadius: 999,
        borderWidth: 2,
        height: 28,
        justifyContent: 'center',
        marginRight: 16,
        width: 28,
    },
    checkboxInner: {
        backgroundColor: '#6366f1',
        borderRadius: 999,
        height: 14,
        width: 14,
    },
    content: {
        flex: 1,
        minHeight: 28,
        justifyContent: 'center',
    },
    title: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '600',
    },
    titleCompleted: {
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    notes: {
        color: '#6b7280',
        fontSize: 12,
        marginTop: 2,
    },
})
