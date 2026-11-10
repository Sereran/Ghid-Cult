import fs from 'node:fs/promises'
import path from 'node:path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
    endpoint: process.env.ENDPOINT,
    region: process.env.REGION || 'eu-west-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
})

export default defineEventHandler(async (event) => {
    requireAdmin(event)

    // Read multipart form data
    const form = await readMultipartFormData(event)

    if (!form || form.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No file uploaded.',
        })
    }

    const file = form.find((item) => item.name === 'file')
    if (!file || !file.filename || !file.data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid file provided.',
        })
    }

    const bucketName = process.env.RAILWAY_BUCKET_NAME
    const endpoint = process.env.ENDPOINT

    if (!bucketName || !endpoint) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Railway Bucket environment variables are not configured.',
        })
    }

    // Clean filename and make it unique
    const sanitizedName = file.filename.replace(/[^\w.-]/g, '_').toLowerCase()
    const uniqueFilename = `uploads/${Date.now()}-${sanitizedName}`

    // Upload binary data to Bucket
    await s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: uniqueFilename,
            Body: file.data,
            ContentType: file.type || 'image/jpeg',
        })
    )

    // Build the public web URL
    const publicUrl = `${endpoint}/${bucketName}/${uniqueFilename}`

    return {
        success: true,
        url: publicUrl,
    }
})