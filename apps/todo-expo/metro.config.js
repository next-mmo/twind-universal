const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const uiPackageSrc = path.join(workspaceRoot, 'packages/ui/src')
const appResolverOrigin = path.join(projectRoot, 'package.json')
const tinyWarningCjsPath = path.join(workspaceRoot, 'node_modules/tiny-warning/dist/tiny-warning.cjs.js')
const tanstackIsServerClientPath = path.join(workspaceRoot, 'node_modules/@tanstack/router-core/src/isServer/client.ts')
const tanstackPackageRoot = path.join(workspaceRoot, 'node_modules/@tanstack')

const tanstackAliases = {
    '@tanstack/history': path.join(tanstackPackageRoot, 'history'),
    '@tanstack/react-router': path.join(tanstackPackageRoot, 'react-router'),
    '@tanstack/react-store': path.join(tanstackPackageRoot, 'react-store'),
    '@tanstack/router-core': path.join(tanstackPackageRoot, 'router-core'),
    '@tanstack/store': path.join(tanstackPackageRoot, 'store'),
}

const aliasRoots = {
    '@todo': path.join(workspaceRoot, 'packages/todo-universal'),
    '@todo-universal': path.join(workspaceRoot, 'packages/todo-universal'),
    ...tanstackAliases,
    react: path.join(workspaceRoot, 'node_modules/react'),
    'react-native': path.join(workspaceRoot, 'node_modules/react-native'),
    ui: uiPackageSrc,
}

const config = getDefaultConfig(projectRoot)

config.watchFolders = [
    path.join(workspaceRoot, 'packages/ui'),
    path.join(workspaceRoot, 'packages/uniwind-router'),
    path.join(workspaceRoot, 'packages/todo-universal'),
    path.join(workspaceRoot, 'node_modules'),
]

config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules'), path.join(workspaceRoot, 'node_modules')]
config.resolver.disableHierarchicalLookup = true

config.resolver.extraNodeModules = aliasRoots
const uiReusablesRoot = path.join(workspaceRoot, 'packages/ui/reusables')

config.resolver.resolveRequest = (context, moduleName, platform) => {
    const shouldResolveFromAppRoot =
        moduleName === 'react'
        || moduleName === 'react-native'
        || moduleName.startsWith('react-native/')
        || moduleName.startsWith('@react-native/')

    if (shouldResolveFromAppRoot) {
        return context.resolveRequest({ ...context, originModulePath: appResolverOrigin }, moduleName, platform)
    }

    if (moduleName === 'tiny-warning') {
        return context.resolveRequest(context, tinyWarningCjsPath, platform)
    }

    if (moduleName === '@tanstack/router-core/isServer') {
        return context.resolveRequest(context, tanstackIsServerClientPath, platform)
    }

    const tanstackAlias = Object.entries(tanstackAliases).find(([packageName]) => moduleName === packageName || moduleName.startsWith(`${packageName}/`))

    if (tanstackAlias) {
        const [packageName, packageRoot] = tanstackAlias
        const subpath = moduleName.slice(packageName.length)
        return context.resolveRequest(context, `${packageRoot}${subpath}`, platform)
    }

    // Resolve @/ aliases from ui package (matches packages/ui/tsconfig.json paths)
    if (moduleName.startsWith('@/')) {
        const relativePath = moduleName.slice(2) // strip '@/'
        const resolved = path.join(uiReusablesRoot, relativePath)
        return context.resolveRequest(context, resolved, platform)
    }

    return context.resolveRequest(context, moduleName, platform)
}
config.resolver.unstable_enableSymlinks = true
config.resolver.unstable_enablePackageExports = true

module.exports = withUniwindConfig(config, {
    cssEntryFile: './src/global.css',
    dtsPath: './src/uniwind.d.ts',
})
