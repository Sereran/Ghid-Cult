export type UserRole = 'ADMIN' | 'CUSTOMER'
export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED'
export type PaymentStatus = 'PAID' | 'UNPAID' | 'REFUNDED'

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

export interface BookingRecord {
    id: string
    tourId: string
    userId: string | null
    customerName: string
    customerEmail: string
    customerPhone?: string | null
    tourDate: string
    persons: number
    unitPrice?: string | number
    totalPrice: string | number
    bookingStatus: BookingStatus
    paymentStatus: PaymentStatus
    billingAddress?: string | null
    createdAt: string
    tour?: {
        id: string
        title: string
        slug: string
    }
}