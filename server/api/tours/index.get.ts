export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const tag = query.tag as string | undefined
    const search = query.search as string | undefined

    const tours = await prisma.tour.findMany({
        where: {
            isActive: true, // Only show published tours
            ...(tag && tag !== 'All'
                ? {
                    OR: [
                        { mainTag: { equals: tag, mode: 'insensitive' } },
                        { tags: { has: tag } },
                    ],
                }
                : {}),
            ...(search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { location: { contains: search, mode: 'insensitive' } },
                        { shortDescription: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
        select: {
            id: true,
            title: true,
            slug: true,
            imageUrl: true,
            mainTag: true,
            tags: true,
            shortDescription: true,
            location: true,
            duration: true,
            maxPersons: true,
            price: true,
            rating: true,
            reviewsCount: true,
            isFeatured: true,
        },
        orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' },
        ],
    })

    // Collect tags for category filter buttons
    const allTours = await prisma.tour.findMany({
        where: { isActive: true },
        select: { mainTag: true, tags: true },
    })

    const tagsSet = new Set<string>()
    for (const t of allTours) {
        if (t.mainTag) tagsSet.add(t.mainTag)
        t.tags.forEach((item: string) => tagsSet.add(item))
    }

    return {
        success: true,
        tags: ['All', ...Array.from(tagsSet)],
        tours,
    }
})