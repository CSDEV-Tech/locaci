import { rsc } from '~/server/ssr-helpers';

export default async function IndexPage() {
    const properties = await rsc.property.getLastThreeCreated();

    return (
        <>
            <h1 className="text-2xl">Page d'accueil</h1>

            <pre className="w-full overflow-x-scroll bg-dark p-2 text-white">
                {JSON.stringify(properties, null, 2)}
            </pre>
        </>
    );
}
