import { createFileRoute } from '@tanstack/react-router'
import { ScrollView, Text, View } from 'uniwind/components'

export const Route = createFileRoute('/about')({
    ssr: false,
    component: About,
})

function About() {
    return (
        <ScrollView className="flex-1 min-h-screen bg-background">
            <View className="max-w-2xl mx-auto px-6 py-16 gap-8">
                {/* Header */}
                <View className="gap-3">
                    <Text className="text-3xl font-bold text-foreground">About This Example</Text>
                    <Text className="text-lg text-muted leading-relaxed">
                        This app demonstrates Uniwind running inside TanStack Start — a full-stack React framework powered by Vite.
                    </Text>
                </View>

                {/* How it works */}
                <View className="gap-4">
                    <Text className="text-2xl font-semibold text-foreground">How It Works</Text>

                    <InfoRow
                        number="1"
                        title="Same Vite Plugin"
                        text="The existing uniwind/vite plugin is added to vite.config.ts — no new plugin needed."
                    />
                    <InfoRow
                        number="2"
                        title="LightningCSS Visitor"
                        text="CSS transformation happens at build time via the UniwindCSSVisitor, producing scoped theme rules."
                    />
                    <InfoRow
                        number="3"
                        title="React Native Web"
                        text="Components like View, Text, and Pressable are aliased to react-native-web with className bindings."
                    />
                    <InfoRow
                        number="4"
                        title="SSR Compatible"
                        text="TanStack Start renders on the server by default. Routes can opt out with ssr: false."
                    />
                </View>

                {/* Nav */}
                <View className="pt-4">
                    <Text className="text-accent font-medium">← Back to Home (use browser back)</Text>
                </View>
            </View>
        </ScrollView>
    )
}

function InfoRow({ number, title, text }: { number: string; title: string; text: string }) {
    return (
        <View className="flex-row gap-4 items-start">
            <View className="bg-accent/20 w-8 h-8 rounded-full items-center justify-center shrink-0">
                <Text className="text-accent font-bold text-sm">{number}</Text>
            </View>
            <View className="flex-1 gap-1">
                <Text className="text-base font-semibold text-foreground">{title}</Text>
                <Text className="text-sm text-muted leading-relaxed">{text}</Text>
            </View>
        </View>
    )
}
