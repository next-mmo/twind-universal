import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
} from './components/Card'
import {
  ProfileCard,
  avatarVariants,
  profileCardVariants,
} from './components/ProfileCard'

export const RecipeCard: typeof Card = Card
export const RecipeCardContent: typeof CardContent = CardContent
export const RecipeCardDescription: typeof CardDescription = CardDescription
export const RecipeCardFooter: typeof CardFooter = CardFooter
export const RecipeCardHeader: typeof CardHeader = CardHeader
export const RecipeCardTitle: typeof CardTitle = CardTitle
export const recipeCardVariants = cardVariants

export {
  ProfileCard,
  avatarVariants,
  profileCardVariants,
}
export type {
  ProfileCardProps,
  ProfileCardVariants,
  StatItem,
} from './components/ProfileCard'
