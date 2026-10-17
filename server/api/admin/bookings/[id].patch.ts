import type { BookingStatus, PaymentStatus } from '@prisma/client'

interface UpdateBookingBody {
    bookingStatus?: BookingStatus
    paymentStatus?: PaymentStatus
    customerName?: string
    customerEmail?: string
    customerPhone?: string
    tourDate?: string
    persons?: number
    billingAddress?: string
}

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

    const body = await readBody<UpdateBookingBody>(event)
    const updateData: Record<string, any> = {}

    if (body.bookingStatus) updateData.bookingStatus = body.bookingStatus
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus
    if (body.customerName) updateData.customerName = body.customerName.trim()
    if (body.customerEmail) updateData.customerEmail = body.customerEmail.toLowerCase().trim()
    if (body.customerPhone !== undefined) updateData.customerPhone = body.customerPhone?.trim() || null
    if (body.billingAddress !== undefined) updateData.billingAddress = body.billingAddress?.trim() || null
    if (body.tourDate) updateData.tourDate = new Date(body.tourDate)

    // Recalculate totalPrice if persons changed
    if (body.persons && Number(body.persons) !== existingBooking.persons) {
        const personsCount = Number(body.persons)
        updateData.persons = personsCount
        updateData.totalPrice = Number(existingBooking.unitPrice) * personsCount
    }

    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: updateData,
        include: {
            tour: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    })

    return {
        success: true,
        booking: updatedBooking,
    }
})