/**
 * Button — re-exported from call-ui
 *
 * Previously this imported from react-native directly.
 * Now uses the call-ui / uniwind component stack.
 */
import { Pressable, Text } from 'call-ui'

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
    title: string
}

export function Button({ title, ...props }: ButtonProps) {
    return (
        <Pressable className="bg-indigo-500 px-4 py-2 rounded-md active:opacity-80" {...props}>
            <Text className="text-white font-medium text-center">{title}</Text>
        </Pressable>
    )
}
