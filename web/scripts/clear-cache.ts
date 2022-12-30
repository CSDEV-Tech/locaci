import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Cache } from '../src/server/cache.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
