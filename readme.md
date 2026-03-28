
<div align="center">
    <p align="center">
        <a href="https://uniwind.dev/" target="_blank">
            <h1 align="center" style="color:red;">Uniwind Universal Router Demo</h1>
            <span>100% Code Sharing across React Native and Web with TanStack Router</span>
        </a>
        <br />
        <br />
        <b>🚧 Now in Beta for TanStack Router 🚧</b>
        <br />
        <b>🤖 Built with Assistant Opus 4.6 🤖</b>
    </p>
</div>
<br />

Welcome to the **Uniwind Universal Demo** repository! This project showcases a complete monorepo setup for building universal applications (iOS, Android, and Web) with exactly **100% code sharing**.

By combining [Uniwind](https://uniwind.dev/) for styling and `uniwind-router` (powered by [TanStack Router](https://tanstack.com/router)), you can write your UI and routing logic once and run it everywhere with native performance on mobile and excellent SSR capabilities on the web.

## 🚀 Repository Structure

This monorepo is managed with **PNPM** workspaces and **TurboRepo**.

### Packages (`packages/`)

- `packages/uniwind-router`: A bridge that brings the power of TanStack Router (and TanStack History) to React Native, seamlessly handling native navigation.
- `packages/todo-universal`: A route-first TanStack package that owns the shared Todo route tree, route support modules, and platform views for web and native shells.

### Applications (`apps/`)

All apps are thin shells that simply mount the generated route tree from the `todo-universal` package.

- `apps/todo-bare`: A standard **React Native (CLI)** application.
- `apps/todo-expo`: An **Expo**-based React Native application.
- `apps/todo-web`: A **TanStack Start** web application with full SSR and web capabilities.

## ✨ Key Features

- **Write Once, Route Everywhere**: One shared TanStack route tree powers web, bare React Native, and Expo, with platform-specific views only where the runtime actually differs.
- **Universal Routing**: Define your routes and navigation state once with TanStack Router. `uniwind-router` adapts them for React Native inherently.
- **Universal Styling**: Powered by Uniwind, achieving fast, build-time-computed Tailwind bindings across both React Native CSS interop and standard Web CSS.
- **Modern Monorepo Stack**: Configured with PNPM, TurboRepo, TypeScript standard aliases, and isolated testing setups.

## 🛠️ Getting Started

### Installation

Ensure you have [PNPM](https://pnpm.io/) installed, then run:

```sh
pnpm install
```

### Running the Projects

You can use Turborepo to run instances in development mode. From the root directory:

```sh
# Run the TanStack Start web application
pnpm dev --filter todo-web

# Run the Expo mobile application
pnpm dev --filter todo-expo

# Run the Bare React Native mobile application
pnpm dev --filter todo-bare
```

To run everything simultaneously:

```sh
pnpm run dev
```

## 📚 General Uniwind Documentation

If you are looking for documentation regarding the core `uniwind` package:

- [Quickstart Guide](https://docs.uniwind.dev/quickstart)
- [Theming Basics](https://docs.uniwind.dev/theming/basics)
- [Supported classNames](https://docs.uniwind.dev/class-names)
- [API Reference](https://docs.uniwind.dev/api/use-uniwind)

---

## useful links
<!-- https://www.shadcnblocks.com/blocks -->

## License

MIT
