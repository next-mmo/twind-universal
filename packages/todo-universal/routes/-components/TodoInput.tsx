import { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'ui/primitives'

interface Props {
    onAdd: (text: string) => void
}

export function TodoInput({ onAdd }: Props) {
    const [text, setText] = useState('')

    const handleSubmit = () => {
        const trimmed = text.trim()
        if (!trimmed) return
        onAdd(trimmed)
        setText('')
    }

    return (
        <View className="flex-row items-center px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 gap-3">
            <TextInput
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-base text-zinc-900 dark:text-zinc-100"
                placeholder="What needs to be done?"
                placeholderTextColor="#a1a1aa"
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
            />
            <Pressable className="bg-indigo-500 rounded-xl px-5 py-3 active:opacity-80" onPress={handleSubmit}>
                <Text className="text-white font-semibold text-base">Add</Text>
            </Pressable>
        </View>
    )
}
