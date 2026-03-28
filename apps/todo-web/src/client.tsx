import { StartClient } from '@tanstack/react-start/client'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { SafeAreaProvider } from 'react-native-safe-area-context'

hydrateRoot(
    document,
    <StrictMode>
        <SafeAreaProvider>
            <StartClient />
        </SafeAreaProvider>
    </StrictMode>,
)
