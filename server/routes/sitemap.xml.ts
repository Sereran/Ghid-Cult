export default defineEventHandler(async (event) => {
    const baseUrl = 'https://ghidcult.com'
    const staticPaths = ['', '/blog', '/about', '/contact', '/en', '/en/blog', '/en/about', '/en/contact']

    let articleUrls: string[] = []
    try {
        const res = await $fetch<{
            articles?: Array<{ slug?: string | null; updatedAt?: string; createdAt?: string }>
        }>('/api/blog')

        const articles = res?.articles || []
        articleUrls = articles
            .filter((a) => Boolean(a.slug))
            .map((a) => {
                const lastmod = a.updatedAt || a.createdAt
                return `
    <url>
        <loc>${baseUrl}/blog/${a.slug}</loc>${lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    </url>`
            })
    } catch {
        // Fallback to static pages if DB is temporarily unreachable
    }

    const staticUrls = staticPaths.map(
        (path) => `
    <url>
        <loc>${baseUrl}${path}</loc>
    </url>`
    )

    setHeader(event, 'Content-Type', 'application/xml')
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('')}
${articleUrls.join('')}
</urlset>`
})