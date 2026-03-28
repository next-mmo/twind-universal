import { Linking } from 'react-native'
import { Image, View } from 'uniwind/components'
import { cn } from '../../../reusables/lib/utils'
import { Avatar, AvatarImage, Button, UIText } from '../../reusables'

export interface Hero3Props {
    heading?: string
    description?: string
    buttons?: {
        primary?: {
            text: string
            url: string
            className?: string
        }
        secondary?: {
            text: string
            url: string
        }
    }
    reviews?: {
        count: number
        avatars: {
            src: string
            alt: string
        }[]
        rating?: number
    }
    /** Remote image shown on the wide layout (SVG/PNG URLs may vary by platform). */
    imageUrl?: string
    imageAccessibilityLabel?: string
    className?: string
}

const DEFAULT_IMAGE = 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg'

function openUrl(url: string) {
    void Linking.openURL(url)
}

function Hero3({
    heading = 'Blocks built with Shadcn & Tailwind',
    description = 'Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.',
    buttons = {
        primary: {
            text: 'Sign Up',
            url: 'https://www.shadcnblocks.com',
        },
        secondary: {
            text: 'Get Started',
            url: 'https://www.shadcnblocks.com',
        },
    },
    reviews = {
        count: 200,
        rating: 5.0,
        avatars: [
            {
                src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp',
                alt: 'Avatar 1',
            },
            {
                src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp',
                alt: 'Avatar 2',
            },
            {
                src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp',
                alt: 'Avatar 3',
            },
            {
                src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp',
                alt: 'Avatar 4',
            },
            {
                src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp',
                alt: 'Avatar 5',
            },
        ],
    },
    className,
    imageAccessibilityLabel = 'Hero illustration',
    imageUrl = DEFAULT_IMAGE,
}: Hero3Props) {
    return (
        <View className={cn('flex-col py-32', className)}>
            <View className="w-full max-w-7xl flex-col gap-10 self-center px-4 lg:flex-row lg:items-center lg:gap-20">
                <View className="mx-auto w-full flex-col items-center lg:max-w-3xl lg:ml-auto lg:items-start">
                    <UIText className="my-6 text-center text-4xl font-bold text-pretty text-zinc-950 dark:text-zinc-50 lg:text-left lg:text-6xl xl:text-7xl">
                        {heading}
                    </UIText>
                    <UIText className="mb-8 max-w-xl text-center text-base leading-7 text-zinc-600 dark:text-zinc-400 lg:text-left lg:text-xl">
                        {description}
                    </UIText>

                    <View className="mb-12 w-full flex-col items-center gap-4 sm:w-fit sm:flex-row">
                        <View className="flex-row items-center">
                            {reviews.avatars.map((avatar, index) => (
                                <Avatar
                                    key={`${avatar.src}-${index}`}
                                    className={cn('h-12 w-12 border border-zinc-200 dark:border-zinc-700', index > 0 && '-ml-4')}
                                >
                                    <AvatarImage
                                        accessibilityLabel={avatar.alt}
                                        className="h-full w-full"
                                        resizeMode="cover"
                                        source={{ uri: avatar.src }}
                                    />
                                </Avatar>
                            ))}
                        </View>
                        <View className="min-w-0 flex-1">
                            <View
                                accessibilityLabel={`${reviews.rating?.toFixed(1)} out of five stars`}
                                className="flex-row flex-wrap items-center gap-1"
                            >
                                {[0, 1, 2, 3, 4].map(index => (
                                    <UIText key={`star-${index}`} className="text-lg leading-none text-yellow-400">
                                        ★
                                    </UIText>
                                ))}
                                <UIText className="ml-1 font-semibold text-zinc-950 dark:text-zinc-50">{reviews.rating?.toFixed(1)}</UIText>
                            </View>
                            <UIText className="text-left font-medium text-zinc-600 dark:text-zinc-400">from {reviews.count}+ reviews</UIText>
                        </View>
                    </View>

                    <View className="w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                        {buttons.primary ? (
                            <Button className={cn('w-full sm:w-auto', buttons.primary.className)} onPress={() => openUrl(buttons.primary!.url)}>
                                <UIText>{buttons.primary.text}</UIText>
                            </Button>
                        ) : null}
                        {buttons.secondary ? (
                            <Button variant="outline" onPress={() => openUrl(buttons.secondary!.url)}>
                                <UIText>{buttons.secondary.text}</UIText>
                                <UIText className="text-base text-zinc-900 dark:text-zinc-100">↘</UIText>
                            </Button>
                        ) : null}
                    </View>
                </View>

                <View className="w-full flex-1 lg:min-w-0">
                    <Image
                        accessibilityLabel={imageAccessibilityLabel}
                        className="max-h-[600px] w-full rounded-md lg:max-h-[800px]"
                        resizeMode="cover"
                        source={{ uri: imageUrl }}
                    />
                </View>
            </View>
        </View>
    )
}

export { Hero3 }
