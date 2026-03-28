import { useSafeAreaInsets } from 'react-native-safe-area-context'

/** Shared safe-area insets for headers/scroll padding (web: 0 unless SafeAreaProvider wraps the tree). */
export function useLayoutInsets() {
    return useSafeAreaInsets()
}
