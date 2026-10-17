import pkgPrisma from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const PrismaClientConstructor = (pkgPrisma as any).PrismaClient || (pkgPrisma as any).default?.PrismaClient || (pkgPrisma as any)
type PrismaClientInstance = InstanceType<typeof PrismaClientConstructor>

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientInstance }

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const db: PrismaClientInstance = globalForPrisma.prisma || new PrismaClientConstructor({ adapter })

export const prisma = db

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db
}

export default db