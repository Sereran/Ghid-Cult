export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Tour ID is required.' })
    }

    const tour = await prisma.tour.findUnique({
        where: { id },
        include: {
            articles: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    status: true,
                },
            },
            _count: {
                select: {
                    bookings: true,
                    articles: true,
                },
            },
        },
    })

    if (!tour) {
        throw createError({ statusCode: 404, statusMessage: 'Tour not found.' })
    }

    return {
        success: true,
        tour,
    }
})