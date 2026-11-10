export type UserRole = 'ADMIN' | 'CUSTOMER'

export interface UserAccountRecord {
    id: string
    fullName: string
    username: string | null
    email: string
    role: UserRole
    phone: string | null
    avatarUrl?: string | null
    createdAt: string
    _count?: {
        bookings: number
        articles: number
    }
}