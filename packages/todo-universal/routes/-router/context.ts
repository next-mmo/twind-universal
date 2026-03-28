export type TodoRuntimePlatform = 'web' | 'bare' | 'expo'

export interface TodoRouterContext {
    appName: string
    platform: TodoRuntimePlatform
}
