import fs from "node:fs";
import Module from "node:module";
import { createRequire } from "node:module";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { uniwind } from "uniwind/vite";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Monkey-patch Node.js module resolution to prevent react-native from being
// loaded natively. react-native/index.js contains Flow syntax (import typeof)
// that Node.js cannot parse. This catches require('react-native') calls that
// bypass Vite's plugin pipeline (e.g. from Tailwind's CSS scanner worker).
const _origResolve = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (
  request: string,
  parent: any,
  isMain: boolean,
  options: any,
) {
  if (request === "react-native") {
    return _origResolve.call(
      this,
      "react-native-web",
      parent,
      isMain,
      options,
    );
  }
  return _origResolve.call(this, request, parent, isMain, options);
};

/**
 * TanStack Start treats dependencies as entry points for SSR.
 * The Uniwind Vite plugin marks 'uniwind' and 'react-native' in
 * optimizeDeps.exclude, which conflicts with esbuild entry point handling.
 * This plugin removes those from the final resolved config.
 */
function fixOptimizeDeps(): Plugin {
  return {
    name: "fix-optimize-deps-for-ssr",
    configResolved(config) {
      const exclude = config.optimizeDeps?.exclude;
      if (Array.isArray(exclude)) {
        const toRemove = ["uniwind", "react-native"];
        for (const item of toRemove) {
          const idx = exclude.indexOf(item);
          if (idx !== -1) {
            exclude.splice(idx, 1);
          }
        }
      }
    },
  };
}

/**
 * React Native packages that have no web-compatible entry points and need
 * to be stubbed in web builds.
 */
const RN_NATIVE_ONLY_PACKAGES = [
  "@gorhom/bottom-sheet",
  "@expo/vector-icons",
  "expo-image",
  "expo-linear-gradient",
  "react-native-gesture-handler",
  "react-native-keyboard-controller",
  "react-native-reanimated",
  "react-native-safe-area-context",
  "react-native-screens",
  "react-native-svg",
  "react-native-worklets",
];

/**
 * Handles module resolution for workspace packages and React Native
 * compatibility in web builds:
 *
 * 1. Resolves `ui` and `uniwind-router` from the app's node_modules
 *    since `packages/todo-universal` doesn't have its own package resolution chain.
 *
 * 2. Redirects `react-native` to a virtual module that re-exports react-native-web
 *    and adds stubs for native-only APIs.
 *
 * 3. Redirects native-only React Native packages and deep `react-native/Libraries`
 *    imports to dynamically generated no-op stubs so they don't crash in the browser.
 */
function resolveWorkspaceDeps(): Plugin {
  const pkgDir = import.meta.dirname;
  const resolveMap: Record<string, string> = {
    ui: path.resolve(pkgDir, "node_modules/ui/src/index.ts"),
    "uniwind-router": path.resolve(pkgDir, "node_modules/uniwind-router/src/index.web.ts"),
  };

  const resolveWorkspaceSubpath = (id: string): string | null => {
    if (!id.startsWith("ui/")) return null;

    const subpath = id.slice("ui/".length);
    const base = path.resolve(pkgDir, "node_modules/ui/src", subpath);
    for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
      const candidate = base + ext;
      if (fs.existsSync(candidate)) return candidate;
    }

    return null;
  };

  const rnLibrariesRE = /^react-native(?:-web)?\/Libraries\//;

  // Match both exact package names and sub-path imports
  const escapeRE = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nativePackageRE = new RegExp(
    `^(${RN_NATIVE_ONLY_PACKAGES.map(escapeRE).join("|")})(\\/|$)`,
  );

  const STUB_PREFIX = "\0rn-web-stub:";
  const RN_VIRTUAL = "\0rn-web-virtual:react-native";

  const RN_CLIENT_CODE = `
export * from 'react-native-web';
export { default } from 'react-native-web';
const NOOP = () => {};
export const TurboModuleRegistry = {
    get: () => null,
    getEnforcing: () => { throw new Error('TurboModule not available on web'); },
};
export const UIManager = {
    getViewManagerConfig: () => null,
    hasViewManagerConfig: () => false,
    measure: NOOP,
    measureInWindow: NOOP,
    measureLayout: NOOP,
    setChildren: NOOP,
    manageChildren: NOOP,
    updateView: NOOP,
    removeSubviewsFromContainerWithID: NOOP,
    replaceExistingNonRootView: NOOP,
    customBubblingEventTypes: {},
    customDirectEventTypes: {},
};
export const requireNativeComponent = (name) => name;
export const codegenNativeComponent = (name) => name;
export const codegenNativeCommands = () => ({});
`;

  // SSR-safe stubs: lightweight React components that render basic HTML
  // without importing react-native-web (which has CJS deps that break
  // in Vite's ESModulesEvaluator).
  const RN_SSR_CODE = `
import { createElement, forwardRef } from 'react';
const NOOP = () => {};
const makeComponent = (tag) => forwardRef((props, ref) => {
    const { style, accessibilityRole, onPress, onPressIn, onPressOut, onLongPress, ...rest } = props || {};
    const htmlProps = { ref, style: typeof style === 'object' && !Array.isArray(style) ? style : undefined };
    if (onPress) htmlProps.onClick = onPress;
    // Pass through className, id, children, etc.
    for (const k of ['className', 'id', 'children', 'href', 'type', 'placeholder', 'value', 'disabled']) {
        if (rest[k] !== undefined) htmlProps[k] = rest[k];
    }
    return createElement(tag, htmlProps);
});
export const View = makeComponent('div');
export const Text = makeComponent('span');
export const Pressable = makeComponent('div');
export const TouchableOpacity = makeComponent('div');
export const TouchableHighlight = makeComponent('div');
export const TouchableWithoutFeedback = makeComponent('div');
export const TouchableNativeFeedback = makeComponent('div');
export const ScrollView = makeComponent('div');
export const SafeAreaView = makeComponent('div');
export const KeyboardAvoidingView = makeComponent('div');
export const Modal = makeComponent('div');
export const Image = makeComponent('img');
export const ImageBackground = makeComponent('div');
export const TextInput = makeComponent('input');
export const Switch = makeComponent('input');
export const ActivityIndicator = makeComponent('div');
export const FlatList = makeComponent('div');
export const SectionList = makeComponent('div');
export const VirtualizedList = makeComponent('div');
export const RefreshControl = makeComponent('div');
export const StatusBar = makeComponent('div');
export const Button = makeComponent('button');
export const CheckBox = makeComponent('input');
export const Picker = makeComponent('select');
export const ProgressBar = makeComponent('div');
export const Touchable = makeComponent('div');
export const YellowBox = makeComponent('div');
export const StyleSheet = {
    create: (s) => s,
    flatten: (...args) => Object.assign({}, ...args.flat().filter(Boolean)),
    compose: (a, b) => [a, b].filter(Boolean),
    absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    hairlineWidth: 1,
};
export const Platform = { OS: 'web', Version: '', select: (o) => o.web ?? o.default, isTesting: false };
export const Dimensions = {
    get: () => ({ width: 0, height: 0, scale: 1, fontScale: 1 }),
    set: NOOP,
    addEventListener: () => ({ remove: NOOP }),
    removeEventListener: NOOP,
};
export const Appearance = { getColorScheme: () => 'light', addChangeListener: () => ({ remove: NOOP }) };
export const AppState = { currentState: 'active', addEventListener: () => ({ remove: NOOP }), removeEventListener: NOOP };
export const Animated = {
    Value: class { constructor(v) { this._value = v; } },
    View: makeComponent('div'),
    Text: makeComponent('span'),
    Image: makeComponent('img'),
    ScrollView: makeComponent('div'),
    FlatList: makeComponent('div'),
    createAnimatedComponent: (c) => c,
    timing: () => ({ start: (cb) => cb?.({ finished: true }), stop: NOOP }),
    spring: () => ({ start: (cb) => cb?.({ finished: true }), stop: NOOP }),
    decay: () => ({ start: (cb) => cb?.({ finished: true }), stop: NOOP }),
    parallel: () => ({ start: (cb) => cb?.({ finished: true }), stop: NOOP }),
    sequence: () => ({ start: (cb) => cb?.({ finished: true }), stop: NOOP }),
    event: () => NOOP,
    add: () => new Animated.Value(0),
    subtract: () => new Animated.Value(0),
    multiply: () => new Animated.Value(0),
    divide: () => new Animated.Value(0),
    delay: () => ({ start: (cb) => cb?.({ finished: true }), stop: NOOP }),
    loop: () => ({ start: (cb) => cb?.({ finished: true }), stop: NOOP }),
    diffClamp: () => new Animated.Value(0),
};
export const Easing = { linear: (t) => t, ease: (t) => t, bezier: () => (t) => t, in: (e) => e, out: (e) => e, inOut: (e) => e };
export const LayoutAnimation = { configureNext: NOOP, create: NOOP, Types: {}, Properties: {}, Presets: {} };
export const Linking = { openURL: NOOP, canOpenURL: async () => false, getInitialURL: async () => null, addEventListener: () => ({ remove: NOOP }) };
export const Alert = { alert: NOOP };
export const Share = { share: async () => ({ action: 'dismissedAction' }) };
export const Vibration = { vibrate: NOOP, cancel: NOOP };
export const Clipboard = { getString: async () => '', setString: NOOP };
export const BackHandler = { addEventListener: () => ({ remove: NOOP }), exitApp: NOOP };
export const Keyboard = { dismiss: NOOP, addListener: () => ({ remove: NOOP }), removeListener: NOOP, removeAllListeners: NOOP };
export const PixelRatio = { get: () => 1, getFontScale: () => 1, getPixelSizeForLayoutSize: (s) => s, roundToNearestPixel: (s) => s };
export const I18nManager = { isRTL: false, allowRTL: NOOP, forceRTL: NOOP };
export const InteractionManager = { runAfterInteractions: (cb) => { cb?.(); return { cancel: NOOP }; }, createInteractionHandle: NOOP, clearInteractionHandle: NOOP };
export const PanResponder = { create: () => ({ panHandlers: {} }) };
export const NativeModules = {};
export const NativeEventEmitter = class { addListener() { return { remove: NOOP }; } removeAllListeners() {} };
export const AccessibilityInfo = { isScreenReaderEnabled: async () => false, addEventListener: () => ({ remove: NOOP }) };
export const AppRegistry = { registerComponent: NOOP, runApplication: NOOP };
export const TurboModuleRegistry = { get: () => null, getEnforcing: () => { throw new Error('TurboModule not available on web'); } };
export const UIManager = { getViewManagerConfig: () => null, hasViewManagerConfig: () => false, measure: NOOP, measureInWindow: NOOP, measureLayout: NOOP, setChildren: NOOP, manageChildren: NOOP, updateView: NOOP, removeSubviewsFromContainerWithID: NOOP, replaceExistingNonRootView: NOOP, customBubblingEventTypes: {}, customDirectEventTypes: {} };
export const requireNativeComponent = (name) => name;
export const codegenNativeComponent = (name) => name;
export const codegenNativeCommands = () => ({});
export const unstable_createElement = createElement;
export const findNodeHandle = () => null;
export const processColor = (c) => c;
export const render = NOOP;
export const unmountComponentAtNode = NOOP;
export default {};
`;

  return {
    name: "resolve-workspace-deps",
    enforce: "pre",
    resolveId(id, _importer, options) {
      if (id in resolveMap) {
        return resolveMap[id];
      }
      const workspaceSubpath = resolveWorkspaceSubpath(id);
      if (workspaceSubpath) {
        return workspaceSubpath;
      }
      if (id === "react-native") {
        return RN_VIRTUAL;
      }
      // In SSR, also intercept react-native-web imports to avoid CJS issues
      if (options?.ssr && id === "react-native-web") {
        return RN_VIRTUAL;
      }
      if (options?.ssr && id.startsWith("react-native-web/")) {
        return STUB_PREFIX + id;
      }
      if (id.startsWith(STUB_PREFIX)) {
        return id;
      }
      if (rnLibrariesRE.test(id)) {
        return STUB_PREFIX + id;
      }
      if (nativePackageRE.test(id)) {
        return STUB_PREFIX + id;
      }
    },
    load(id, options) {
      if (
        options?.ssr &&
        /\/node_modules\/uniwind\/(?:dist\/module\/components\/web\/index\.js|src\/components\/web\/index\.ts)$/.test(
          id,
        )
      ) {
        return fs
          .readFileSync(id, "utf-8")
          .replace(/export \* from ['"]react-native['"];?/, "export * from 'react-native-web';");
      }

      if (id === RN_VIRTUAL) return options?.ssr ? RN_SSR_CODE : RN_CLIENT_CODE;
      if (!id.startsWith(STUB_PREFIX)) return;

      const pkgId = id.slice(STUB_PREFIX.length);
      const localRequire = createRequire(path.resolve(pkgDir, "package.json"));

      // Resolve the ESM entry point for a package
      function resolveESMEntry(specifier: string): string | null {
        try {
          // For bare specifiers, find package.json and read module/exports field
          const pkgJsonPath = localRequire.resolve(specifier + "/package.json");
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
          const dir = path.dirname(pkgJsonPath);

          // Try exports map first
          if (pkgJson.exports) {
            const entry = pkgJson.exports["."];
            if (typeof entry === "string") return path.resolve(dir, entry);
            if (entry?.import)
              return path.resolve(
                dir,
                typeof entry.import === "string"
                  ? entry.import
                  : entry.import.default || entry.import,
              );
            if (entry?.module) return path.resolve(dir, entry.module);
            if (entry?.default) return path.resolve(dir, entry.default);
          }

          // Try module field (ESM entry), with extension fallback
          const tryResolve = (base: string, field: string) => {
            const full = path.resolve(base, field);
            for (const ext of ["", ".js", ".mjs", ".ts"]) {
              if (fs.existsSync(full + ext)) return full + ext;
            }
            // Try as directory with index
            if (fs.existsSync(full + "/index.js")) return full + "/index.js";
            return null;
          };

          if (pkgJson.module) {
            const resolved = tryResolve(dir, pkgJson.module);
            if (resolved) return resolved;
          }
          if (pkgJson.main) {
            const resolved = tryResolve(dir, pkgJson.main);
            if (resolved) return resolved;
          }
          // Default
          return localRequire.resolve(specifier);
        } catch {
          return null;
        }
      }

      // Recursively extract all named exports from a module file
      function extractExports(
        filePath: string,
        visited = new Set<string>(),
      ): { names: Set<string>; hasDefault: boolean } {
        if (visited.has(filePath))
          return { names: new Set(), hasDefault: false };
        visited.add(filePath);

        let content: string;
        try {
          content = fs.readFileSync(filePath, "utf-8");
        } catch {
          return { names: new Set(), hasDefault: false };
        }

        // Strip block comments (/** ... */ and /* ... */) before parsing
        // because JSDoc like {@link Foo} contains } that breaks our regex
        content = content.replace(/\/\*[\s\S]*?\*\//g, "");
        // Strip inline comments
        content = content.replace(/\/\/[^\n]*/g, "");

        const namedExports = new Set<string>();
        let hasDefault = false;

        const isValidIdentifier = (name: string) =>
          /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);

        // Match: export { name } from '...'
        for (const m of content.matchAll(/export\s*\{([^}]+)\}/g)) {
          for (const part of m[1].split(",")) {
            const name = part
              .trim()
              .split(/\s+as\s+/)
              .pop()
              ?.trim();
            if (name && name !== "default" && isValidIdentifier(name))
              namedExports.add(name);
            if (name === "default") hasDefault = true;
          }
        }

        // Match: export const/let/var/function/class name
        for (const m of content.matchAll(
          /export\s+(?:const|let|var|function|class)\s+(\w+)/g,
        )) {
          namedExports.add(m[1]);
        }

        // Match: export default
        if (/export\s+default\b/.test(content)) {
          hasDefault = true;
        }

        // Follow: export * from '...'
        for (const m of content.matchAll(
          /export\s*\*\s*from\s*['"]([^'"]+)['"]/g,
        )) {
          const reexportSource = m[1];

          // Skip native packages (they'll be stubbed separately)
          if (
            nativePackageRE.test(reexportSource) ||
            reexportSource === "react-native"
          ) {
            continue;
          }

          // Resolve relative imports within the package
          let resolvedPath: string | undefined;
          try {
            if (reexportSource.startsWith(".")) {
              const dir = path.dirname(filePath);
              // Try with extensions
              for (const ext of [
                "",
                ".js",
                ".ts",
                ".jsx",
                ".tsx",
                "/index.js",
                "/index.ts",
              ]) {
                const candidate = path.resolve(dir, reexportSource + ext);
                if (
                  fs.existsSync(candidate) &&
                  fs.statSync(candidate).isFile()
                ) {
                  resolvedPath = candidate;
                  break;
                }
              }
            }
          } catch {
            /* ignore */
          }

          if (resolvedPath) {
            const sub = extractExports(resolvedPath, visited);
            for (const name of sub.names) namedExports.add(name);
            if (sub.hasDefault && !hasDefault) {
              // Only propagate default from star exports if it's explicitly re-exported
            }
          }
        }

        return { names: namedExports, hasDefault };
      }

      try {
        // Try as bare package first
        let pkgPath = resolveESMEntry(pkgId);

        // For sub-path imports (e.g. @gorhom/bottom-sheet/lib/module/hooks/useBottomSheetInternal)
        // resolve the actual file in node_modules
        if (!pkgPath) {
          const localRequire2 = createRequire(
            path.resolve(pkgDir, "package.json"),
          );
          try {
            pkgPath = localRequire2.resolve(pkgId);
          } catch {
            // Try resolving with .js extension for ESM-style imports
            try {
              pkgPath = localRequire2.resolve(pkgId + ".js");
            } catch {
              /* ignore */
            }
          }
        }

        if (!pkgPath) throw new Error("No entry found for " + pkgId);
        const { names: namedExports, hasDefault } = extractExports(pkgPath);

        // Generate stub module with Proxy-based NOOPs that support property access
        // but explicitly return undefined for React lifecycle methods to avoid
        // console warnings during SSR.
        const lines: string[] = [
          `import { createElement } from 'react';`,
          `function createNoop() {`,
          `  const fn = function NoopStub(propsOrArg) {`,
          `    if (propsOrArg && typeof propsOrArg === 'object' && 'children' in propsOrArg)`,
          `      return propsOrArg.children != null ? propsOrArg.children : null;`,
          `    return createNoop();`,
          `  };`,
          `  fn.$$typeof = globalThis.Symbol.for('react.forward_ref');`,
          `  fn.render = fn;`,
          `  return new Proxy(fn, {`,
          `    get(target, prop) {`,
          `      if (prop in target) return target[prop];`,
          `      if (prop === globalThis.Symbol.toPrimitive) return () => 0;`,
          `      if (prop === 'toString' || prop === 'valueOf') return () => '';`,
          `      if (prop === globalThis.Symbol.iterator) return function*(){};`,
          `      if (prop === 'displayName' || prop === 'name') return 'NoopStub';`,
          `      return createNoop();`,
          `    },`,
          `    apply(target, thisArg, args) { return target(...args); },`,
          `  });`,
          `}`,
          `const NOOP = createNoop();`,
        ];

        for (const name of namedExports) {
          lines.push(`export const ${name} = NOOP;`);
        }

        if (hasDefault) {
          lines.push(`export default NOOP;`);
        }

        return lines.join("\n");
      } catch {
        // Fallback: return empty stub with just a default export
        return `const NOOP = () => {};\nexport default NOOP;\n`;
      }
    },
  };
}

// @ts-ignore - vite version mismatch between @tailwindcss/vite and project
export default defineConfig(({ mode }) => ({
  server: {
    port: 3001,
  },
  define: {
    __DEV__: mode !== "production",
    global: "globalThis",
  },
  ssr: {
    // Force native-only packages through Vite's plugin pipeline in SSR so our
    // resolveWorkspaceDeps stubs apply. In SSR, react-native-web imports are
    // also intercepted and replaced with lightweight stubs.
    noExternal: [
      "ui",
      "uniwind",
      "tailwind-variants",
      ...RN_NATIVE_ONLY_PACKAGES,
    ],
  },
  optimizeDeps: {
    include: ["invariant", "nullthrows"],
    esbuildOptions: {
      plugins: [
        {
          name: "stub-rn-native",
          setup(build) {
            const escapeRE2 = (s: string) =>
              s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const nativePkgFilter = new RegExp(
              `^(${RN_NATIVE_ONLY_PACKAGES.map(escapeRE2).join("|")})(\\/|$)`,
            );
            const rnDeepFilter = /^react-native(?:-web)?\/Libraries\//;

            // Stub native-only packages
            build.onResolve({ filter: nativePkgFilter }, (args) => ({
              path: args.path,
              namespace: "rn-stub",
            }));

            // Stub react-native/Libraries/* deep imports
            build.onResolve({ filter: rnDeepFilter }, (args) => ({
              path: args.path,
              namespace: "rn-stub",
            }));

            build.onLoad({ filter: /.*/, namespace: "rn-stub" }, () => ({
              contents: `
const NOOP = () => ({});
const handler = {
  get(target, prop) {
    if (prop === '__esModule') return true;
    if (prop === 'default') return NOOP;
    return NOOP;
  }
};
module.exports = new Proxy(NOOP, handler);
`,
              loader: "js",
            }));
          },
        },
      ],
    },
  },
  plugins: [
    tailwindcss() as unknown as Plugin,
    uniwind({
      cssEntryFile: "../../packages/todo-universal/styles/app.css",
    }),
    fixOptimizeDeps(),
    resolveWorkspaceDeps(),
    tsconfigPaths(),
    tanstackStart({
      router: {
        routesDirectory: "../../../packages/todo-universal/routes",
      },
    }),
    viteReact(),
  ],
}));
