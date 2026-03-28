const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { resolve } = require('metro-resolver')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')
const aliasRoots = {
    '@todo': path.join(workspaceRoot, 'packages/todo/src'),
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

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [
        path.join(workspaceRoot, 'packages/uniwind-router'),
        path.join(workspaceRoot, 'packages/todo/src'),
        path.join(workspaceRoot, 'packages/uniwind-ui'),
        path.join(workspaceRoot, 'node_modules'),
    ],
    resolver: {
        nodeModulesPaths: [path.join(projectRoot, 'node_modules'), path.join(workspaceRoot, 'node_modules')],
        extraNodeModules: aliasRoots,
        resolveRequest: (context, moduleName, platform) => {
            const aliasedModule = resolveWorkspaceAlias(moduleName)
            if (aliasedModule) {
                return resolve({ ...context, resolveRequest: null }, aliasedModule, platform)
            }

            return resolve({ ...context, resolveRequest: null }, moduleName, platform)
        },
        unstable_enableSymlinks: true,
        unstable_enablePackageExports: true,
    },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
