/**
 * uniwind-ui — HeroUI Native component library re-export
 *
 * This package provides a single import surface for HeroUI Native components
 * built on Uniwind (Tailwind CSS for React Native).
 *
 * Usage:
 *   import { Card, Button, TextField } from "uniwind-ui";
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

// Re-export all HeroUI Native components
export type { VariantProps } from "tailwind-variants";
// Re-export tailwind-variants for custom component authoring
export { tv } from "tailwind-variants";

// Re-export uniwind core utilities
export { Uniwind } from "uniwind";
export { useUniwind, useCSSVariable, useResolveClassNames } from "uniwind";
export { withUniwind } from "uniwind";

// Re-export the native primitives we actually use without colliding with HeroUI names.
export {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    SectionList,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    VirtualizedList,
} from "uniwind/components";
export * from "heroui-native";
