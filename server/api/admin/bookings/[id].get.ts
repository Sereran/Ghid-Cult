export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Booking ID is required.' })
    }

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            tour: true,
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                },
            },
        },
    })

    if (!booking) {
        throw createError({ statusCode: 404, statusMessage: 'Booking not found.' })
    }

    return {
        success: true,
        booking,
    }
})