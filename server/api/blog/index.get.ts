export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const category = query.category as string | undefined
    const search = query.search as string | undefined

    const articles = await prisma.article.findMany({
        where: {
            status: 'PUBLISHED',
            ...(category && category !== 'All'
                ? { category: { equals: category, mode: 'insensitive' } }
                : {}),
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { shortDescription: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            imageUrl: true,
            shortDescription: true,
            readTime: true,
            isFeatured: true,
            publishedAt: true,
            createdAt: true,
            author: {
                select: {
                    fullName: true,
                },
            },
            tour: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
        orderBy: [
            { isFeatured: 'desc' },
            { publishedAt: 'desc' },
        ],
    })

    // Extract categories across published posts
    const publishedArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        select: { category: true },
    })

    const categoriesSet = new Set<string>()
    for (const a of publishedArticles) {
        if (a.category) categoriesSet.add(a.category)
    }

    return {
        success: true,
        categories: ['All', ...Array.from(categoriesSet)],
        articles,
    }
})