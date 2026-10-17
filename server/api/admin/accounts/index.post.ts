interface CreateAccountBody {
    fullName: string
    email: string
    password: string
    role?: 'CUSTOMER' | 'ADMIN'
    username?: string
    phone?: string
    avatarUrl?: string | null
}

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const body = await readBody<CreateAccountBody>(event)

    if (!body.email || !body.fullName || !body.password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Full name, email, and password are required.',
        })
    }

    const normalizedEmail = body.email.toLowerCase().trim()

    // Check unique constraints
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: normalizedEmail },
                body.username ? { username: body.username.trim() } : {},
            ],
        },
    })

    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'An account with this email or username already exists.',
        })
    }

    // Hash password
    const passwordHash = await hashPassword(body.password)

    const user = await prisma.user.create({
        data: {
            fullName: body.fullName.trim(),
            email: normalizedEmail,
            password: passwordHash,
            role: body.role || 'CUSTOMER',
            username: body.username?.trim() || null,
            phone: body.phone?.trim() || null,
            avatarUrl: body.avatarUrl?.trim() || null
        },
        select: {
            id: true,
            fullName: true,
            username: true,
            email: true,
            role: true,
            phone: true,
            avatarUrl: true,
            createdAt: true,
        },
    })

    setResponseStatus(event, 201)
    return {
        success: true,
        user,
    }
})