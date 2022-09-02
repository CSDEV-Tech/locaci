import * as React from 'react';
import { Button } from '@locaci/ui';
import { supabase } from '../utils/supabase-client';
import { useRouter } from 'next/router';

import { t } from 'web/src/utils/trpc-rq-hooks';

import type { NextPageWithLayout } from './_app';
import { DefaultLayout } from '../components/layouts/default-layout';

const ProfilePage: NextPageWithLayout = () => {
    const router = useRouter();
    const utils = t.proxy.useContext();
    const { data, isLoading, isError } =
        t.proxy.auth.getAuthenticatedUser.useQuery();
    const mutation = t.proxy.auth.removeAuthCookie.useMutation({
        onSuccess: async () => {
            supabase.auth.signOut();
            utils.auth.getAuthenticatedUser.invalidate();
            utils.auth.getUser.invalidate();
        }
    });

    if (isError) {
        router.replace('/login');
    }

    return (
        <div className="h-full w-full bg-dark text-white">
            <h1 className="text-white">PROFILE</h1>

            <Button
                loading={mutation.isLoading}
                variant="secondary"
                onClick={async () => {
                    await supabase.auth.signOut();
                    mutation.mutate();
                    router.push('/');
                }}>
                Logout
            </Button>

            {isLoading ? (
                <div>Loading User...</div>
            ) : data ? (
                <pre className="w-full overflow-scroll">
                    {JSON.stringify(data, null, 2)}
                </pre>
            ) : (
                <div>NO DATA</div>
            )}
        </div>
    );
};

export default ProfilePage;

ProfilePage.getLayout = page => {
    return <DefaultLayout>{page}</DefaultLayout>;
};
