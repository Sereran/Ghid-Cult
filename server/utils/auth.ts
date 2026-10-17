import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

const JWT_SECRET = process.env.JWT_SECRET || 'ghidcult-local-jwt-secret-key-12345'

export interface AuthUserPayload {
    userId: string
    email: string
    role: string
}

export const getAuthUser = (event: H3Event): AuthUserPayload | null => {
    const authHeader = getHeader(event, 'authorization')
    const cookieToken = getCookie(event, 'auth_token')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken

    if (!token) return null

    try {
        return jwt.verify(token, JWT_SECRET) as AuthUserPayload
    } catch {
        return null
    }
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}

export const generateAuthToken = (payload: { userId: string; email: string; role: string }): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const requireAdmin = (event: H3Event) => {
    const authHeader = getHeader(event, 'authorization')
    const cookieToken = getCookie(event, 'auth_token')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : cookieToken

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: No session token found.',
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }

        if (decoded.role !== 'ADMIN') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden: Administrative privileges required.',
            })
        }

        return decoded
    } catch (err: any) {
        if (err.statusCode === 403) throw err

        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid or expired session token.',
        })
    }
}