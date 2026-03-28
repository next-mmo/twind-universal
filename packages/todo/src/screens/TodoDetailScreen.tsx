import { useEffect, useState } from 'react'
import { Card, Pressable, ScrollView, Text, TextInput, View } from 'uniwind-ui'
import { Link, useNavigate, useParams } from 'uniwind-router'
import { useTodos } from '../features/todo/TodoContext'

export function TodoDetailScreen() {
    const { id } = useParams({ from: '/todo/$id' })
    const navigate = useNavigate()
    const { getTodo, toggleTodo, deleteTodo, updateTodo } = useTodos()
    const todo = getTodo(id)
    const [notes, setNotes] = useState(todo?.notes ?? '')

    useEffect(() => {
        setNotes(todo?.notes ?? '')
    }, [todo?.notes])

    if (!todo) {
        return (
            <View className="flex-1 bg-white dark:bg-zinc-950 justify-center items-center px-5">
                <Text className="text-zinc-400 text-xl">Todo not found</Text>
                <Link to="/">
                    <Text className="text-indigo-500 font-semibold mt-4 text-base">← Back to list</Text>
                </Link>
            </View>
        )
    }

    const handleDelete = () => {
        deleteTodo(id)
        navigate({ to: '/' })
    }

    return (
        <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
            {/* Header / Back */}
            <View className="px-5 pt-14 pb-4 bg-indigo-500">
                <Link to="/">
                    <Text className="text-indigo-200 font-medium text-base">← Back</Text>
                </Link>
            </View>

            {/* Title & Status */}
            <Card variant="default" className="mx-4 mt-4">
                <Card.Header>
                    <Card.Title className="text-2xl font-bold">{todo.text}</Card.Title>
                    <View className="flex-row items-center gap-2 mt-2">
                        <View className={`w-3 h-3 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <Card.Description className="text-sm">{todo.completed ? 'Completed' : 'Active'}</Card.Description>
                    </View>
                </Card.Header>
            </Card>

            {/* Created */}
            <Card variant="transparent" className="mx-4 mt-3">
                <Card.Body>
                    <Text className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Created</Text>
                    <Text className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{new Date(todo.createdAt).toLocaleString()}</Text>
                </Card.Body>
            </Card>

            {/* Notes */}
            <Card variant="default" className="mx-4 mt-3">
                <Card.Header>
                    <Card.Title className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Notes</Card.Title>
                </Card.Header>
                <Card.Body>
                    <TextInput
                        className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-base text-zinc-900 dark:text-zinc-100 min-h-[120px]"
                        value={notes}
                        onChangeText={setNotes}
                        onBlur={() => updateTodo(id, { notes })}
                        placeholder="Add notes..."
                        placeholderTextColor="#a1a1aa"
                        multiline
                        textAlignVertical="top"
                    />
                </Card.Body>
            </Card>

            {/* Actions */}
            <View className="px-5 gap-3 pb-10 mt-4">
                <Pressable className="bg-indigo-500 px-6 py-4 rounded-xl items-center active:opacity-80" onPress={() => toggleTodo(id)}>
                    <Text className="text-white font-semibold text-base">{todo.completed ? 'Mark Active' : 'Mark Completed'}</Text>
                </Pressable>
                <Pressable className="bg-red-50 dark:bg-red-950 px-6 py-4 rounded-xl items-center active:opacity-80" onPress={handleDelete}>
                    <Text className="text-red-500 font-semibold text-base">Delete Todo</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}
