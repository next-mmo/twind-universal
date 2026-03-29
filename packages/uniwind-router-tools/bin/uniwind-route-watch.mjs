#!/usr/bin/env node

// Resolve tsx from the package's own node_modules so this works
// when installed via git (e.g. pnpm add github:user/repo#path:packages/uniwind-router-tools)
import { createRequire } from 'module'
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

let tsxBin
try {
    // tsx ships its own bin entry; find it relative to this package
    const tsxPkg = require.resolve('tsx/package.json')
    const tsxDir = path.dirname(tsxPkg)
    const tsxPkgJson = JSON.parse(require('fs').readFileSync(tsxPkg, 'utf8'))
    const binEntry = typeof tsxPkgJson.bin === 'string'
        ? tsxPkgJson.bin
        : (tsxPkgJson.bin?.tsx ?? tsxPkgJson.bin?.['tsx'])
    tsxBin = path.resolve(tsxDir, binEntry)
} catch {
    // Fallback: assume tsx is in PATH
    tsxBin = null
}

const cliPath = path.resolve(__dirname, '../src/cli.ts')

const result = tsxBin
    ? spawnSync(process.execPath, ['--import', `tsx`, cliPath, ...process.argv.slice(2)], {
        stdio: 'inherit',
        env: {
            ...process.env,
            NODE_PATH: path.resolve(__dirname, '../node_modules'),
        },
      })
    : spawnSync('tsx', [cliPath, ...process.argv.slice(2)], { stdio: 'inherit', shell: true })

process.exit(result.status ?? 0)
