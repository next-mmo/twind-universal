# todo-universal

Shared TanStack file-route package for the universal todo demo.

## Supported targets

- `apps/todo-web`
- `apps/todo-bare`

Expo is currently outside the verified release surface for this package.

## Structure

- `routes/`: shared TanStack file routes
- `routes/-router/`: typed route helpers, search parsing, loader utilities
- `routes/-store/`: todo state model and provider
- `routes/-platform/`: platform storage boundary
- `styles/`: shared web CSS entry

## Native module rule

`todo-universal` should not import app-native modules directly inside route files.

Use this pattern instead:

1. Put the capability behind a platform boundary in `routes/-platform/`
2. Keep actual native dependency installation in the native app
3. Import the shared facade from route/store code

Example:

- `routes/-platform/storage.ts`
- `routes/-platform/storage.native.ts`
- `routes/-store/TodoContext.tsx`

## Verification

Core verification for this package is:

- route generation
- TypeScript checks
- Vitest store/router tests
- web runtime smoke
- bare Android runtime e2e
