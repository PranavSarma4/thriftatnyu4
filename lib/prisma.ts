import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  // Check if using Prisma Accelerate (URL starts with prisma+postgres://)
  const isAccelerateUrl = databaseUrl?.startsWith('prisma+postgres://');
  
  if (isAccelerateUrl) {
    // Use Prisma Accelerate
    return new PrismaClient({
      accelerateUrl: databaseUrl,
    });
  }
  
  // Standard PostgreSQL connection - Prisma reads URL from prisma.config.ts
  return new PrismaClient();
};

// Lazy initialization - only create client when actually used
let prismaInstance: PrismaClient | undefined;

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!prismaInstance) {
      prismaInstance = globalForPrisma.prisma ?? createPrismaClient();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (prismaInstance as any)[prop];
  },
});

export default prisma;

