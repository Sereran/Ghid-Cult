export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Tour ID is required.' })
    }

    const tour = await prisma.tour.findUnique({
        where: { id },
        include: {
            _count: {
                select: { bookings: true },
            },
        },
    })

    if (!tour) {
        throw createError({ statusCode: 404, statusMessage: 'Tour not found.' })
    }

    // If the tour has associated bookings, prevent deletion and suggest setting isActive to false instead
    if (tour._count.bookings > 0) {
        throw createError({
            statusCode: 409,
            statusMessage: `Cannot delete tour "${tour.title}" because it has ${tour._count.bookings} associated booking(s). Set isActive to false instead.`,
        })
    }

    await prisma.tour.delete({
        where: { id },
    })

    return {
        success: true,
        message: `Tour "${tour.title}" was successfully deleted.`,
    }
})