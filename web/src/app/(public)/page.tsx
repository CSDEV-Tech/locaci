import { rsc } from '~/server/trpc/rsc';
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';

// this page should be static
export const dynamic = 'auto',
    revalidate = 86_400; // 1 day

export default async function IndexPage() {
    const properties = await rsc.property.getLastThreeCreated.fetch();

    return (
        <HydrateClient state={await rsc.dehydrate()}>
            <h1 className="text-2xl">Page d'accueil</h1>

            <pre className="w-full overflow-x-scroll bg-dark p-2 text-white">
                {JSON.stringify(properties, null, 2)}
            </pre>
        </HydrateClient>
    );
}
