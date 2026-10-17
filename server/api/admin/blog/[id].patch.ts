import type { ArticleStatus } from '@prisma/client'

interface UpdateArticleBody {
    title?: string
    slug?: string
    category?: string
    imageUrl?: string
    videoUrl?: string | null
    tourId?: string | null
    shortDescription?: string
    content?: string
    quotes?: string | null
    readTime?: string
    isFeatured?: boolean
    status?: ArticleStatus
}

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

    const body = await readBody<UpdateArticleBody>(event)
    const updateData: Record<string, any> = {}

    // Prepare update data
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.category !== undefined) updateData.category = body.category.trim()
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl.trim()
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription.trim()
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl?.trim() || null
    if (body.quotes !== undefined) updateData.quotes = body.quotes?.trim() || null
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)

    // Toggle Status
    if (body.status !== undefined) {
        updateData.status = body.status
        if (body.status === 'PUBLISHED' && !existingArticle.publishedAt) {
            updateData.publishedAt = new Date()
        }
    }

    // Content and ReadTime recalculation
    if (body.content !== undefined) {
        updateData.content = body.content
        const rawText = body.content.replace(/<[^>]*>/g, ' ').trim()
        const wordCount = rawText.length > 0 ? rawText.split(/\s+/).length : 0
        const minutes = Math.max(1, Math.ceil(wordCount / 200))
        updateData.readTime = body.readTime || `${minutes} min read`
    } else if (body.readTime !== undefined) {
        updateData.readTime = body.readTime
    }

    // Tour linking / unlinking
    if (body.tourId !== undefined) {
        if (body.tourId === null || body.tourId === '') {
            updateData.tourId = null
        } else {
            const tourExists = await prisma.tour.findUnique({ where: { id: body.tourId } })
            if (!tourExists) {
                throw createError({ statusCode: 404, statusMessage: 'Linked tour does not exist.' })
            }
            updateData.tourId = body.tourId
        }
    }

    // Slug handling
    if (body.slug && body.slug !== existingArticle.slug) {
        const cleanSlug = body.slug
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')

        const slugTaken = await prisma.article.findFirst({
            where: {
                slug: cleanSlug,
                NOT: { id },
            },
        })

        if (slugTaken) {
            throw createError({ statusCode: 409, statusMessage: 'An article with this slug already exists.' })
        }
        updateData.slug = cleanSlug
    }

    const updatedArticle = await prisma.article.update({
        where: { id },
        data: updateData,
        include: {
            tour: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    })

    return {
        success: true,
        article: updatedArticle,
    }
})