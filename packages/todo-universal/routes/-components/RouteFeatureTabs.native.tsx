import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useMatchRoute, useNavigate } from 'uniwind-router'
import type { TodoListSearch } from '../-router/search'
import type { TodoStatsSearch } from '../-router/stats'

interface Props {
    listSearch: TodoListSearch
    statsSearch: TodoStatsSearch
}

export function RouteFeatureTabs({ listSearch, statsSearch }: Props) {
    const navigate = useNavigate()
    const matchRoute = useMatchRoute()
    const listActive = Boolean(matchRoute({ to: '/', fuzzy: false }))
    const statsActive = Boolean(matchRoute({ to: '/todo/stats', fuzzy: false }))

    return (
        <View style={styles.wrapper}>
            <Text style={styles.caption}>HOOK NAVIGATION</Text>
            <View style={styles.row}>
                <Pressable style={[styles.tab, listActive && styles.tabActive]} onPress={() => navigate({ to: '/', search: listSearch })}>
                    <Text style={[styles.tabLabel, listActive && styles.tabLabelActive]}>Todos</Text>
                </Pressable>
                <Pressable
                    style={[styles.tab, statsActive && styles.tabActive]}
                    onPress={() => navigate({ to: '/todo/stats', search: statsSearch })}
                >
                    <Text style={[styles.tabLabel, statsActive && styles.tabLabelActive]}>Stats</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 10,
        paddingBottom: 12,
        paddingHorizontal: 16,
        paddingTop: 14,
    },
    caption: {
        color: '#c7d2fe',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 2,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    tab: {
        backgroundColor: 'rgba(129, 140, 248, 0.35)',
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    tabActive: {
        backgroundColor: '#ffffff',
    },
    tabLabel: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    tabLabelActive: {
        color: '#4f46e5',
    },
})
