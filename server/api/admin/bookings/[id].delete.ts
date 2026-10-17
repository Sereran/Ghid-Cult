export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Booking ID is required.' })
    }

    const existingBooking = await prisma.booking.findUnique({
        where: { id },
    })

    if (!existingBooking) {
        throw createError({ statusCode: 404, statusMessage: 'Booking not found.' })
    }

    await prisma.booking.delete({
        where: { id },
    })

    return {
        success: true,
        message: `Booking #${id} successfully removed.`,
    }
})