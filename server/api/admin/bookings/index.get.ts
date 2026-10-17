import type { BookingStatus, PaymentStatus } from '@prisma/client'

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const query = getQuery(event)
    const bookingStatus = query.bookingStatus as BookingStatus | undefined
    const paymentStatus = query.paymentStatus as PaymentStatus | undefined
    const tourId = query.tourId as string | undefined
    const search = query.search as string | undefined

    const bookings = await prisma.booking.findMany({
        where: {
            ...(bookingStatus ? { bookingStatus } : {}),
            ...(paymentStatus ? { paymentStatus } : {}),
            ...(tourId ? { tourId } : {}),
            ...(search
                ? {
                    OR: [
                        { customerName: { contains: search, mode: 'insensitive' } },
                        { customerEmail: { contains: search, mode: 'insensitive' } },
                        { customerPhone: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        },
        include: {
            tour: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return {
        success: true,
        total: bookings.length,
        bookings,
    }
})