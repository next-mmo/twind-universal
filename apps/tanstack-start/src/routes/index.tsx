import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Uniwind, useUniwind } from 'uniwind'
import { Pressable, Text, View } from 'uniwind/components'

export const Route = createFileRoute('/')({
    // react-native-web requires browser APIs, disable SSR for this route
    ssr: false,
    component: Home,
})

const THEMES = ['light', 'dark', 'premium'] as const

function Home() {
    const { theme } = useUniwind()
    const [count, setCount] = useState(0)

    const cycleTheme = () => {
        const currentIndex = THEMES.indexOf(theme as (typeof THEMES)[number])
        const nextIndex = (currentIndex + 1) % THEMES.length
        Uniwind.setTheme(THEMES[nextIndex])
    }

    return (
        <View className="flex-1 min-h-screen bg-background justify-center items-center gap-8">
            {/* Header */}
            <View className="items-center gap-3">
                <Text className="text-4xl font-bold text-foreground">Uniwind + TanStack Start</Text>
                <Text className="text-lg text-muted">Full-stack React with Tailwind bindings for React Native</Text>
            </View>

            {/* Theme Indicator */}
            <View className="bg-accent/10 rounded-2xl px-6 py-4 items-center gap-2">
                <Text className="text-sm text-muted uppercase tracking-widest">Current Theme</Text>
                <Text className="text-2xl font-semibold text-accent">{theme}</Text>
            </View>

            {/* Counter */}
            <View className="items-center gap-4">
                <Text className="text-6xl font-bold text-foreground">{count}</Text>
                <View className="flex-row gap-3">
                    <Pressable className="bg-accent px-6 py-3 rounded-xl active:opacity-80" onPress={() => setCount(c => c - 1)}>
                        <Text className="text-white font-semibold text-lg">− Decrease</Text>
                    </Pressable>
                    <Pressable className="bg-accent px-6 py-3 rounded-xl active:opacity-80" onPress={() => setCount(c => c + 1)}>
                        <Text className="text-white font-semibold text-lg">+ Increase</Text>
                    </Pressable>
                </View>
            </View>

            {/* Theme Switcher */}
            <Pressable className="bg-foreground/10 px-6 py-3 rounded-xl active:opacity-80" onPress={cycleTheme}>
                <Text className="text-foreground font-medium">Switch Theme →</Text>
            </Pressable>

            {/* Feature Cards */}
            <View className="flex-row gap-4 flex-wrap justify-center max-w-2xl px-4">
                <FeatureCard emoji="⚡" title="Vite-powered" description="Same Vite plugin, works out of the box" />
                <FeatureCard emoji="🎨" title="Multi-theme" description="Light, dark, and custom themes" />
                <FeatureCard emoji="🔄" title="SSR Ready" description="Selective SSR per route" />
            </View>
        </View>
    )
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
    return (
        <View className="bg-foreground/5 rounded-2xl px-5 py-4 items-center gap-2 min-w-[160px]">
            <Text className="text-3xl">{emoji}</Text>
            <Text className="text-base font-semibold text-foreground">{title}</Text>
            <Text className="text-sm text-muted text-center">{description}</Text>
        </View>
    )
}
