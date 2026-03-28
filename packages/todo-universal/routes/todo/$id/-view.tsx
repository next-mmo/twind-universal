import { useCanGoBack } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'ui/primitives'
import { RecipeCard as Card } from 'ui/recipes'
import { Link, useRouter } from 'uniwind-router'
import { useLayoutInsets } from '../../-hooks/useLayoutInsets'
import { todoDetailRouteApi } from '../../-router/api'
import { defaultTodoDetailSearch, pickTodoListSearch } from '../../-router/search'
import { useTodos } from '../../-store/TodoContext'

export function TodoDetailView() {
    const insets = useLayoutInsets()
    const { id } = todoDetailRouteApi.useParams()
    const navigate = todoDetailRouteApi.useNavigate()
    const search = todoDetailRouteApi.useSearch()
    const canGoBack = useCanGoBack()
    const router = useRouter()
    const { getTodo, toggleTodo, deleteTodo, updateTodo } = useTodos()
    const todo = getTodo(id)
    const [notes, setNotes] = useState(todo?.notes ?? '')

    useEffect(() => {
        setNotes(todo?.notes ?? '')
    }, [todo?.notes])

    const listSearch = pickTodoListSearch(search)

    if (!todo) {
        return (
            <View className="flex-1 bg-white dark:bg-zinc-950 justify-center items-center px-5">
                <Text className="text-zinc-400 text-xl font-semibold">Todo not found</Text>
                <Link to="/" search={listSearch as any}>
                    <Text className="text-indigo-500 font-semibold mt-4 text-base">← Back to list</Text>
                </Link>
            </View>
        )
    }

    const goBack = () => {
        if (canGoBack) {
            router.history.back()
            return
        }

        navigate({ to: '/', search: listSearch })
    }

    const handleDelete = () => {
        deleteTodo(id)
        navigate({ to: '/', search: listSearch })
    }

    const setPanel = (panel: typeof search.panel) => {
        navigate({
            to: '/todo/$id',
            params: { id },
            search: { ...defaultTodoDetailSearch, ...search, panel },
            replace: true,
        })
    }

    return (
        <ScrollView className="flex-1 bg-white dark:bg-zinc-950" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
            <View className="px-5 pb-4 bg-indigo-500" style={{ paddingTop: insets.top + 16 }}>
                <Pressable onPress={goBack}>
                    <Text className="text-indigo-200 font-medium text-base">{canGoBack ? '← Back' : '← Back to list'}</Text>
                </Pressable>
            </View>

            <Card variant="default" className="mx-4 mt-4">
                <Card.Header>
                    <Card.Title className="text-2xl font-bold">{todo.text}</Card.Title>
                    <View className="flex-row items-center gap-2 mt-2">
                        <View className={`w-3 h-3 rounded-full ${todo.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <Card.Description className="text-sm">{todo.completed ? 'Completed' : 'Active'}</Card.Description>
                    </View>
                </Card.Header>
            </Card>

            <View className="mx-4 mt-3 flex-row gap-2">
                <Pressable
                    className={`flex-1 px-4 py-3 rounded-xl items-center ${search.panel === 'summary' ? 'bg-indigo-500' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                    onPress={() => setPanel('summary')}
                >
                    <Text className={search.panel === 'summary' ? 'text-white font-semibold' : 'text-zinc-600 dark:text-zinc-400 font-medium'}>
                        Summary
                    </Text>
                </Pressable>
                <Pressable
                    className={`flex-1 px-4 py-3 rounded-xl items-center ${search.panel === 'notes' ? 'bg-indigo-500' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                    onPress={() => setPanel('notes')}
                >
                    <Text className={search.panel === 'notes' ? 'text-white font-semibold' : 'text-zinc-600 dark:text-zinc-400 font-medium'}>
                        Notes
                    </Text>
                </Pressable>
            </View>

            {search.panel === 'summary' ? (
                <Card variant="transparent" className="mx-4 mt-3">
                    <Card.Body>
                        <Text className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Created</Text>
                        <Text className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{new Date(todo.createdAt).toLocaleString()}</Text>
                    </Card.Body>
                </Card>
            ) : null}

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

            <View className="px-5 mt-3">
                <Text className="text-xs text-zinc-400 dark:text-zinc-600">
                    Typed route search panel={search.panel}, filter={search.filter}, q={search.q || '""'}, sort={search.sort}
                </Text>
            </View>

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
