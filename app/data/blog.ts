export interface BlogPost {
    id: string
    title: string
    excerpt: string
    body: string[]
    category: string
    date: string
    readTime: string
    img: string
    featured?: boolean
}

export const categories = [
    'All',
    'History',
    'Architecture',
    'Culture',
    'Guides & Tips'
] as const

export const posts: BlogPost[] = [
    {
        id: 'hidden-stone-details-iasi',
        title: 'The Hidden Stone Details of Iași That Most Visitors Miss',
        excerpt: 'Beyond the grandeur of the Palace of Culture lies a layer of intricate 17th-century stonecraft. Here is what to look for when you slow down.',
        body: [
            'Iași is an architectural patchwork. While the Neo-Gothic silhouette of the Palace of Culture dominates most postcards, the real texture of the city is found in smaller, quieter stone surfaces.',
            'From the Armenian churchyard to the intricate exterior friezes of Trei Ierarhi, stone carvers left symbols that bridged Eastern Orthodox tradition and Ottoman artistic influence.',
            'When leading walks through the old quarter, I always ask travelers to stop looking only at rooflines and start studying the ground courses and door lintels.'
        ],
        category: 'Architecture',
        date: 'Oct 14, 2025',
        readTime: '6 min read',
        img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80',
        featured: true
    },
    {
        id: 'why-slow-travel-matters-in-moldavia',
        title: 'Why Slow Travel Matters in Moldavia',
        excerpt: 'Rushing through six monasteries in a day teaches you geography, not history. Slow travel allows the context of Moldavia to settle in.',
        body: [
            'Most itineraries treat Moldavian cultural landmarks as checkmarks on a checklist. But historical landmarks demand patience.',
            'The acoustics inside medieval stone chapels, the smell of centuries of beeswax, and the changing light in late afternoon cannot be absorbed in twenty minutes.'
        ],
        category: 'Culture',
        date: 'Sep 28, 2025',
        readTime: '4 min read',
        img: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=1200&q=80',
        featured: false
    },
    {
        id: 'the-palace-clock-tower-secrets',
        title: 'Echoes from the Palace Clock Tower',
        excerpt: 'Inside the carillon bells and historical mechanism that has marked time over Iași for generations.',
        body: [
            'The carillon in the central tower of the Palace of Culture plays Hora Unirii at the top of every hour. The mechanics behind it are a marvel of early 20th-century German engineering.',
            'Climbing into the clock room reveals the steel skeleton and mechanical drums that keep the melody alive.'
        ],
        category: 'History',
        date: 'Aug 19, 2025',
        readTime: '5 min read',
        img: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
        featured: false
    }
]