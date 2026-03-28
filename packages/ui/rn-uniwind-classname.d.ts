/// <reference types="uniwind/types" />

/**
 * UniWind adds `className` to React Native primitives at runtime; this file aligns TypeScript.
 */
declare module 'react-native' {
    interface ViewProps {
        className?: string
    }
    interface TextProps {
        className?: string
    }
    interface ImageProps {
        className?: string
    }
    interface TextInputProps {
        className?: string
        /** Used by RNR input/textarea wrappers for web placeholder styling. */
        placeholderClassName?: string
    }
    interface PressableProps {
        className?: string
    }
    interface ScrollViewProps {
        className?: string
    }
}

declare module 'lucide-react-native' {
    interface LucideProps {
        className?: string
    }
}

export {}
