import dotenv from 'dotenv';
import path from 'node:path';
import { Cache } from '../app/lib/cache.server';

// load environment variables
dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

async function clearCache() {
    console.log('\x1b[33m%s\x1b[0m', 'Clearing the cache...');
    await Cache.clear();
    console.log('\x1b[32m%s\x1b[0m', 'Cache cleared ✨');
    // disconnect after emptying the cache
    await Cache.dispose();
}

clearCache();
