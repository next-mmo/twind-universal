#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawn, spawnSync } = require('child_process')

const appRoot = path.resolve(__dirname, '..')
const androidRoot = path.join(appRoot, 'android')
const localPropertiesPath = path.join(androidRoot, 'local.properties')
const appId = 'com.todobare'
const mainActivity = `${appId}/.MainActivity`
const devServerPort = '8081'
const supportedArchitectures = ['arm64-v8a', 'armeabi-v7a', 'x86_64', 'x86']

function parseLocalProperties(filePath) {
    if (!fs.existsSync(filePath)) {
        return {}
    }

    return Object.fromEntries(
        fs
            .readFileSync(filePath, 'utf8')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#'))
            .map((line) => {
                const separatorIndex = line.indexOf('=')
                if (separatorIndex === -1) {
                    return null
                }

                const key = line.slice(0, separatorIndex).trim()
                const value = line
                    .slice(separatorIndex + 1)
                    .trim()
                    .replace(/\\:/g, ':')
                    .replace(/\\\\/g, '\\')

                return [key, value]
            })
            .filter(Boolean),
    )
}

function prependPathEntries(env, entries) {
    const currentPath = env.PATH ?? ''
    const pathEntries = currentPath ? currentPath.split(path.delimiter) : []

    for (const entry of entries) {
        if (!entry || !fs.existsSync(entry) || pathEntries.includes(entry)) {
            continue
        }

        pathEntries.unshift(entry)
    }

    env.PATH = pathEntries.join(path.delimiter)
}

function sleep(milliseconds) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: appRoot,
        env,
        stdio: 'inherit',
        ...options,
    })

    if (result.error) {
        throw result.error
    }

    if (typeof result.status === 'number' && result.status !== 0) {
        process.exit(result.status)
    }

    return result
}

function runOutput(command, args, options = {}) {
    const result = spawnSync(command, args, {
        cwd: appRoot,
        env,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        ...options,
    })

    if (result.error) {
        throw result.error
    }

    if (typeof result.status === 'number' && result.status !== 0) {
        const stderr = result.stderr?.trim()
        if (stderr) {
            console.error(stderr)
        }
        process.exit(result.status)
    }

    return result.stdout.trim()
}

function resolveSdkTool(...segments) {
    if (!sdkDir) {
        return null
    }

    const executablePath = path.join(sdkDir, ...segments)
    return fs.existsSync(executablePath) ? executablePath : null
}

function listConnectedDevices() {
    const output = runOutput(adbCommand, ['devices'])

    return output
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(/\s+/))
        .filter((parts) => parts[1] === 'device')
        .map((parts) => parts[0])
}

function listAvds() {
    if (!emulatorCommand) {
        return []
    }

    return runOutput(emulatorCommand, ['-list-avds'])
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
}

function waitForConnectedDevice(timeoutMilliseconds) {
    const deadline = Date.now() + timeoutMilliseconds

    while (Date.now() < deadline) {
        const devices = listConnectedDevices()
        if (devices.length > 0) {
            return devices[0]
        }

        sleep(2_000)
    }

    return null
}

function waitForBootCompleted(deviceId, timeoutMilliseconds) {
    const deadline = Date.now() + timeoutMilliseconds

    while (Date.now() < deadline) {
        const bootCompleted = runOutput(adbCommand, ['-s', deviceId, 'shell', 'getprop', 'sys.boot_completed'])
        if (bootCompleted === '1') {
            return true
        }

        sleep(2_000)
    }

    return false
}

function ensureDevice() {
    const connectedDevices = listConnectedDevices()
    if (connectedDevices.length > 0) {
        return connectedDevices[0]
    }

    const availableAvds = listAvds()
    if (availableAvds.length === 0) {
        console.error('No Android device is connected and no AVD is available.')
        process.exit(1)
    }

    const emulatorProcess = spawn(emulatorCommand, [`@${availableAvds[0]}`], {
        detached: true,
        env,
        stdio: 'ignore',
    })
    emulatorProcess.unref()

    const deviceId = waitForConnectedDevice(180_000)
    if (!deviceId) {
        console.error(`Timed out waiting for emulator "${availableAvds[0]}" to connect.`)
        process.exit(1)
    }

    if (!waitForBootCompleted(deviceId, 180_000)) {
        console.error(`Timed out waiting for device "${deviceId}" to finish booting.`)
        process.exit(1)
    }

    return deviceId
}

function detectDeviceArchitecture(deviceId) {
    const properties = [
        'ro.product.cpu.abilist64',
        'ro.product.cpu.abilist32',
        'ro.product.cpu.abilist',
        'ro.product.cpu.abi',
    ]

    for (const property of properties) {
        const output = runOutput(adbCommand, ['-s', deviceId, 'shell', 'getprop', property])
        const architecture = output
            .split(',')
            .map((value) => value.trim())
            .find((value) => supportedArchitectures.includes(value))

        if (architecture) {
            return architecture
        }
    }

    return null
}

const localProperties = parseLocalProperties(localPropertiesPath)
const sdkDir = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? localProperties['sdk.dir']
const env = { ...process.env }

if (sdkDir) {
    env.ANDROID_HOME ??= sdkDir
    env.ANDROID_SDK_ROOT ??= sdkDir

    prependPathEntries(env, [
        path.join(sdkDir, 'platform-tools'),
        path.join(sdkDir, 'emulator'),
        path.join(sdkDir, 'cmdline-tools', 'latest', 'bin'),
        path.join(sdkDir, 'tools'),
        path.join(sdkDir, 'tools', 'bin'),
    ])
}

const adbCommand =
    resolveSdkTool('platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb') ??
    (process.platform === 'win32' ? 'adb.exe' : 'adb')
const emulatorCommand =
    resolveSdkTool('emulator', process.platform === 'win32' ? 'emulator.exe' : 'emulator') ??
    (process.platform === 'win32' ? 'emulator.exe' : 'emulator')
const routeWatchCommand = process.platform === 'win32' ? 'uniwind-route-watch.cmd' : 'uniwind-route-watch'
const gradleCommand = process.platform === 'win32' ? 'gradlew.bat' : './gradlew'
const apkPath = path.join(androidRoot, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')

run(routeWatchCommand, ['generate', '--target', 'todo-bare'])

const deviceId = ensureDevice()
const architecture = detectDeviceArchitecture(deviceId)
const assembleArgs = ['app:assembleDebug', `-PreactNativeDevServerPort=${devServerPort}`]

if (architecture) {
    assembleArgs.push(`-PreactNativeArchitectures=${architecture}`)
}

run(gradleCommand, assembleArgs, { cwd: androidRoot })

run(adbCommand, ['-s', deviceId, 'reverse', `tcp:${devServerPort}`, `tcp:${devServerPort}`])
run(adbCommand, ['-s', deviceId, 'install', '-r', apkPath])
run(adbCommand, ['-s', deviceId, 'shell', 'am', 'start', '-n', mainActivity])

console.log(`Installed and launched ${appId} on ${deviceId}${architecture ? ` (${architecture})` : ''}.`)

if (!process.env.RCT_METRO_PORT && !process.env.REACT_NATIVE_PACKAGER_HOSTNAME) {
    console.log(`Use "pnpm --filter todo-bare start" if Metro is not already running on port ${devServerPort}.`)
}

process.exit(0)
