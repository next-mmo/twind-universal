import { spawn } from 'node:child_process'
import { existsSync, watch } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { Generator, getConfig } from '@tanstack/router-generator'

type Mode = 'generate' | 'watch'

interface TargetConfig {
    appRoot?: string
    disableLogging?: boolean
    generatedRouteTree: string
    routesDirectory?: string
}

interface RouteWatchConfig {
    disableLogging?: boolean
    routesDirectory?: string
    targets: Record<string, TargetConfig>
}

interface ResolvedTarget {
    appRoot: string
    disableLogging: boolean
    generatedRouteTree: string
    name: string
    routesDirectory: string
}

interface CliState {
    command: string[] | null
    configPath?: string
    mode: Mode
    selectedTargetNames: string[]
    singleTargetOverrides: Partial<Omit<ResolvedTarget, 'name' | 'disableLogging'>> & {
        disableLogging?: boolean
    }
}

const CONFIG_FILENAME = 'uniwind.routes.json'

function parseArgs(argv: string[]): CliState {
    const [modeToken, ...rest] = argv
    const mode = modeToken as Mode

    if (mode !== 'generate' && mode !== 'watch') {
        throw new Error(`Unknown mode "${modeToken}". Expected "generate" or "watch".`)
    }

    const state: CliState = {
        command: null,
        mode,
        selectedTargetNames: [],
        singleTargetOverrides: {},
    }

    const separatorIndex = rest.indexOf('--')
    const argTokens = separatorIndex === -1 ? rest : rest.slice(0, separatorIndex)
    state.command = separatorIndex === -1 ? null : rest.slice(separatorIndex + 1)

    for (let index = 0; index < argTokens.length; index += 1) {
        const token = argTokens[index]

        if (token === '--disable-logging') {
            state.singleTargetOverrides.disableLogging = true
            continue
        }

        if (!token.startsWith('--')) {
            throw new Error(`Unexpected argument "${token}"`)
        }

        const optionName = token.slice(2)
        const optionValue = argTokens[index + 1]

        if (!optionValue || optionValue.startsWith('--')) {
            throw new Error(`Missing value for option "${token}"`)
        }

        index += 1

        if (optionName === 'config') {
            state.configPath = optionValue
            continue
        }

        if (optionName === 'target') {
            state.selectedTargetNames.push(optionValue)
            continue
        }

        if (optionName === 'app-root') {
            state.singleTargetOverrides.appRoot = optionValue
            continue
        }

        if (optionName === 'routes-dir') {
            state.singleTargetOverrides.routesDirectory = optionValue
            continue
        }

        if (optionName === 'generated-route-tree') {
            state.singleTargetOverrides.generatedRouteTree = optionValue
            continue
        }

        throw new Error(`Unknown option "${token}"`)
    }

    return state
}

function findConfigPath(startDirectory: string): string | null {
    let currentDirectory = startDirectory

    while (true) {
        const candidate = path.join(currentDirectory, CONFIG_FILENAME)
        if (existsSync(candidate)) {
            return candidate
        }

        const parentDirectory = path.dirname(currentDirectory)
        if (parentDirectory === currentDirectory) {
            return null
        }

        currentDirectory = parentDirectory
    }
}

async function loadConfig(configPath: string): Promise<RouteWatchConfig> {
    const configRaw = await readFile(configPath, 'utf8')
    const parsed = JSON.parse(configRaw) as RouteWatchConfig

    if (!parsed.targets || typeof parsed.targets !== 'object') {
        throw new Error(`Invalid config "${configPath}": "targets" is required.`)
    }

    return parsed
}

function resolveTargets(state: CliState, configPath: string | null, config: RouteWatchConfig | null): ResolvedTarget[] {
    if (!configPath || !config) {
        const { appRoot, routesDirectory, generatedRouteTree } = state.singleTargetOverrides
        if (!routesDirectory || !generatedRouteTree) {
            throw new Error(
                `No ${CONFIG_FILENAME} found. Provide "--config" or inline "--routes-dir" and "--generated-route-tree" options.`,
            )
        }

        return [
            {
                name: 'inline',
                appRoot: path.resolve(process.cwd(), appRoot ?? '.'),
                disableLogging: state.singleTargetOverrides.disableLogging ?? false,
                generatedRouteTree: path.resolve(process.cwd(), generatedRouteTree),
                routesDirectory: path.resolve(process.cwd(), routesDirectory),
            },
        ]
    }

    const configDirectory = path.dirname(configPath)
    const selectedNames =
        state.selectedTargetNames.length > 0 ? state.selectedTargetNames : Object.keys(config.targets)

    return selectedNames.map(name => {
        const target = config.targets[name]
        if (!target) {
            throw new Error(`Unknown target "${name}" in ${configPath}`)
        }

        const appRoot = path.resolve(configDirectory, target.appRoot ?? '.')
        const routesDirectory = path.resolve(
            configDirectory,
            target.routesDirectory ?? config.routesDirectory ?? '',
        )

        if (!routesDirectory || routesDirectory === configDirectory) {
            throw new Error(`Target "${name}" is missing "routesDirectory" and no root "routesDirectory" is defined.`)
        }

        return {
            name,
            appRoot,
            disableLogging:
                state.singleTargetOverrides.disableLogging ?? target.disableLogging ?? config.disableLogging ?? false,
            generatedRouteTree: path.resolve(appRoot, target.generatedRouteTree),
            routesDirectory,
        }
    })
}

function createGenerators(targets: ResolvedTarget[]) {
    return new Map(
        targets.map(target => [
            target.name,
            new Generator({
                root: target.appRoot,
                config: getConfig(
                    {
                        target: 'react',
                        disableLogging: target.disableLogging,
                        routesDirectory: target.routesDirectory,
                        generatedRouteTree: target.generatedRouteTree,
                    },
                    target.appRoot,
                ),
            }),
        ]),
    )
}

async function syncTargets(targets: ResolvedTarget[], generators: Map<string, Generator>) {
    await Promise.all(
        targets.map(async target => {
            const generator = generators.get(target.name)
            if (!generator) {
                throw new Error(`Missing generator for target "${target.name}"`)
            }

            await mkdir(path.dirname(target.generatedRouteTree), { recursive: true })
            await generator.run()
            console.log(
                `[uniwind-route-watch] synced ${path.relative(process.cwd(), target.generatedRouteTree)} from ${path.relative(process.cwd(), target.routesDirectory)} (${target.name})`,
            )
        }),
    )
}

function spawnCommand(target: ResolvedTarget, command: string[] | null) {
    if (!command || command.length === 0) {
        return null
    }

    const [commandName, ...commandArgs] = command
    return spawn(commandName, commandArgs, {
        cwd: target.appRoot,
        stdio: 'inherit',
    })
}

async function main() {
    const state = parseArgs(process.argv.slice(2))
    const configPath = state.configPath
        ? path.resolve(process.cwd(), state.configPath)
        : findConfigPath(process.cwd())
    const config = configPath ? await loadConfig(configPath) : null
    const targets = resolveTargets(state, configPath, config)
    const generators = createGenerators(targets)

    if (state.command && targets.length !== 1) {
        throw new Error('Spawned commands require exactly one selected target.')
    }

    if (state.mode === 'generate') {
        await syncTargets(targets, generators)
        const child = state.command ? spawnCommand(targets[0], state.command) : null
        if (child) {
            child.on('exit', code => {
                process.exit(code ?? 0)
            })
        }
        return
    }

    await syncTargets(targets, generators)

    let pending = false
    let rerunRequested = false
    const routeDirectories = [...new Set(targets.map(target => target.routesDirectory))]

    const rerunSync = async () => {
        if (pending) {
            rerunRequested = true
            return
        }

        pending = true
        try {
            await syncTargets(targets, generators)
        } catch (error) {
            console.error('[uniwind-route-watch] Route sync failed')
            console.error(error)
        } finally {
            pending = false
            if (rerunRequested) {
                rerunRequested = false
                void rerunSync()
            }
        }
    }

    const watchers = routeDirectories.map(routesDirectory =>
        watch(routesDirectory, { recursive: true }, () => {
            void rerunSync()
        }),
    )

    const child = state.command ? spawnCommand(targets[0], state.command) : null
    if (!child) {
        return
    }

    child.on('exit', code => {
        watchers.forEach(watcher => watcher.close())
        process.exit(code ?? 0)
    })

    const shutdown = () => {
        watchers.forEach(watcher => watcher.close())
        if (child.exitCode === null) {
            child.kill('SIGTERM')
        }
        process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
})
