import * as React from 'react';
import type { NextPage } from 'next';
import { trpc } from 'web/src/utils/trpc';
import { Button } from '@locaci/ui';
import { supabase } from '../utils/supabase-client';
import { useAuthCookieMutation } from './hooks/use-auth-cookie';

const Home: NextPage = () => {
    const { data, isLoading } = trpc.useQuery(['auth.getUser']);
    const mutation = useAuthCookieMutation();

    return (
        <main className="bg-dark min-h-screen w-full text-white">
            <h1 className="text-white">PROFILE</h1>

            <Button
                variant="secondary"
                onClick={async () => {
                    await supabase.auth.signOut();
                    mutation.mutate({
                        event: 'SIGNED_OUT',
                        session: null
                    });
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
