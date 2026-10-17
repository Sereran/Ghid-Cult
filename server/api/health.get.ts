export default defineEventHandler(async () => {
    try {
        // Test database connectivity with a count query
        const userCount = await db.user.count()
        const tourCount = await db.tour.count()

        return {
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
            counts: {
                users: userCount,
                tours: tourCount,
            },
        }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database connection failed',
            data: error.message,
        })
    }
})