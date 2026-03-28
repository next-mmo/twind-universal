/**
 * createUniversalHistory — auto-detect platform and create the right history.
 *
 * On web: createBrowserHistory (URL-based)
 * On native: createMemoryHistory (in-memory)
 */
import { createBrowserHistory, createMemoryHistory } from '@tanstack/history'

export type HistoryType = 'browser' | 'memory' | 'hash'

interface CreateUniversalHistoryOptions {
    /** Force a specific history type. Auto-detects if not provided. */
    type?: HistoryType
    /** Initial entries for memory history. Default: ['/'] */
    initialEntries?: string[]
}

export function createUniversalHistory(options: CreateUniversalHistoryOptions = {}) {
    const { type, initialEntries = ['/'] } = options

    const historyType = type ?? detectHistoryType()

    switch (historyType) {
        case 'browser':
            return createBrowserHistory()
        case 'memory':
            return createMemoryHistory({ initialEntries })
        default:
            return createMemoryHistory({ initialEntries })
    }
}

function detectHistoryType(): HistoryType {
    // Check for browser environment
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        return 'browser'
    }

    // React Native or SSR → memory
    return 'memory'
}
