import { Card, Pressable, View } from 'uniwind-ui'
import { Link } from 'uniwind-router'
import type { Todo } from '../types'

interface Props {
    todo: Todo
    onToggle: (id: string) => void
}

export function TodoItem({ todo, onToggle }: Props) {
    return (
        <Card variant="default" className="mx-4 mb-3">
            <Card.Body className="flex-row items-center">
                {/* Checkbox */}
                <Pressable
                    className="w-7 h-7 rounded-full border-2 border-indigo-500 mr-4 items-center justify-center"
                    onPress={() => onToggle(todo.id)}
                >
                    {todo.completed && <View className="w-4 h-4 rounded-full bg-indigo-500" />}
                </Pressable>

                {/* Text */}
                <Link to="/todo/$id" params={{ id: todo.id }} className="flex-1">
                    <View className="flex-1 justify-center min-h-[28px]">
                        <Card.Title
                            className={todo.completed ? 'text-zinc-400 line-through text-base' : 'text-zinc-900 dark:text-zinc-100 text-base'}
                        >
                            {todo.text}
                        </Card.Title>
                        {todo.notes ? (
                            <Card.Description className="text-xs mt-0.5" numberOfLines={1}>
                                {todo.notes}
                            </Card.Description>
                        ) : null}
                    </View>
                </Link>
            </Card.Body>
        </Card>
    )
}
