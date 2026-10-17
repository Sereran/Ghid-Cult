export interface AuthUser {
    id: string
    fullName: string
    username: string | null
    email: string
    role: 'CUSTOMER' | 'ADMIN'
    phone?: string | null
    createdAt?: string
    bookings?: any[]
}

export const useAuth = () => {
    const user = useState<AuthUser | null>('auth_user', () => null)
    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')

    // Capture SSR headers synchronously
    const reqHeaders = useRequestHeaders(['cookie'])

    // Fetch the current user on site start or page reload
    const fetchUser = async () => {
        try {
            const response = await $fetch<{ success: boolean; user: AuthUser }>('/api/user/me', {
                headers: reqHeaders, // Pass SSR headers to the API call
            })
            user.value = response.user
            return response.user
        } catch (err) {
            user.value = null
            return null
        }
    }

    // Log in
    const login = async (credentials: { email: string; password: string }) => {
        const response = await $fetch<{ success: boolean; user: AuthUser }>('/api/auth/login', {
            method: 'POST',
            body: credentials,
        })
        user.value = response.user
        return navigateTo('/')
    }

    // Register
    const register = async (payload: any) => {
        const response = await $fetch<{ success: boolean; user: AuthUser }>('/api/auth/register', {
            method: 'POST',
            body: payload,
        })
        user.value = response.user
        return navigateTo('/')
    }

    // Log out
    const logout = async () => {
        await $fetch('/api/auth/logout', { method: 'POST' })
        user.value = null
        return navigateTo('/auth')
    }

    return {
        user,
        isAuthenticated,
        isAdmin,
        fetchUser,
        login,
        register,
        logout,
    }
}