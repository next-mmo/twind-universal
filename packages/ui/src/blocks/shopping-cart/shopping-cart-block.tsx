import { useState } from 'react'
import { Image, View } from 'uniwind/components'
import { cn } from '../../../reusables/lib/utils'
import { Button, Separator, UIText } from '../../reusables'
import type { ShoppingCartBlockProps, ShoppingCartItem } from './types'

const DEFAULT_SHOPPING_CART_ITEMS: ShoppingCartItem[] = [
    {
        id: '1',
        name: 'Minimalist Beige Sneakers',
        image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png',
        price: 120.0,
        quantity: 1,
    },
    {
        id: '2',
        name: 'Embroidered Blue Top',
        image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png',
        price: 140.0,
        quantity: 1,
    },
    {
        id: '3',
        name: 'Classic Fedora Hat',
        image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-2.png',
        price: 84.0,
        quantity: 1,
    },
]

function formatUsd(price: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price)
}

function ShoppingCartBlock({
    checkoutLabel = 'Checkout',
    className,
    continueShoppingLabel = 'Continue Shopping',
    emptyDescription = "Looks like you haven't added anything yet.",
    emptyTitle = 'Your cart is empty',
    initialItems = DEFAULT_SHOPPING_CART_ITEMS,
    onCheckout,
    onContinueShopping,
    title = 'Shopping Cart',
    totalLabel = 'Total',
}: ShoppingCartBlockProps) {
    const [items, setItems] = useState(initialItems)

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (items.length === 0) {
        return (
            <View className={cn('flex-col py-32', className)}>
                <View className="w-full max-w-lg self-center px-4">
                    <View className="items-center gap-4">
                        <UIText className="text-center text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{emptyTitle}</UIText>
                        <UIText className="text-center leading-7 text-zinc-600 dark:text-zinc-300">{emptyDescription}</UIText>
                        <Button size="lg" onPress={onContinueShopping}>
                            <UIText>{continueShoppingLabel}</UIText>
                        </Button>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View className={cn('flex-col py-32', className)}>
            <View className="w-full max-w-2xl flex-col gap-8 self-center px-4">
                <UIText className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{title}</UIText>

                <View className="gap-4">
                    {items.map(item => (
                        <View key={item.id} className="flex-row items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                            <View className="h-20 w-20 shrink-0 overflow-hidden rounded-md">
                                <Image accessibilityLabel={item.name} className="size-full" resizeMode="cover" source={{ uri: item.image }} />
                            </View>

                            <View className="min-w-0 flex-1 gap-1">
                                <UIText className="font-medium text-zinc-950 dark:text-zinc-50">{item.name}</UIText>
                                <UIText variant="muted">Qty: {item.quantity}</UIText>
                            </View>

                            <View className="items-end">
                                <UIText className="font-semibold text-zinc-950 dark:text-zinc-50">{formatUsd(item.price * item.quantity)}</UIText>
                            </View>

                            <Button
                                accessibilityLabel={`Remove ${item.name}`}
                                className="shrink-0"
                                size="icon"
                                variant="ghost"
                                onPress={() => removeItem(item.id)}
                            >
                                <UIText className="text-xl leading-none">×</UIText>
                            </Button>
                        </View>
                    ))}
                </View>

                <Separator className="my-2" />

                <View className="gap-4">
                    <View className="flex-row items-center justify-between">
                        <UIText className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{totalLabel}</UIText>
                        <UIText className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{formatUsd(subtotal)}</UIText>
                    </View>

                    <Button size="lg" className="w-full" onPress={onCheckout}>
                        <UIText>{checkoutLabel}</UIText>
                    </Button>
                </View>
            </View>
        </View>
    )
}

const ShoppingCart1 = ShoppingCartBlock

export { ShoppingCart1, ShoppingCartBlock }
