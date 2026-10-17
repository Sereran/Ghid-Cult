export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Article ID is required.' })
    }

    const existingArticle = await prisma.article.findUnique({ where: { id } })
    if (!existingArticle) {
        throw createError({ statusCode: 404, statusMessage: 'Article not found.' })
    }

    await prisma.article.delete({
        where: { id },
    })

    return {
        success: true,
        message: `Article "${existingArticle.title}" was successfully deleted.`,
    }
})