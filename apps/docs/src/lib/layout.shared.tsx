import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { siteConfig } from '@/lib/site'

export const gitConfig = {
    user: siteConfig.repoOwner,
    repo: siteConfig.repoName,
    branch: siteConfig.repoBranch,
}

export function baseOptions(): BaseLayoutProps {
    return {
        nav: {
            title: siteConfig.navTitle,
            url: '/',
        },
        links: siteConfig.navLinks,
        githubUrl: siteConfig.repoUrl,
    }
}
