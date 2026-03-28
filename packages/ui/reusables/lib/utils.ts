import { twMerge } from 'tailwind-merge'

type ClassNameValue = false | null | undefined | string

export function cn(...inputs: ClassNameValue[]) {
    return twMerge(inputs.filter(Boolean).join(' '))
}
