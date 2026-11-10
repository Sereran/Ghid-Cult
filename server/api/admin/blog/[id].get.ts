export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Article ID is required.' })
    }

    const article = await prisma.article.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
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
                    imageUrl: true,
                },
            },
        },
    })

    if (!article) {
        throw createError({ statusCode: 404, statusMessage: 'Article not found.' })
    }

    return {
        success: true,
        article,
    }
})