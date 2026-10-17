interface CreateTourBody {
  title: string
  slug?: string
  imageUrl: string
  mainTag?: string
  tags?: string[]
  shortDescription: string
  fullDescription: string
  location?: string
  meetingPlace: string
  departureTime: string
  itinerary?: string[]
  duration: string
  maxPersons?: number
  price: number | string
  rating?: number | string
  highlights?: string[]
  inclusions?: string[]
  exclusions?: string[]
  languages?: string[]
  specialConditions?: string
  isFeatured?: boolean
  isActive?: boolean
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<CreateTourBody>(event)

  if (
    !body.title ||
    !body.imageUrl ||
    !body.shortDescription ||
    !body.fullDescription ||
    !body.meetingPlace ||
    !body.departureTime ||
    !body.duration ||
    body.price === undefined
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required tour fields.',
    })
  }

  // Generate unique slug
  const baseSlug = (body.slug || body.title)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  let uniqueSlug = baseSlug
  let counter = 1
  while (await prisma.tour.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${counter++}`
  }

  try {
    const tour = await prisma.tour.create({
      data: {
        title: body.title.trim(),
        slug: uniqueSlug,
        imageUrl: body.imageUrl.trim(),
        mainTag: body.mainTag ? body.mainTag.trim() : null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        shortDescription: body.shortDescription.trim(),
        fullDescription: body.fullDescription,
        location: body.location ? body.location.trim() : 'Iași, Romania',
        meetingPlace: body.meetingPlace.trim(),
        departureTime: body.departureTime.trim(),
        itinerary: Array.isArray(body.itinerary) ? body.itinerary : [],
        duration: body.duration.trim(),
        maxPersons: body.maxPersons ? Number(body.maxPersons) : 12,
        price: body.price.toString(),
        rating: body.rating ? body.rating.toString() : '5.0',
        reviewsCount: 0,
        highlights: Array.isArray(body.highlights) ? body.highlights : [],
        inclusions: Array.isArray(body.inclusions) ? body.inclusions : [],
        exclusions: Array.isArray(body.exclusions) ? body.exclusions : [],
        languages: Array.isArray(body.languages) && body.languages.length > 0 ? body.languages : ['English', 'Romanian'],
        specialConditions: body.specialConditions ? body.specialConditions.trim() : null,
        isFeatured: body.isFeatured ?? false,
        isActive: body.isActive ?? true,
      },
    })

    setResponseStatus(event, 201)
    return {
      success: true,
      tour,
    }
  } catch (error: any) {
    // Logs the error message, otherwise logs the entire error object
    if (error.meta?.driverAdapterError?.message) {
      console.error('DATABASE ERROR:', error.meta.driverAdapterError.message)
    } else {
      console.error('ERROR OBJECT:', error)
    }
    throw error
  }
})