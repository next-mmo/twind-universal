import { createMemoryStorageAdapter, type TodoStorageAdapter } from './storage.shared'

function getBrowserStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
    if (typeof localStorage === 'undefined') {
        return null
    }

    if (typeof localStorage.getItem !== 'function' || typeof localStorage.setItem !== 'function') {
        return null
    }

    return localStorage
}

const browserStorage = getBrowserStorage()

export const todoStorage: TodoStorageAdapter = browserStorage
    ? {
          kind: 'local-storage',
          load(key) {
              return browserStorage.getItem(key)
          },
          save(key, value) {
              browserStorage.setItem(key, value)
          },
      }
    : createMemoryStorageAdapter()
