export default defineNuxtRouteMiddleware(async (to) => {
    const { user, fetchUser, isAdmin } = useAuth()

    // Ensure current session is retrieved from cookie
    if (!user.value) {
        await fetchUser()
    }

    // If already logged in as ADMIN and hitting /admin, allow through
    if (to.path === '/admin') {
        return
    }

    // Protect all sub-routes (/admin/blog, /admin/users, /admin/blog/create, etc.)
    if (to.path.startsWith('/admin/') && !isAdmin.value) {
        return navigateTo('/admin')
    }
})