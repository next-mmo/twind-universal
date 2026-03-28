import type { ReactNode } from 'react'

export interface ShoppingCartItem {
    id: string
    name: string
    image: string
    price: number
    quantity: number
}

export interface ShoppingCartBlockProps {
    className?: string
    initialItems?: ShoppingCartItem[]
    emptyTitle?: ReactNode
    emptyDescription?: ReactNode
    title?: ReactNode
    totalLabel?: ReactNode
    continueShoppingLabel?: ReactNode
    checkoutLabel?: ReactNode
    onContinueShopping?: () => void
    onCheckout?: () => void
}
