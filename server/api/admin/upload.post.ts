import fs from 'node:fs/promises'
import path from 'node:path'

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

    // Ensure target folder exists
    const uploadDir = path.resolve(process.cwd(), 'public/uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    // Clean filename and make it unique with a timestamp
    const sanitizedName = file.filename.replace(/[^\w.-]/g, '_').toLowerCase()
    const uniqueFilename = `${Date.now()}-${sanitizedName}`
    const filePath = path.join(uploadDir, uniqueFilename)

    // Save buffer to disk
    await fs.writeFile(filePath, file.data)

    // Return the public web path
    return {
        success: true,
        url: `/uploads/${uniqueFilename}`,
    }
})