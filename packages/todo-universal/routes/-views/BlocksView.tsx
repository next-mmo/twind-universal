import { Pressable, ScrollView, Text, View } from 'ui/primitives'
import {
    CalloutBlock,
    FeatureGridBlock,
    Hero3,
    PageIntroBlock,
    ShoppingCartBlock,
    StatsBlock,
    SummaryPanelBlock,
    SurfaceGridBlock,
} from 'ui/blocks'
import { Uniwind, useUniwind } from 'ui/uniwind'
import { useLayoutInsets } from '../-hooks/useLayoutInsets'
import { RouteFeatureTabs } from '../-components/RouteFeatureTabs'
import { blocksRouteApi } from '../-router/api'
import { blockCategories, defaultBlocksSearch, type BlockCategory, type BlocksSearch } from '../-router/blocks'
import { defaultTodoListSearch } from '../-router/search'

// --- Demo data for each block category ---

const marketingBlocks = [
    {
        id: 'hero',
        category: 'marketing' as const,
        label: 'Hero3',
        render: () => (
            <Hero3
                heading="Build universal apps with UniWind"
                description="Cross-platform React Native + Tailwind CSS components that work everywhere."
                buttons={{
                    primary: { text: 'Get Started', url: '#' },
                    secondary: { text: 'View Docs', url: '#' },
                }}
            />
        ),
    },
    {
        id: 'page-intro',
        category: 'marketing' as const,
        label: 'PageIntro',
        render: () => (
            <PageIntroBlock
                eyebrow="Getting Started"
                title="Universal design system"
                description="Build once, run on web, iOS, and Android with beautiful, consistent components."
                stats={[
                    { label: 'Components', value: '25+' },
                    { label: 'Platforms', value: '3' },
                    { label: 'Downloads', value: '10k+' },
                ]}
            />
        ),
    },
    {
        id: 'feature-grid',
        category: 'marketing' as const,
        label: 'FeatureGrid',
        render: () => (
            <FeatureGridBlock
                eyebrow="Features"
                title="Everything you need"
                description="A complete toolkit for building cross-platform apps."
                items={[
                    { title: 'Universal', body: 'One codebase for web, iOS, and Android.', kicker: '01' },
                    { title: 'Performant', body: 'Optimized rendering with native primitives.', kicker: '02' },
                    { title: 'Accessible', body: 'Built-in accessibility for all users.', kicker: '03' },
                ]}
            />
        ),
    },
    {
        id: 'callout',
        category: 'marketing' as const,
        label: 'Callout',
        render: () => (
            <CalloutBlock
                eyebrow="New"
                title="UniWind v2 is here"
                description="CSS-first Tailwind styling with full React Native support."
            />
        ),
    },
    {
        id: 'surface-grid',
        category: 'marketing' as const,
        label: 'SurfaceGrid',
        render: () => (
            <SurfaceGridBlock
                eyebrow="Explore"
                title="Explore our blocks"
                items={[
                    { title: 'Marketing', subtitle: 'Hero sections', body: 'Eye-catching landing page blocks.' },
                    { title: 'E-Commerce', subtitle: 'Shopping flows', body: 'Cart, checkout, and product pages.' },
                    { title: 'Dashboard', subtitle: 'Stats & data', body: 'Analytics and summary panels.' },
                ]}
            />
        ),
    },
]

const ecommerceBlocks = [
    {
        id: 'shopping-cart',
        category: 'ecommerce' as const,
        label: 'ShoppingCart',
        render: () => <ShoppingCartBlock />,
    },
]

const statsBlocks = [
    {
        id: 'stats-block',
        category: 'stats' as const,
        label: 'StatsBlock',
        render: () => (
            <StatsBlock
                eyebrow="Analytics"
                title="Platform metrics"
                description="Key performance indicators across all platforms."
                items={[
                    { label: 'Active Users', value: '12.4k', detail: '+8% this week' },
                    { label: 'Components', value: '25', detail: '3 new this month' },
                    { label: 'Build Time', value: '1.2s', detail: 'avg production build' },
                ]}
            />
        ),
    },
    {
        id: 'summary-panel',
        category: 'stats' as const,
        label: 'SummaryPanel',
        render: () => (
            <SummaryPanelBlock
                eyebrow="Summary"
                title="Project overview"
                meta="Last updated: today"
                items={[
                    { label: 'Framework', value: 'React Native + UniWind' },
                    { label: 'Styling', value: 'Tailwind CSS v4 (CSS-first)' },
                    { label: 'Platforms', value: 'Web, iOS, Android' },
                ]}
            />
        ),
    },
]

const allBlocks = [...marketingBlocks, ...ecommerceBlocks, ...statsBlocks]

function getBlocksByCategory(category: BlockCategory) {
    if (category === 'all') return allBlocks
    return allBlocks.filter(block => block.category === category)
}

export function BlocksView() {
    const insets = useLayoutInsets()
    const { theme } = useUniwind()
    const navigate = blocksRouteApi.useNavigate()
    const search = blocksRouteApi.useSearch()

    const visibleBlocks = getBlocksByCategory(search.category)

    const updateSearch = (patch: Partial<BlocksSearch>) => {
        navigate({
            to: '/blocks',
            search: { ...defaultBlocksSearch, ...search, ...patch },
            replace: true,
        })
    }

    return (
        <View className="flex-1 bg-white dark:bg-zinc-950">
            <View className="px-5 pb-4 bg-indigo-500" style={{ paddingTop: insets.top + 16 }}>
                <Text className="text-3xl font-bold text-white">Blocks</Text>
                <Text className="text-indigo-200 text-sm mt-1">
                    {visibleBlocks.length} block{visibleBlocks.length !== 1 ? 's' : ''} in {search.category}
                </Text>
            </View>

            <View className="bg-indigo-500">
                <RouteFeatureTabs listSearch={defaultTodoListSearch} blocksSearch={search} />
            </View>

            {/* Category sub-filter */}
            <View className="flex-row items-center px-5 py-3 gap-2 border-b border-zinc-200 dark:border-zinc-800">
                {blockCategories.map(cat => {
                    const isActive = search.category === cat.key
                    const count = getBlocksByCategory(cat.key).length

                    return (
                        <Pressable
                            key={cat.key}
                            className={`px-4 py-2 rounded-lg ${isActive ? 'bg-indigo-500' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                            onPress={() => updateSearch({ category: cat.key })}
                        >
                            <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                {cat.label} ({count})
                            </Text>
                        </Pressable>
                    )
                })}
            </View>

            <ScrollView className="flex-1">
                {visibleBlocks.length === 0 ? (
                    <View className="items-center py-16 px-6">
                        <Text className="text-zinc-400 dark:text-zinc-600 text-lg text-center">
                            No blocks in this category
                        </Text>
                    </View>
                ) : (
                    <View className="gap-8 py-6 px-4">
                        {visibleBlocks.map(block => (
                            <View key={block.id} className="gap-3">
                                <View className="flex-row items-center gap-2 px-1">
                                    <View className="h-2 w-2 rounded-full bg-indigo-500" />
                                    <Text className="text-xs uppercase tracking-[0.15em] font-semibold text-zinc-400 dark:text-zinc-500">
                                        {block.label}
                                    </Text>
                                    <Text className="text-xs text-zinc-300 dark:text-zinc-700">
                                        — {block.category}
                                    </Text>
                                </View>
                                <View className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                                    {block.render()}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <View
                className="px-5 py-3 flex-row justify-between items-center border-t border-zinc-200 dark:border-zinc-800"
                style={{ paddingBottom: insets.bottom + 12 }}
            >
                <Pressable onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Text className="text-zinc-500 text-sm">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</Text>
                </Pressable>
                <Text className="text-xs text-zinc-400 dark:text-zinc-600">
                    category={search.category}
                </Text>
            </View>
        </View>
    )
}
