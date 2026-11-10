export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required.' })
    }

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            role: true,
            phone: true,
            createdAt: true,
            bookings: {
                select: {
                    id: true,
                    totalPrice: true,
                    bookingStatus: true,
                    paymentStatus: true,
                    createdAt: true,
                    tour: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
            },
        },
    })

    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found.' })
    }

    return {
        success: true,
        user,
    }
})