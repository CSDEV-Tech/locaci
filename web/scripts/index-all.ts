import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TypeSenseSearch } from '../src/server/typesense-search.js';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load environment variables
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

async function indexAll() {
    const searchClient = new TypeSenseSearch(
        process.env.TYPESENSE_SEARCH_API_KEY!,
        process.env.TYPESENSE_SEARCH_URL!
    );

    console.log('\x1b[33m%s\x1b[0m', '1/3: Clearing the index...');
    await searchClient.clean();
    console.log('\x1b[33m%s\x1b[0m', '2/3: Recreating the index...');
    await searchClient.createIndex();
    console.log('\x1b[33m%s\x1b[0m', '3/3: Indexing properties...');
    const prisma = new PrismaClient({
        log: ['error']
    });

    /**
     * Get all active properties
     */
    const properties = await prisma.property.findMany({
        where: {
            activeForListing: true,
            archived: false
        },
        include: {
            amenities: true,
            city: true,
            municipality: true,
            rooms: true
        }
    });
    await searchClient.index(properties);
    console.log('\x1b[32m%s\x1b[0m', 'Indexing finished ✨');
}

indexAll();
