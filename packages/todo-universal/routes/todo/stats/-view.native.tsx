import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
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
    const insets = useSafeAreaInsets()
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
        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <Text style={styles.headerTitle}>Route Stats</Text>
                <Text style={styles.headerSubtitle}>{routeContext.sectionTitle}</Text>
            </View>

            <View style={styles.headerNav}>
                <RouteFeatureTabs listSearch={listSearch} statsSearch={search} />
            </View>

            <View style={styles.panel}>
                <View style={styles.row}>
                    {focusOptions.map(option => {
                        const active = search.focus === option.key

                        return (
                            <Pressable
                                key={option.key}
                                style={[styles.chip, active && styles.chipActive]}
                                onPress={() => navigate({ to: '/todo/stats', search: { ...defaultTodoStatsSearch, ...search, focus: option.key } })}
                            >
                                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{option.label}</Text>
                            </Pressable>
                        )
                    })}
                </View>

                <View style={styles.row}>
                    {viewOptions.map(option => {
                        const active = search.view === option.key

                        return (
                            <Pressable
                                key={option.key}
                                style={[styles.chip, active && styles.darkChipActive]}
                                onPress={() => navigate({ to: '/todo/stats', search: { ...defaultTodoStatsSearch, ...search, view: option.key } })}
                            >
                                <Text style={[styles.chipLabel, active && styles.darkChipLabelActive]}>{option.label}</Text>
                            </Pressable>
                        )
                    })}
                </View>

                <Pressable onPress={() => navigate({ to: '/', search: defaultTodoListSearch })}>
                    <Text style={styles.demoLink}>Reset back to list defaults</Text>
                </Pressable>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>{loaderData.headline}</Text>
                <Text style={styles.cardSubtle}>
                    {loaderData.platform} / {loaderData.appName}
                </Text>
                <Text style={styles.cardBody}>{loaderData.summary}</Text>
                <Text style={styles.cardTimestamp}>Generated {loaderData.generatedAt}</Text>
            </View>

            <View style={styles.cardGrid}>
                {loaderData.cards.map(card => (
                    <View key={card.label} style={styles.miniCard}>
                        <Text style={styles.miniLabel}>{card.label}</Text>
                        <Text style={styles.miniValue}>{card.value}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.miniLabel}>Hook Snapshot</Text>
                <Text style={styles.cardBody}>
                    Path: {location.pathname}
                    {'\n'}
                    Loader deps: {loaderDeps.filter} / {loaderDeps.focus} / {loaderDeps.sort} / {loaderDeps.q || 'none'}
                    {'\n'}
                    Route tone: {routeContext.sectionTone}
                </Text>
            </View>

            {search.view === 'raw' ? (
                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}>Raw Loader Payload</Text>
                    <Text style={styles.codeText}>{JSON.stringify(loaderData.rawPayload, null, 2)}</Text>
                </View>
            ) : (
                <Text style={styles.footerHint}>
                    Route hooks used here: useSearch, useNavigate, useLoaderData, useLoaderDeps, useRouteContext, useLocation.
                </Text>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: '#f8fafc',
        flex: 1,
    },
    content: {
        paddingBottom: 24,
    },
    header: {
        backgroundColor: '#4f46e5',
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerNav: {
        backgroundColor: '#4f46e5',
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: '800',
    },
    headerSubtitle: {
        color: '#c7d2fe',
        fontSize: 14,
        marginTop: 6,
    },
    panel: {
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: '#e5e7eb',
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    chipActive: {
        backgroundColor: '#4f46e5',
    },
    darkChipActive: {
        backgroundColor: '#111827',
    },
    chipLabel: {
        color: '#4b5563',
        fontSize: 13,
        fontWeight: '700',
    },
    chipLabelActive: {
        color: '#ffffff',
    },
    darkChipLabelActive: {
        color: '#ffffff',
    },
    demoLink: {
        color: '#4f46e5',
        fontSize: 13,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginHorizontal: 16,
        marginTop: 12,
        padding: 18,
        shadowColor: '#111827',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    cardTitle: {
        color: '#111827',
        fontSize: 24,
        fontWeight: '800',
    },
    cardSubtle: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 8,
    },
    cardBody: {
        color: '#4b5563',
        fontSize: 14,
        lineHeight: 22,
        marginTop: 12,
    },
    cardTimestamp: {
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 12,
    },
    cardGrid: {
        gap: 12,
        marginHorizontal: 16,
        marginTop: 12,
    },
    miniCard: {
        backgroundColor: '#eef2ff',
        borderRadius: 18,
        padding: 16,
    },
    miniLabel: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    miniValue: {
        color: '#111827',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 8,
    },
    codeCard: {
        backgroundColor: '#111827',
        borderRadius: 20,
        marginHorizontal: 16,
        marginTop: 12,
        padding: 18,
    },
    codeLabel: {
        color: '#6b7280',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    codeText: {
        color: '#f9fafb',
        fontFamily: 'Courier',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 12,
    },
    footerHint: {
        color: '#6b7280',
        fontSize: 12,
        lineHeight: 18,
        marginHorizontal: 16,
        marginTop: 16,
    },
})
