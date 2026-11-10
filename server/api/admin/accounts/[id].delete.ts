export default defineEventHandler(async (event) => {
    const admin = requireAdmin(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'User ID is required.' })
    }

    // Guard against self-deletion
    if (admin.userId === id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'You cannot delete your own account.',
        })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
        throw createError({ statusCode: 404, statusMessage: 'User not found.' })
    }

    await prisma.user.delete({
        where: { id },
    })

    return {
        success: true,
        message: `Account for ${user.email} was successfully deleted.`,
    }
})