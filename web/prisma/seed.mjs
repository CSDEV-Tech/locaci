// @ts-check
import { PrismaClient } from '@prisma/client';
import yaml from 'js-yaml';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    try {
        const data = yaml.load(
            await fs.readFile(
                path.join(path.resolve(__dirname, 'city-data.yaml')),
                'utf8'
            )
        );

        console.log(`Start seeding ...`);
        console.log(`Empting cities table ...`);
        await prisma.municipality.deleteMany();

        const default_owner = await prisma.user.findMany({
            where: {
                email: 'fredkiss3@gmail.com',
                role: 'PROPERTY_OWNER'
            }
        });

        if (default_owner.length === 0) {
            try {
                await prisma.user.delete({
                    where: {
                        email: 'fredkiss3@gmail.com'
                    }
                });
            } catch (error) {
                console.error('error =>', error.message);
            }

            await prisma.user.create({
                data: {
                    email: 'fredkiss3@gmail.com',
                    email_verified: true,
                    role: 'PROPERTY_OWNER',
                    avatarURL:
                        'https://avatars.githubusercontent.com/u/38298743?v=4'
                }
            });
        }

        await prisma.city.deleteMany();

        console.log(`Recreating cities table ...`);
        for (const city of data.cities) {
            const cityEntity = await prisma.city.create({
                data: {
                    name: city.name.toLowerCase(),
                    municipalities: {
                        create: city.municipalities.map(m => {
                            return {
                                name: m.name.toLowerCase()
                            };
                        })
                    }
                }
            });
            console.log(`Created city with id: ${cityEntity.id}`);
        }
        console.log(`Seeding finished.`);
    } catch (e) {
        console.log(e);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
