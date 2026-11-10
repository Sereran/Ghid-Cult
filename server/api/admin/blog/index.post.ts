import type { ArticleStatus } from '@prisma/client'

interface CreateArticleBody {
    title: string
    slug?: string
    category: string
    imageUrl: string
    videoUrl?: string
    tourId?: string
    shortDescription: string
    content: string
    quotes?: string
    readTime?: string
    isFeatured?: boolean
    status?: ArticleStatus
}

export default defineEventHandler(async (event) => {
    const admin = requireAdmin(event)

    const body = await readBody<CreateArticleBody>(event) || {}

    if (!body.title || !body.category || !body.imageUrl || !body.shortDescription || !body.content) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required article fields (title, category, imageUrl, shortDescription, content).',
        })
    }

    // ReadTime calculation
    let calculatedReadTime = body.readTime
    if (!calculatedReadTime) {
        const rawText = body.content.replace(/<[^>]*>/g, ' ').trim()
        const wordCount = rawText.length > 0 ? rawText.split(/\s+/).length : 0
        const minutes = Math.max(1, Math.ceil(wordCount / 200))
        calculatedReadTime = `${minutes} min read`
    }

    // Generate unique slug
    const baseSlug = (body.slug || body.title)
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

    let uniqueSlug = baseSlug
    let counter = 1
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter++}`
    }

    // If tourId provided, verify it exists
    if (body.tourId) {
        const tourExists = await prisma.tour.findUnique({ where: { id: body.tourId } })
        if (!tourExists) {
            throw createError({ statusCode: 404, statusMessage: 'Linked tour does not exist.' })
        }
    }

    const article = await prisma.article.create({
        data: {
            title: body.title.trim(),
            slug: uniqueSlug,
            category: body.category.trim(),
            imageUrl: body.imageUrl.trim(),
            videoUrl: body.videoUrl?.trim() || null,
            authorId: admin.userId || null,
            tourId: body.tourId || null,
            shortDescription: body.shortDescription.trim(),
            content: body.content,
            quotes: body.quotes?.trim() || null,
            readTime: calculatedReadTime,
            isFeatured: body.isFeatured ?? false,
            status: body.status || 'PUBLISHED',
            publishedAt: body.status === 'DRAFT' ? null : new Date(),
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
    })

    setResponseStatus(event, 201)
    return {
        success: true,
        article,
    }
})