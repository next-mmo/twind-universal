import { useNavigation, useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTodos } from '../features/todo/TodoContext'

type TodoStackParamList = {
    TodoList: undefined
    TodoDetail: { id: string }
}

export function TodoDetailScreen() {
    const insets = useSafeAreaInsets()
    const navigation = useNavigation<any>()
    const route = useRoute<RouteProp<TodoStackParamList, 'TodoDetail'>>()
    const { id } = route.params
    const { getTodo, toggleTodo, deleteTodo, updateTodo } = useTodos()
    const todo = getTodo(id)
    const [notes, setNotes] = useState(todo?.notes ?? '')

    useEffect(() => {
        setNotes(todo?.notes ?? '')
    }, [todo?.notes])

    const goBackToList = () => {
        if (navigation.canGoBack()) {
            navigation.goBack()
            return
        }

        navigation.navigate('TodoList')
    }

    if (!todo) {
        return (
            <View style={styles.missingScreen}>
                <Text style={styles.missingTitle}>Todo not found</Text>
                <Pressable onPress={goBackToList}>
                    <Text style={styles.backLink}>← Back to list</Text>
                </Pressable>
            </View>
        )
    }

    const handleDelete = () => {
        deleteTodo(id)
        goBackToList()
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={[styles.header, { paddingTop: insets.top + 18 }]}>
                <Pressable onPress={goBackToList}>
                    <Text style={styles.headerBack}>← Back</Text>
                </Pressable>
            </View>

            <View style={styles.card}>
                <Text style={styles.todoTitle}>{todo.text}</Text>
                <View style={styles.statusRow}>
                    <View style={[styles.statusDot, todo.completed ? styles.statusDotComplete : styles.statusDotActive]} />
                    <Text style={styles.statusText}>{todo.completed ? 'Completed' : 'Active'}</Text>
                </View>
            </View>

            <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>{new Date(todo.createdAt).toLocaleString()}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.metaLabel}>Notes</Text>
                <TextInput
                    style={styles.notesInput}
                    value={notes}
                    onChangeText={setNotes}
                    onBlur={() => updateTodo(id, { notes })}
                    placeholder="Add notes..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.actions}>
                <Pressable style={styles.primaryButton} onPress={() => toggleTodo(id)}>
                    <Text style={styles.primaryButtonText}>{todo.completed ? 'Mark Active' : 'Mark Completed'}</Text>
                </Pressable>
                <Pressable style={styles.dangerButton} onPress={handleDelete}>
                    <Text style={styles.dangerButtonText}>Delete Todo</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#f8fafc',
        flex: 1,
    },
    content: {
        paddingBottom: 32,
    },
    header: {
        backgroundColor: '#4f46e5',
        paddingBottom: 18,
        paddingHorizontal: 20,
    },
    headerBack: {
        color: '#c7d2fe',
        fontSize: 16,
        fontWeight: '600',
    },
    missingScreen: {
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    missingTitle: {
        color: '#6b7280',
        fontSize: 22,
        fontWeight: '700',
    },
    backLink: {
        color: '#4f46e5',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginHorizontal: 16,
        marginTop: 16,
        padding: 18,
        shadowColor: '#111827',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    metaCard: {
        backgroundColor: '#eef2ff',
        borderRadius: 20,
        marginHorizontal: 16,
        marginTop: 12,
        padding: 18,
    },
    todoTitle: {
        color: '#111827',
        fontSize: 28,
        fontWeight: '800',
    },
    statusRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    statusDot: {
        borderRadius: 999,
        height: 12,
        width: 12,
    },
    statusDotActive: {
        backgroundColor: '#f59e0b',
    },
    statusDotComplete: {
        backgroundColor: '#22c55e',
    },
    statusText: {
        color: '#4b5563',
        fontSize: 15,
        fontWeight: '600',
    },
    metaLabel: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    metaValue: {
        color: '#374151',
        fontSize: 14,
        marginTop: 8,
    },
    notesInput: {
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        color: '#111827',
        fontSize: 16,
        marginTop: 12,
        minHeight: 140,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    actions: {
        gap: 12,
        marginTop: 20,
        paddingHorizontal: 16,
    },
    primaryButton: {
        alignItems: 'center',
        backgroundColor: '#4f46e5',
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
    },
    dangerButton: {
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        borderRadius: 18,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    dangerButtonText: {
        color: '#dc2626',
        fontSize: 16,
        fontWeight: '800',
    },
})
