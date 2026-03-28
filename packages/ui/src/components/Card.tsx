import {
    Card as CardRoot,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    cardVariants,
} from '../../reusables/components/ui/card'

const Card = Object.assign(CardRoot, {
    Body: CardContent,
    Content: CardContent,
    Description: CardDescription,
    Footer: CardFooter,
    Header: CardHeader,
    Title: CardTitle,
})

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants }
export type { CardProps, CardSlotProps, CardTextProps, CardVariants } from '../../reusables/components/ui/card'
