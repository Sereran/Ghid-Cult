export default defineEventHandler(async (event) => {
    const slugOrId = getRouterParam(event, 'slug')

    if (!slugOrId) {
        throw createError({ statusCode: 400, statusMessage: 'Tour identifier is required.' })
    }

    const tour = await prisma.tour.findFirst({
        where: {
            isActive: true,
            OR: [
                { slug: slugOrId },
                { id: slugOrId },
            ],
        },
        include: {
            articles: {
                where: { status: 'PUBLISHED' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    imageUrl: true,
                    readTime: true,
                },
            },
        },
    })

    if (!tour) {
        throw createError({ statusCode: 404, statusMessage: 'Tour not found or not currently active.' })
    }

    // Fetch up to 3 related active tours
    const relatedTours = await prisma.tour.findMany({
        where: {
            isActive: true,
            id: { not: tour.id },
        },
        take: 3,
        select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            duration: true,
            price: true,
        },
    })

    return {
        success: true,
        tour,
        relatedTours,
    }
})