export default defineEventHandler(async (event) => {
    requireAdmin(event)

    const query = getQuery(event)
    const role = query.role as string | undefined
    const search = query.search as string | undefined

    const users = await prisma.user.findMany({
        where: {
            ...(role ? { role: role as 'CUSTOMER' | 'ADMIN' } : {}),
            ...(search
                ? {
                    OR: [
                        { fullName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { username: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
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
            _count: {
                select: {
                    bookings: true,
                    articles: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })

    return {
        success: true,
        users,
    }
})