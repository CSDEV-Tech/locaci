import { prisma } from '~/server/db/client';

export default async function IndexPage() {
    const properties = await prisma.property.findMany({
        where: {
            archived: false
        },
        take: 3,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <>
            <h1 className="text-2xl">Page d'accueil</h1>

            <pre className="w-full overflow-x-scroll bg-dark p-2 text-white">
                {JSON.stringify(properties, null, 2)}
            </pre>
        </>
    );
}
