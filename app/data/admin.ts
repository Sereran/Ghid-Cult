export interface BookingRecord {
    id: string
    tour: string
    customer: string
    email: string
    date: string
    tourDate: string
    persons: number
    total: number
    status: 'confirmed' | 'pending' | 'cancelled'
}

export interface UserRecord {
    id: string
    name: string
    email: string
    joined: string
    bookings: number
    role: 'admin' | 'customer'
}

export interface TopTourMetric {
    title: string
    bookings: number
    revenue: number
}

export const allBookings: BookingRecord[] = [
    { id: 'BK-1041', tour: 'Iași City Tour', customer: 'Maria Popescu', email: 'maria.p@email.com', date: '30 Aug 2026', tourDate: '5 Sep 2026', persons: 2, total: 110, status: 'confirmed' },
    { id: 'BK-1040', tour: 'Palatul Culturii', customer: "James O'Brien", email: 'james.ob@email.com', date: '29 Aug 2026', tourDate: '3 Sep 2026', persons: 1, total: 35, status: 'confirmed' },
    { id: 'BK-1039', tour: 'Teatrul Național', customer: 'Sophie Laurent', email: 'slaurent@email.com', date: '28 Aug 2026', tourDate: '2 Sep 2026', persons: 3, total: 84, status: 'pending' },
    { id: 'BK-1038', tour: 'Grădina Botanică', customer: 'Hans Müller', email: 'h.muller@email.com', date: '27 Aug 2026', tourDate: '1 Sep 2026', persons: 4, total: 80, status: 'confirmed' },
    { id: 'BK-1037', tour: 'Mănăstirea Sfinții Trei Ierarhi', customer: 'Ana Dumitrescu', email: 'ana.d@email.com', date: '26 Aug 2026', tourDate: '31 Aug 2026', persons: 2, total: 90, status: 'cancelled' },
    { id: 'BK-1036', tour: 'Biblioteca Mihai Eminescu', customer: 'Carlos Reyes', email: 'creyes@email.com', date: '25 Aug 2026', tourDate: '30 Aug 2026', persons: 1, total: 30, status: 'confirmed' },
    { id: 'BK-1035', tour: 'Parcul Expoziției', customer: 'Yuki Tanaka', email: 'y.tanaka@email.com', date: '24 Aug 2026', tourDate: '28 Aug 2026', persons: 2, total: 50, status: 'confirmed' },
    { id: 'BK-1034', tour: 'Iași City Tour', customer: 'Elena Ionescu', email: 'e.ionescu@email.com', date: '23 Aug 2026', tourDate: '27 Aug 2026', persons: 3, total: 165, status: 'confirmed' },
    { id: 'BK-1033', tour: 'Palatul Culturii', customer: 'Marco Rossi', email: 'm.rossi@email.com', date: '22 Aug 2026', tourDate: '26 Aug 2026', persons: 2, total: 70, status: 'pending' },
    { id: 'BK-1032', tour: 'Teatrul Național', customer: 'Anna Schmidt', email: 'a.schmidt@email.com', date: '21 Aug 2026', tourDate: '25 Aug 2026', persons: 1, total: 28, status: 'cancelled' },
]

export const users: UserRecord[] = [
    { id: 'USR-001', name: 'Maria Popescu', email: 'maria.p@email.com', joined: '12 Jan 2026', bookings: 4, role: 'customer' },
    { id: 'USR-002', name: "James O'Brien", email: 'james.ob@email.com', joined: '3 Mar 2026', bookings: 2, role: 'customer' },
    { id: 'USR-003', name: 'Sophie Laurent', email: 'slaurent@email.com', joined: '18 Apr 2026', bookings: 1, role: 'customer' },
    { id: 'USR-004', name: 'Hans Müller', email: 'h.muller@email.com', joined: '7 Feb 2026', bookings: 5, role: 'customer' },
    { id: 'USR-005', name: 'Ana Dumitrescu', email: 'ana.d@email.com', joined: '20 May 2026', bookings: 1, role: 'customer' },
    { id: 'USR-006', name: 'Carlos Reyes', email: 'creyes@email.com', joined: '1 Jun 2026', bookings: 3, role: 'customer' },
    { id: 'USR-007', name: 'Yuki Tanaka', email: 'y.tanaka@email.com', joined: '14 Jun 2026', bookings: 2, role: 'customer' },
    { id: 'USR-008', name: 'Adrian Ilade', email: 'adrian.ilade@ghidcult.com', joined: '1 Jan 2020', bookings: 0, role: 'admin' },
]

export const topTours: TopTourMetric[] = [
    { title: 'Iași City Tour', bookings: 38, revenue: 2090 },
    { title: 'Mănăstirea Sfinții Trei Ierarhi', bookings: 29, revenue: 1305 },
    { title: 'Palatul Culturii', bookings: 21, revenue: 735 },
    { title: 'Grădina Botanică', bookings: 18, revenue: 360 },
    { title: 'Teatrul Național', bookings: 12, revenue: 336 },
]