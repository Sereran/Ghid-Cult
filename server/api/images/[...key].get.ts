import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
    const bucketName = process.env.BUCKET
    const endpoint = process.env.ENDPOINT
    const accessKeyId = process.env.ACCESS_KEY_ID
    const secretAccessKey = process.env.SECRET_ACCESS_KEY
    const region = process.env.REGION || 'auto'

    if (!bucketName || !endpoint || !accessKeyId || !secretAccessKey) {
        throw createError({ statusCode: 500, statusMessage: 'Storage parameters missing' })
    }

    // Extract everything after /api/images/
    const key = getRouterParam(event, 'key')
    if (!key) {
        throw createError({ statusCode: 400, statusMessage: 'Missing file path' })
    }

    const s3Client = new S3Client({
        endpoint,
        region,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true,
    })

    try {
        const response = await s3Client.send(
            new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            })
        )

        if (response.ContentType) {
            setHeader(event, 'Content-Type', response.ContentType)
        }
        // Cache images in browser
        setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

        return response.Body?.transformToWebStream()
    } catch {
        throw createError({ statusCode: 404, statusMessage: 'Image not found' })
    }
})