import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import {
    PageArticle,
    PageBreadcrumb,
    PageFooter,
    PageRoot,
    PageTOC,
    PageTOCItems,
    PageTOCPopover,
    PageTOCPopoverContent,
    PageTOCPopoverItems,
    PageTOCPopoverTrigger,
    PageTOCTitle,
} from 'fumadocs-ui/layouts/docs/page'
import { createClientLoader } from 'fumadocs-mdx/runtime/vite.browser'
import { Suspense } from 'react'
import { useMDXComponents } from '@/components/mdx'
import { docs } from '../../../source.generated'
import { baseOptions } from '@/lib/layout.shared'

type DocsLoaderData = {
    slugs: string[]
    path: string
    pageTree: any
}

export const Route = createFileRoute('/docs/$')({
    component: Page,
    loader: async ({ params }): Promise<DocsLoaderData> => {
        const slugs = params._splat?.split('/') ?? []
        const data = (await serverLoader({ data: slugs })) as DocsLoaderData
        await clientLoader.preload(data.path)
        return data
    },
})

const serverLoader = createServerFn({
    method: 'GET',
})
    .inputValidator((slugs: string[]) => slugs)
    .handler(async ({ data }): Promise<DocsLoaderData> => {
        const slugs = data as string[]
        const { source } = await import('@/lib/source')
        const page = source.getPage(slugs)
        if (!page) throw notFound()

        return {
            slugs: page.slugs,
            path: page.path,
            pageTree: source.getPageTree() as any,
        }
    })

const clientLoader = createClientLoader(docs.doc, {
    id: 'docs',
    component(
        { toc, frontmatter, default: MDX },
        _props: {
            markdownUrl: string
            path: string
        },
    ) {
        return (
            <>
                <PageTOCPopover>
                    <PageTOCPopoverTrigger />
                    <PageTOCPopoverContent>
                        <PageTOCTitle />
                        <PageTOCPopoverItems className="mt-3" />
                    </PageTOCPopoverContent>
                </PageTOCPopover>

                <PageRoot toc={{ toc }}>
                    <PageArticle>
                        <PageBreadcrumb className="mb-4" />
                        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
                            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">{frontmatter.title}</h1>
                            {frontmatter.description ? (
                                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
                                    {frontmatter.description}
                                </p>
                            ) : null}
                        </header>

                        <div className="flex flex-col gap-6">
                            <MDX components={useMDXComponents()} />
                        </div>

                        <PageFooter className="mt-12" />
                    </PageArticle>

                    <PageTOC>
                        <PageTOCTitle />
                        <PageTOCItems className="mt-4" />
                    </PageTOC>
                </PageRoot>
            </>
        )
    },
})

function Page() {
    const { path, pageTree, slugs } = Route.useLoaderData() as DocsLoaderData
    const markdownUrl = `/llms.mdx/docs/${slugs.join('/')}`

    return (
        <DocsLayout {...baseOptions()} tree={pageTree}>
            <Suspense>{clientLoader.useContent(path, { markdownUrl, path })}</Suspense>
        </DocsLayout>
    )
}
