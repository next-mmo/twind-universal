const { getDefaultConfig } = require('expo/metro-config')
const { resolve } = require('metro-resolver')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const aliasRoots = {
    '@todo': path.join(workspaceRoot, 'packages/todo-universal'),
    '@todo-universal': path.join(workspaceRoot, 'packages/todo-universal'),
    '@uniwind-ui': path.join(workspaceRoot, 'packages/uniwind-ui/src'),
}

function resolveWorkspaceAlias(moduleName) {
    for (const [alias, targetPath] of Object.entries(aliasRoots)) {
        if (moduleName === alias) {
            return targetPath
        }

        if (moduleName.startsWith(`${alias}/`)) {
            return path.join(targetPath, moduleName.slice(alias.length + 1))
        }
    }
}

const config = getDefaultConfig(projectRoot)

config.watchFolders = [
    path.join(workspaceRoot, 'packages/uniwind-router'),
    path.join(workspaceRoot, 'packages/todo-universal'),
    path.join(workspaceRoot, 'packages/uniwind-ui'),
    path.join(workspaceRoot, 'node_modules'),
]

config.resolver.nodeModulesPaths = [path.join(projectRoot, 'node_modules'), path.join(workspaceRoot, 'node_modules')]

config.resolver.extraNodeModules = aliasRoots
config.resolver.resolveRequest = (context, moduleName, platform) => {
    const aliasedModule = resolveWorkspaceAlias(moduleName)
    if (aliasedModule) {
        return resolve({ ...context, resolveRequest: null }, aliasedModule, platform)
    }

    return resolve({ ...context, resolveRequest: null }, moduleName, platform)
}
config.resolver.unstable_enableSymlinks = true
config.resolver.unstable_enablePackageExports = true

module.exports = withUniwindConfig(config, {
    cssEntryFile: './src/global.css',
    dtsPath: './src/uniwind.d.ts',
})
