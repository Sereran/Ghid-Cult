import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'ghidcult-local-jwt-secret-key-12345'

export default defineEventHandler(async (event) => {
    // Read token from cookie or Authorization header
    const authHeader = getHeader(event, 'authorization')
    const cookieToken = getCookie(event, 'auth_token')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized. No active session token found.',
        })
    }

    let decoded: any
    try {
        decoded = jwt.verify(token, JWT_SECRET)
    } catch {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired session token.',
        })
    }

    // Fetch fresh user profile with their bookings relation
    const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            phone: true,
            avatarUrl: true,
            role: true,
            createdAt: true,
            bookings: {
                include: {
                    tour: {
                        select: {
                            title: true,
                            slug: true,
                            meetingPlace: true,
                            departureTime: true,
                        },
                    },
                },
            },
        },
    })

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User account not found.',
        })
    }

    return { success: true, user }
})