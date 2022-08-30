import * as React from 'react';
import type { NextPage } from 'next';
import { trpc } from 'web/src/utils/trpc-rq-hooks';
import { Button } from '@locaci/ui';
import { supabase } from '../utils/supabase-client';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
    const router = useRouter();
    const { data, isLoading } = trpc.proxy.auth.getUser.useQuery();
    const mutation = trpc.proxy.auth.removeAuthCookie.useMutation();

    return (
        <main className="bg-dark min-h-screen w-full text-white">
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
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <div>NO DATA</div>
            )}
        </main>
    );
};

export default Home;
