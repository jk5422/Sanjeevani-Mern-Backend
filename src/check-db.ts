import { prisma } from './shared/prisma';

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`Successfully connected to DB. User count: ${userCount}`);
    } catch (e) {
        console.error('DB Connection Failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
