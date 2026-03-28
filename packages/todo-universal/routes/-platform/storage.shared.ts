export interface TodoStorageAdapter {
    kind: 'memory' | 'local-storage'
    load: (key: string) => string | null
    save: (key: string, value: string) => void
}

export function createMemoryStorageAdapter(): TodoStorageAdapter {
    const memoryStore = new Map<string, string>()

    return {
        kind: 'memory',
        load(key) {
            return memoryStore.get(key) ?? null
        },
        save(key, value) {
            memoryStore.set(key, value)
        },
    }
}
