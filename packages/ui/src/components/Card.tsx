import { CardContent, CardDescription, CardFooter, CardHeader, Card as CardRoot, CardTitle, cardVariants } from '../../reusables/components/ui/card'

const Card = Object.assign(CardRoot, {
    Body: CardContent,
    Content: CardContent,
    Description: CardDescription,
    Footer: CardFooter,
    Header: CardHeader,
    Title: CardTitle,
})

export type { CardProps, CardSlotProps, CardTextProps, CardVariants } from '../../reusables/components/ui/card'
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants }
