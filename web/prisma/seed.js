const { PrismaClient } = require('@prisma/client');
const yaml = require('js-yaml');
const { promises: fs } = require('node:fs');
const path = require('node:path');

const prisma = new PrismaClient();

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
        await prisma.locality.deleteMany();
        await prisma.municipality.deleteMany();
        await prisma.city.deleteMany();

        console.log(`Recreating cities table ...`);
        for (const city of data.cities) {
            const cityEntity = await prisma.city.create({
                data: {
                    name: city.name.toLowerCase(),
                    municipalities: {
                        create: city.municipalities.map(m => {
                            return {
                                name: m.name.toLowerCase(),
                                localities: {
                                    create: m.localities.map(l => ({
                                        name: l.name.toLowerCase()
                                    }))
                                }
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
