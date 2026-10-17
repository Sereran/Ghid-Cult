export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const query = getQuery(event)
    const search = query.search as string | undefined
    const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined
    const isFeatured = query.isFeatured !== undefined ? query.isFeatured === 'true' : undefined
    const tag = query.tag as string | undefined

    const tours = await prisma.tour.findMany({
        where: {
            ...(isActive !== undefined ? { isActive } : {}),
            ...(isFeatured !== undefined ? { isFeatured } : {}),
            ...(tag ? { tags: { has: tag } } : {}),
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { location: { contains: search, mode: 'insensitive' } },
                        { mainTag: { contains: search, mode: 'insensitive' } },
                        { shortDescription: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
        include: {
            _count: {
                select: {
                    bookings: true,
                    articles: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return {
        success: true,
        total: tours.length,
        tours,
    }
})