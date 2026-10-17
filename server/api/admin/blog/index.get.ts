import type { ArticleStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const query = getQuery(event)
    const status = query.status as ArticleStatus | undefined
    const category = query.category as string | undefined
    const isFeatured = query.isFeatured !== undefined ? query.isFeatured === 'true' : undefined
    const search = query.search as string | undefined

    const articles = await prisma.article.findMany({
        where: {
            ...(status ? { status } : {}),
            ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
            ...(isFeatured !== undefined ? { isFeatured } : {}),
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { shortDescription: { contains: search, mode: 'insensitive' } },
                        { category: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
        include: {
            author: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
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
        orderBy: {
            createdAt: 'desc',
        },
    })

    return {
        success: true,
        total: articles.length,
        articles,
    }
})