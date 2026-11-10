export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface ArticleRecord {
    id: string
    slug: string
    title: string
    category: string
    imageUrl: string
    videoUrl?: string | null
    shortDescription: string
    content: string
    quotes?: string | null
    readTime: string
    isFeatured: boolean
    status: ArticleStatus
    publishedAt?: string | null
    createdAt: string
    updatedAt: string
    authorId?: string | null
    tourId?: string | null
    author?: {
        id: string
        fullName: string
        email: string
    }
    tour?: {
        id: string
        title: string
        slug: string
        price?: string | number
        imageUrl?: string
    } | null
}

export interface CreateArticleInput {
    title: string
    slug?: string
    category: string
    imageUrl: string
    videoUrl?: string
    tourId?: string
    shortDescription: string
    content: string
    quotes?: string
    isFeatured?: boolean
    status?: ArticleStatus
}

export const BLOG_CATEGORIES = [
    'History',
    'Architecture',
    'Culture',
    'Guides & Tips'
] as const