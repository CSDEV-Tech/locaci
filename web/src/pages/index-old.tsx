import * as React from 'react';
import { t } from '~/utils/trpc-rq-hooks';

// type hint for layout
import type { NextPageWithLayout } from '~/pages/_app';
import { DefaultLayout } from '~/features/shared/components/layouts/default-layout';

const Home: NextPageWithLayout = () => {
    const { data, isLoading, isError, error } =
        t.property.getLastThreeCreated.useQuery(undefined, {
            staleTime: Infinity,
            retry: 2
        });

    // TODO : TO REMOVE
    const utils = t.useContext();
    const mut = t.auth.setDefaultCookie.useMutation({
        async onSuccess(data, variables, context) {
            await utils.auth.getUser.invalidate();
            await utils.auth.getAuthenticatedUser.invalidate();
        }
    });

    React.useEffect(() => {
        mut.mutate();
    }, []);
    // END TODO : TO REMOVE

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
