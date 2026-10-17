export interface TourCount {
    bookings: number
    articles: number
}

export interface AdminTourRecord {
    id: string
    title: string
    slug: string
    imageUrl: string
    mainTag: string | null
    tags: string[]
    shortDescription: string
    fullDescription: string
    location: string
    meetingPlace: string
    departureTime: string
    itinerary: string[]
    duration: string
    maxPersons: number
    price: string | number
    rating: string | number
    reviewsCount: number
    highlights: string[]
    inclusions: string[]
    exclusions: string[]
    languages: string[]
    specialConditions: string | null
    isFeatured: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
    _count?: TourCount
}

export interface CreateTourFormInput {
    title: string
    imageUrl: string
    mainTag: string
    tags: string
    shortDescription: string
    fullDescription: string
    meetingPlace: string
    departureTime: string
    duration: string
    location: string
    price: number | string
    maxPersons: number | string
    isFeatured: boolean
}