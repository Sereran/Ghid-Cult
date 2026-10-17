import { getAuthUser } from '~~/server/utils/auth'

interface CreateBookingBody {
    tourId: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    tourDate: string
    persons: number
    billingAddress?: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody<CreateBookingBody>(event)

    if (!body.tourId || !body.customerName || !body.customerEmail || !body.tourDate || !body.persons) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required booking fields (tourId, customerName, customerEmail, tourDate, persons).',
        })
    }

    const personsCount = Number(body.persons)
    if (isNaN(personsCount) || personsCount < 1) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Persons must be at least 1.',
        })
    }

    // Find tour to verify existence, active state, and grab price
    const tour = await prisma.tour.findUnique({
        where: { id: body.tourId },
    })

    if (!tour || !tour.isActive) {
        throw createError({
            statusCode: 404,
            statusMessage: 'The selected tour is unavailable or does not exist.',
        })
    }

    if (personsCount > tour.maxPersons) {
        throw createError({
            statusCode: 400,
            statusMessage: `The maximum allowed group size for this tour is ${tour.maxPersons}.`,
        })
    }

    // Calculate prices safely without Prisma.Decimal constructor
    const unitPrice = tour.price
    const totalPrice = (Number(unitPrice) * personsCount).toFixed(2)

    // Attach logged-in user if authenticated
    const authUser = getAuthUser(event)
    const userId = authUser?.userId || null

    const booking = await prisma.booking.create({
        data: {
            tourId: tour.id,
            userId,
            customerName: body.customerName.trim(),
            customerEmail: body.customerEmail.toLowerCase().trim(),
            customerPhone: body.customerPhone?.trim() || null,
            tourDate: new Date(body.tourDate),
            persons: personsCount,
            unitPrice,
            totalPrice,
            bookingStatus: 'PENDING',
            paymentStatus: 'UNPAID',
            billingAddress: body.billingAddress?.trim() || null,
        },
        include: {
            tour: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    departureTime: true,
                    meetingPlace: true,
                },
            },
        },
    })

    setResponseStatus(event, 201)
    return {
        success: true,
        booking,
    }
})