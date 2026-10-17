interface UpdateAccountBody {
    fullName?: string
    email?: string
    username?: string | null
    phone?: string | null
    avatarUrl?: string | null
    role?: 'CUSTOMER' | 'ADMIN'
    password?: string
}

export default defineEventHandler(async (event) => {
    const admin = requireAdmin(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required.' })
    }

    const body = await readBody<UpdateAccountBody>(event)

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
        throw createError({ statusCode: 404, statusMessage: 'User not found.' })
    }

    // Prevent admin from accidentally demoting their own account
    if (admin.userId === id && body.role && body.role !== 'ADMIN') {
        throw createError({
            statusCode: 400,
            statusMessage: 'You cannot revoke your own administrative privileges.',
        })
    }

    // Prepare update data
    const updateData: Record<string, any> = {}

    if (body.fullName !== undefined) updateData.fullName = body.fullName.trim()
    if (body.username !== undefined) updateData.username = body.username ? body.username.trim() : null
    if (body.phone !== undefined) updateData.phone = body.phone ? body.phone.trim() : null
    if (body.role !== undefined) updateData.role = body.role
    if (body.avatarUrl !== undefined) {
        updateData.avatarUrl = body.avatarUrl?.trim() || null
    }

    if (body.email !== undefined) {
        const normalizedEmail = body.email.toLowerCase().trim()
        if (normalizedEmail !== targetUser.email) {
            const emailExists = await prisma.user.findUnique({ where: { email: normalizedEmail } })
            if (emailExists) {
                throw createError({ statusCode: 409, statusMessage: 'Email address is already in use.' })
            }
            updateData.email = normalizedEmail
        }
    }

    if (body.password) {
        updateData.password = await hashPassword(body.password)
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
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

    return {
        success: true,
        user: updatedUser,
    }
})