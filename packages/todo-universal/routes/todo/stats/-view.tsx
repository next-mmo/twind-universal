import { Card, Pressable, ScrollView, Text, View } from 'uniwind-ui'
import { useLocation } from 'uniwind-router'
import { RouteFeatureTabs } from '../../-components/RouteFeatureTabs'
import { todoStatsRouteApi } from '../../-router/api'
import { defaultTodoListSearch } from '../../-router/search'
import { defaultTodoStatsSearch } from '../../-router/stats'

const focusOptions = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
] as const

const viewOptions = [
    { key: 'summary', label: 'Summary' },
    { key: 'raw', label: 'Raw' },
] as const

export function TodoStatsView() {
    const navigate = todoStatsRouteApi.useNavigate()
    const search = todoStatsRouteApi.useSearch()
    const loaderData = todoStatsRouteApi.useLoaderData()
    const loaderDeps = todoStatsRouteApi.useLoaderDeps()
    const routeContext = todoStatsRouteApi.useRouteContext()
    const location = useLocation()
    const listSearch = {
        filter: search.filter,
        q: search.q,
        sort: search.sort,
    }

    return (
        <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
            <View className="px-5 pt-14 pb-4 bg-indigo-500">
                <Text className="text-3xl font-bold text-white">Route Stats</Text>
                <Text className="text-indigo-200 text-sm mt-1">{routeContext.sectionTitle}</Text>
            </View>

            <View className="bg-indigo-500">
                <RouteFeatureTabs listSearch={listSearch} statsSearch={search} />
            </View>

            <View className="px-5 py-4 gap-3 border-b border-zinc-200 dark:border-zinc-800">
                <View className="flex-row flex-wrap gap-2">
                    {focusOptions.map(option => {
                        const active = search.focus === option.key

                        return (
                            <Pressable
                                key={option.key}
                                className={`px-4 py-2 rounded-xl ${active ? 'bg-indigo-500' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                                onPress={() => navigate({ to: '/todo/stats', search: { ...defaultTodoStatsSearch, ...search, focus: option.key } })}
                            >
                                <Text className={active ? 'text-white font-semibold' : 'text-zinc-600 dark:text-zinc-400 font-medium'}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>

                <View className="flex-row flex-wrap gap-2">
                    {viewOptions.map(option => {
                        const active = search.view === option.key

                        return (
                            <Pressable
                                key={option.key}
                                className={`px-4 py-2 rounded-xl ${active ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                                onPress={() => navigate({ to: '/todo/stats', search: { ...defaultTodoStatsSearch, ...search, view: option.key } })}
                            >
                                <Text className={active ? 'text-white dark:text-zinc-900 font-semibold' : 'text-zinc-600 dark:text-zinc-400 font-medium'}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>

                <Pressable onPress={() => navigate({ to: '/', search: defaultTodoListSearch })}>
                    <Text className="text-indigo-500 text-sm font-medium">Reset back to list defaults</Text>
                </Pressable>
            </View>

            <Card variant="default" className="mx-4 mt-4">
                <Card.Header>
                    <Card.Title>{loaderData.headline}</Card.Title>
                    <Card.Description>
                        {loaderData.platform} / {loaderData.appName}
                    </Card.Description>
                </Card.Header>
                <Card.Body className="gap-2">
                    <Text className="text-sm text-zinc-600 dark:text-zinc-300">{loaderData.summary}</Text>
                    <Text className="text-xs text-zinc-400 dark:text-zinc-600">Generated {loaderData.generatedAt}</Text>
                </Card.Body>
            </Card>

            <View className="mx-4 mt-4 gap-3">
                {loaderData.cards.map(card => (
                    <Card key={card.label} variant="transparent">
                        <Card.Body className="gap-1">
                            <Text className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">{card.label}</Text>
                            <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{card.value}</Text>
                        </Card.Body>
                    </Card>
                ))}
            </View>

            <View className="mx-4 mt-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-4">
                <Text className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Hook Snapshot</Text>
                <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                    Location: {location.pathname}
                    {'\n'}
                    Loader deps: {loaderDeps.filter} / {loaderDeps.focus} / {loaderDeps.sort} / {loaderDeps.q || 'none'}
                    {'\n'}
                    Route tone: {routeContext.sectionTone}
                </Text>
            </View>

            {search.view === 'raw' ? (
                <View className="mx-4 mt-4 mb-8 rounded-2xl bg-zinc-950 p-4">
                    <Text className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Raw Loader Payload</Text>
                    <Text className="mt-3 text-xs leading-5 text-zinc-100 font-mono">
                        {JSON.stringify(loaderData.rawPayload, null, 2)}
                    </Text>
                </View>
            ) : (
                <View className="px-5 pt-4 pb-8">
                    <Text className="text-xs text-zinc-400 dark:text-zinc-600">
                        Route hooks used here: useSearch, useNavigate, useLoaderData, useLoaderDeps, useRouteContext, useLocation.
                    </Text>
                </View>
            )}
        </ScrollView>
    )
}
