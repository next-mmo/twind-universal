import { createFileRoute } from '@tanstack/react-router'
import { getLLMIndexText } from '@/lib/source'

export const Route = createFileRoute('/llms.txt')({
    server: {
        handlers: {
            GET() {
                return new Response(getLLMIndexText(), {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                    },
                })
            },
        },
    },
})
