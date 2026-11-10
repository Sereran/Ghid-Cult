export default defineEventHandler(async (event) => {
    const slugOrId = getRouterParam(event, 'slug')

    if (!slugOrId) {
        throw createError({ statusCode: 400, statusMessage: 'Article identifier is required.' })
    }

    const article = await prisma.article.findFirst({
        where: {
            status: 'PUBLISHED',
            OR: [
                { slug: slugOrId },
                { id: slugOrId },
            ],
        },
        include: {
            author: {
                select: {
                    fullName: true,
                    email: true,
                    avatarUrl: true,
                },
            },
            tour: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    price: true,
                    shortDescription: true,
                    imageUrl: true,
                },
            },
        },
    })

    if (!article) {
        throw createError({ statusCode: 404, statusMessage: 'Article not found or not published.' })
    }

    // Fetch up to 2 suggestions in the same category (or most recent)
    let suggestions = await prisma.article.findMany({
        where: {
            status: 'PUBLISHED',
            id: { not: article.id },
            category: article.category,
        },
        take: 2,
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            imageUrl: true,
            readTime: true,
            publishedAt: true,
        },
        orderBy: { publishedAt: 'desc' },
    })

    if (suggestions.length === 0) {
        suggestions = await prisma.article.findMany({
            where: {
                status: 'PUBLISHED',
                id: { not: article.id },
            },
            take: 2,
            select: {
                id: true,
                title: true,
                slug: true,
                category: true,
                imageUrl: true,
                readTime: true,
                publishedAt: true,
            },
            orderBy: { publishedAt: 'desc' },
        })
    }

    return {
        success: true,
        article,
        suggestions,
    }
})