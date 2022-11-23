import { prisma } from '~/server/db/client';
import type { PageProps } from '~/types';

export default async function IndexPage(props: PageProps) {
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
            <h1 className="text-2xl">Home page</h1>

            <pre className="w-full overflow-x-scroll bg-dark p-2 text-white">
                {JSON.stringify(properties, null, 2)}
            </pre>
        </>
    );
}
