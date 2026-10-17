export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.fullName || !body.email || !body.password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Full name, email, and password are required.',
        })
    }

    const normalizedEmail = body.email.trim().toLowerCase()

    // Check if user already exists
    const existingUser = await db.user.findUnique({
        where: { email: normalizedEmail },
    })

    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'An account with this email address already exists.',
        })
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password)

    // Create user
    const newUser = await db.user.create({
        data: {
            fullName: body.fullName,
            email: normalizedEmail,
            password: hashedPassword,
            username: body.username ? body.username.trim() : null,
            phone: body.phone || null,
            role: 'CUSTOMER',
        },
        select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
        },
    })

    // Issue auth token and set cookie
    const token = generateAuthToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
    })

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
        success: true,
        token,
        user: newUser,
    }
})