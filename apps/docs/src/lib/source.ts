import { type InferPageType, loader } from 'fumadocs-core/source'
import { create, docs } from '../../source.generated'

const docsSource = await create.sourceAsync(docs.doc, docs.meta)

export const source = loader({
    source: docsSource,
    baseUrl: '/docs',
})

export async function getLLMText(page: InferPageType<typeof source>) {
    const processed = await page.data.getText('processed')

    return `# ${page.data.title}

${processed}`
}

export function getLLMIndexText() {
    const lines = source.getPages().map(page => `- ${page.data.title ?? page.url}: ${page.url}`)

    return ['# Uniwind Universal Docs', '', ...lines].join('\n')
}
