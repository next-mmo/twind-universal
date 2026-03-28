# uniwind-router-tools

Internal CLI utilities for Uniwind route generation.

## Config

Place a `uniwind.routes.json` file at the repo root or app boundary:

```json
{
  "routesDirectory": "packages/todo-universal/routes",
  "targets": {
    "todo-bare": {
      "appRoot": "apps/todo-bare",
      "generatedRouteTree": "src/routeTree.gen.ts"
    }
  }
}
```

`routesDirectory` is resolved relative to the config file. `generatedRouteTree` is resolved relative to each target `appRoot`.

## `uniwind-route-watch`

Generate a target:

```bash
uniwind-route-watch generate --target todo-bare
```

Watch and run the target app command:

```bash
uniwind-route-watch watch --target todo-bare -- react-native start
```

CLI options:

- `--config`: path to `uniwind.routes.json`
- `--target`: target name from config, repeatable
- `--disable-logging`: disable TanStack generator logging

Inline one-off mode still works:

```bash
uniwind-route-watch generate \
  --routes-dir ../../packages/todo-universal/routes \
  --generated-route-tree src/routeTree.gen.ts
```
