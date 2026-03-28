const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const uiPackageSrc = path.join(workspaceRoot, 'packages/ui/src')
const appResolverOrigin = path.join(projectRoot, 'package.json')

const aliasRoots = {
    '@todo': path.join(workspaceRoot, 'packages/todo-universal'),
    '@todo-universal': path.join(workspaceRoot, 'packages/todo-universal'),
    react: path.join(workspaceRoot, 'node_modules/react'),
    'react-native': path.join(workspaceRoot, 'node_modules/react-native'),
    ui: uiPackageSrc,
    'uniwind-ui': path.join(workspaceRoot, 'packages/uniwind-ui/src'),
    '@uniwind-ui': path.join(workspaceRoot, 'packages/uniwind-ui/src'),
}

const config = getDefaultConfig(projectRoot)

config.watchFolders = [
    path.join(workspaceRoot, 'packages/ui'),
    path.join(workspaceRoot, 'packages/uniwind-router'),
    path.join(workspaceRoot, 'packages/todo-universal'),
    path.join(workspaceRoot, 'packages/uniwind-ui'),
    path.join(workspaceRoot, 'node_modules'),
]

config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules'), path.join(workspaceRoot, 'node_modules')]

config.resolver.extraNodeModules = aliasRoots
config.resolver.resolveRequest = (context, moduleName, platform) => {
    const shouldResolveFromAppRoot =
        moduleName === 'react'
        || moduleName === 'react-native'
        || moduleName.startsWith('react-native/')
        || moduleName.startsWith('@react-native/')

    if (shouldResolveFromAppRoot) {
        return context.resolveRequest({ ...context, originModulePath: appResolverOrigin }, moduleName, platform)
    }

    return context.resolveRequest(context, moduleName, platform)
}
config.resolver.unstable_enableSymlinks = true
config.resolver.unstable_enablePackageExports = true

module.exports = withUniwindConfig(config, {
    cssEntryFile: './src/global.css',
    dtsPath: './src/uniwind.d.ts',
})
