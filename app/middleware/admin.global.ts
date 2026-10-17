export default defineNuxtRouteMiddleware(async (to) => {
    if (to.path === '/admin' || to.path.startsWith('/admin/')) {
        const { user, fetchUser, isAdmin } = useAuth()

        // Fetch the user if not already fetched
        if (!user.value) {
            await fetchUser()
        }

        console.log('[AdminGuard] User:', user.value)
        console.log('[AdminGuard] Role:', user.value?.role)
        console.log('[AdminGuard] isAdmin:', isAdmin.value)

        // Redirect customers or unauthenticated users to the homepage
        if (!isAdmin.value || !isAdmin.value) {
            console.log('[AdminGuard] Access Denied -> Redirecting to /')
            return navigateTo('/', { replace: true })
        }

        console.log('[AdminGuard] Access Granted!')

    }
})