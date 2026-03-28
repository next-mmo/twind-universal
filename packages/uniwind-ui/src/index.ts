/**
 * uniwind-ui — unified HeroUI Native + Uniwind surface
 *
 * This package provides:
 * - top-level convenience exports for the common combined API
 * - grouped namespaces for clearer consumption
 * - subpath entry points when callers want only HeroUI, Uniwind core, or primitives
 *
 * Usage:
 *   import { Card, HeroUI, UniwindCore, UniwindPrimitives } from "uniwind-ui";
 *   import * as HeroUIOnly from "uniwind-ui/heroui";
 *   import * as UniwindOnly from "uniwind-ui/uniwind";
 *
 * CSS Setup (in your app's global.css):
 *   @import "tailwindcss";
 *   @import "uniwind";
 *   @import "heroui-native/styles";
 *   @source "./node_modules/heroui-native/lib";
 *
 * Provider Setup (in your app root):
 *   import { HeroUINativeProvider } from "uniwind-ui";
 *   import { GestureHandlerRootView } from "react-native-gesture-handler";
 *
 *   <GestureHandlerRootView style={{ flex: 1 }}>
 *     <HeroUINativeProvider>
 *       <App />
 *     </HeroUINativeProvider>
 *   </GestureHandlerRootView>
 */

export * from './heroui'
export * from './primitives'
export * from './uniwind'

export * as HeroUI from './heroui'
export * as UniwindCore from './uniwind'
export * as UniwindPrimitives from './primitives'

export { HeroUINativeProvider as UniwindUIProvider } from 'heroui-native'
