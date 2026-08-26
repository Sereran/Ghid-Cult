export interface Tour {
    id: string
    title: string
    shortDescription: string
    location: string
    duration: string
    groupSize: string
    rating: number
    reviews: number
    price: number
    tag: string
    img: string
    //optional properties for detailed tour information
    fullDescription?: string
    highlights?: string[]
    included?: string[]
    notIncluded?: string[]
    meetingPoint?: string
    languages?: string[]
}

export const tourTags = [
    'All',
    'Bestseller',
    'Top Rated',
    'Adventure',
    'Most Popular',
    'Cultural',
    'Nature',
    'Exclusive'
] as const

export const tours: Tour[] = [
    {
        id: 'sfintii-trei-ierarhi',
        title: 'Mănăstirea Sfinții Trei Ierarhi',
        shortDescription: 'Explore the 17th-century architectural masterpiece.',
        fullDescription: 'Constructed between 1637 and 1639 by Prince Vasile Lupu, the Monastery of the Three Holy Hierarchs is an exceptional architectural landmark known worldwide for its exterior stone ornamentation.\n\nAccompanied by an accredited local guide, you will uncover hidden historical facts, discover ancient relics, and view centuries-old frescoes.',
        location: 'Iași',
        duration: '4h',
        groupSize: '12 max',
        rating: 4.9,
        reviews: 238,
        price: 890,
        tag: 'Bestseller',
        img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Exterior stone carvings', 'Royal tombs', 'Museum of religious art'],
        included: ['Certified guide', 'All entry fees', 'Bottled water'],
        notIncluded: ['Hotel transfer', 'Personal expenses'],
        meetingPoint: 'Main Entrance Archway, Bulevardul Ștefan cel Mare și Sfânt 28, Iași',
        languages: ['Romanian', 'English', 'French']
    },
    {
        id: 'biblioteca-mihai-eminescu',
        title: 'Biblioteca Centrală Universitară',
        shortDescription: 'Discover one of the most stunning historical libraries and cultural hubs in Romania.',
        location: 'Iași',
        duration: '2h',
        groupSize: '8 max',
        rating: 4.8,
        reviews: 411,
        price: 120,
        tag: 'Top Rated',
        img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 'palatul-culturii',
        title: 'Palatul Culturii & Turnul cu Ceas',
        shortDescription: 'Walk through neo-gothic halls and four major museums in the heart of the city.',
        location: 'Iași',
        duration: '3h',
        groupSize: '15 max',
        rating: 4.9,
        reviews: 512,
        price: 250,
        tag: 'Cultural',
        img: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80',
    }
]