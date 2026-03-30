import { ArrowLeft, ArrowRight } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'
import { Image, Pressable, View } from 'uniwind/components'

import { cn } from '../../../reusables/lib/utils'
import { UIText } from '../../reusables'
import type { AnimatedTestimonialsBlockProps } from '../types'

function TestimonialImage({
    item,
    index,
    active,
    length,
    randomRotate,
}: {
    item: any
    index: number
    active: number
    length: number
    randomRotate: number
}) {
    const isActive = active === index

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isActive ? 1 : 0.7, { duration: 400 }),
            transform: [
                { scale: withTiming(isActive ? 1 : 0.95, { duration: 400 }) },
                {
                    rotate: `${withTiming(isActive ? 0 : randomRotate, {
                        duration: 400,
                    })}deg`,
                },
                {
                    translateY: isActive
                        ? withSequence(
                              withTiming(-80, { duration: 200 }),
                              withTiming(0, { duration: 200 })
                          )
                        : withTiming(0, { duration: 400 }),
                },
            ],
            transformOrigin: 'bottom' as const,
        }
    })

    return (
        <View 
            className="absolute inset-0" 
            style={{ zIndex: isActive ? 40 : length + 2 - index }}
        >
            <Animated.View
                style={[animatedStyle, { width: '100%', height: '100%' }]}
            >
                <Image
                    source={{ uri: item.src }}
                    className="h-full w-full rounded-3xl"
                    resizeMode="cover"
                    accessibilityLabel={item.name}
                />
            </Animated.View>
        </View>
    )
}

function AnimatedWord({ word, index, active }: { word: string; index: number; active: number }) {
    const opacity = useSharedValue(0)
    const y = useSharedValue(10)

    useEffect(() => {
        opacity.value = 0
        y.value = 10

        const timeout = setTimeout(() => {
            opacity.value = withTiming(1, { duration: 200 })
            y.value = withTiming(0, { duration: 200 })
        }, index * 20)
        
        return () => clearTimeout(timeout)
    }, [active, index])

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: y.value }],
    }))

    return (
        <Animated.Text style={style} className="text-lg text-muted-foreground">
            {word}{' '}
        </Animated.Text>
    )
}

export function AnimatedTestimonialsBlock({
    testimonials,
    autoplay = false,
    className,
}: AnimatedTestimonialsBlockProps) {
    const [active, setActive] = useState(0)
    const [rotations] = useState(() =>
        testimonials.map(() => Math.floor(Math.random() * 21) - 10)
    )

    const handleNext = useCallback(() => {
        setActive((prev) => (prev + 1) % testimonials.length)
    }, [testimonials.length])

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000)
            return () => clearInterval(interval)
        }
    }, [autoplay, handleNext])

    const activeTestimonial = testimonials[active]

    const textOpacity = useSharedValue(0)
    const textY = useSharedValue(20)

    useEffect(() => {
        textOpacity.value = 0
        textY.value = 20
        textOpacity.value = withTiming(1, { duration: 200 })
        textY.value = withTiming(0, { duration: 200 })
    }, [active])

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textY.value }],
    }))

    return (
        <View className={cn("mx-auto w-full max-w-sm px-4 py-20 md:max-w-4xl", className)}>
            <View className="flex-col gap-20 md:flex-row md:items-center">
                <View className="flex-1 min-w-0">
                    <View className="relative h-80 w-full max-w-sm mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialImage
                                key={testimonial.src}
                                item={testimonial}
                                index={index}
                                active={active}
                                length={testimonials.length}
                                randomRotate={rotations[index]}
                            />
                        ))}
                    </View>
                </View>

                <View className="flex-1 min-w-0 flex-col justify-between py-4">
                    <Animated.View style={textStyle}>
                        <UIText className="text-2xl font-bold text-foreground">
                            {activeTestimonial.name}
                        </UIText>
                        <UIText className="text-sm text-muted-foreground">
                            {activeTestimonial.designation}
                        </UIText>

                        <View className="mt-8 flex-row flex-wrap">
                            {activeTestimonial.quote.split(' ').map((word, index) => (
                                <AnimatedWord
                                    key={`${active}-${word}-${index}`}
                                    word={word}
                                    index={index}
                                    active={active}
                                />
                            ))}
                        </View>
                    </Animated.View>

                    <View className="flex-row gap-4 pt-12 md:pt-0 mt-8">
                        <Pressable
                            onPress={handlePrev}
                            className="group h-10 w-10 items-center justify-center rounded-full bg-secondary active:opacity-80"
                        >
                            <ArrowLeft className="h-5 w-5 text-foreground" />
                        </Pressable>
                        <Pressable
                            onPress={handleNext}
                            className="group h-10 w-10 items-center justify-center rounded-full bg-secondary active:opacity-80"
                        >
                            <ArrowRight className="h-5 w-5 text-foreground" />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}
