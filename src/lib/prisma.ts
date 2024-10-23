import { PrismaClient } from "@prisma/client";

const prismaClientSinglton = () => {
    return new PrismaClient()
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const prisma = globalForPrisma.prisma ?? prismaClientSinglton();


export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma