export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Tour ID is required.' })
    }

    const existingTour = await prisma.tour.findUnique({ where: { id } })
    if (!existingTour) {
        throw createError({ statusCode: 404, statusMessage: 'Tour not found.' })
    }

    const body = await readBody<Record<string, any>>(event)
    const updateData: Record<string, any> = {}

    const stringFields = [
        'title',
        'imageUrl',
        'mainTag',
        'shortDescription',
        'fullDescription',
        'location',
        'meetingPlace',
        'departureTime',
        'duration',
        'specialConditions',
    ]
    for (const field of stringFields) {
        if (body[field] !== undefined) {
            updateData[field] = typeof body[field] === 'string' ? body[field].trim() : body[field]
        }
    }

    const arrayFields = ['tags', 'itinerary', 'highlights', 'inclusions', 'exclusions', 'languages']
    for (const field of arrayFields) {
        if (Array.isArray(body[field])) {
            updateData[field] = body[field]
        }
    }

    if (body.maxPersons !== undefined) updateData.maxPersons = Number(body.maxPersons)
    if (body.price !== undefined) updateData.price = body.price.toString()
    if (body.rating !== undefined) updateData.rating = body.rating.toString()
    if (body.reviewsCount !== undefined) updateData.reviewsCount = Number(body.reviewsCount)

    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured)
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive)

    // Slug handling
    if (body.slug && body.slug !== existingTour.slug) {
        const cleanSlug = body.slug
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')

        const slugTaken = await prisma.tour.findFirst({
            where: {
                slug: cleanSlug,
                NOT: { id },
            },
        })

        if (slugTaken) {
            throw createError({ statusCode: 409, statusMessage: 'A tour with this slug already exists.' })
        }
        updateData.slug = cleanSlug
    }

    const updatedTour = await prisma.tour.update({
        where: { id },
        data: updateData,
    })

    return {
        success: true,
        tour: updatedTour,
    }
})