export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.email || !body.password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email and password are required.',
        })
    }

    const normalizedEmail = body.email.trim().toLowerCase()

    // Query user record from database
    const user = await db.user.findUnique({
        where: { email: normalizedEmail },
    })

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password.',
        })
    }

    // Compare hashed password
    const isValid = await verifyPassword(body.password, user.password)
    if (!isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password.',
        })
    }

    // Issue token
    const token = generateAuthToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    })

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
    })

    return {
        success: true,
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
        },
    }
})