import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { t } from '@web/utils/trpc-rq-hooks';

// All these imports are necessary SSG & SSR
import { appRouter } from '@web/server/trpc/router';
import type { AppRouter } from '@web/server/trpc/router';
import { createProxySSGHelpers } from '@trpc/react/ssg';
import { createContext } from '@web/server/trpc/context';
import superjson from 'superjson';

// type hint for layout
import type { NextPageWithLayout } from '@web/pages/_app';
import { DefaultLayout } from '@web/components/layouts/default-layout';

const Home: NextPageWithLayout = () => {
    const { data, isLoading, isError, error } =
        t.property.getLastThreeCreated.useQuery(undefined, {
            staleTime: Infinity,
            retry: 2
        });

    return (
        <>
            {isLoading && <p className="text-lg">LOADING...</p>}
            {isError && (
                <div className="text-lg">
                    Error : <div>{error.toString()}</div>
                </div>
            )}

            <div>{data && <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
        </>
    );
};

export default Home;

Home.getLayout = page => {
    return <DefaultLayout>{page}</DefaultLayout>;
};

export const getStaticProps: GetStaticProps = async () => {
    const ssg = createProxySSGHelpers<AppRouter>({
        router: appRouter,
        ctx: await createContext(),
        transformer: superjson
    });

    await ssg.property.getLastThreeCreated.fetch();

    return {
        props: {
            trpcState: ssg.dehydrate()
        }
    };
};
