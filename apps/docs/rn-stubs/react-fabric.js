/**
 * Web shim for `react-native/Libraries/Renderer/shims/ReactFabric` (used by reanimated, etc.).
 */
const noop = () => null
export const findHostInstance_DEPRECATED = noop
const ReactFabric = {
    findHostInstance_DEPRECATED: noop,
    default: { findHostInstance_DEPRECATED: noop },
}
export default ReactFabric
