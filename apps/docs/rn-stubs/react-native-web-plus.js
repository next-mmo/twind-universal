/**
 * `react-native` entry for Vite web: re-exports react-native-web plus APIs some libs expect from RN.
 */
export * from 'react-native-web'
import codegenNativeComponent from './codegenNativeComponent.js'
export { codegenNativeComponent }

export const TurboModuleRegistry = {
    get: () => null,
    getEnforcing: () => {
        throw new Error('TurboModule not available on web')
    },
}

export const codegenNativeCommands = () => ({})
