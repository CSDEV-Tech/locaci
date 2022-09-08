// components
import { Button } from '@locaci/ui';
import { DefaultLayout } from 'web/src/components/layouts/default-layout';

// utils
import { useRouter } from 'next/router';
import { supabase } from 'web/src/utils/supabase-client';
import { t } from 'web/src/utils/trpc-rq-hooks';

// types
import type { NextPageWithLayout } from '../_app';

export type OwnerDashboardPageProps = {};

const OwnerDashboardPage: NextPageWithLayout<OwnerDashboardPageProps> = () => {
    const router = useRouter();
    const utils = t.proxy.useContext();
    const {
        data: user,
        isLoading,
        isError
    } = t.proxy.auth.getAuthenticatedUser.useQuery();
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
        <>
            {/* FIXME: REMOVE THIS WHEN DOING PROFILE PAGE */}
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
                ) : user ? (
                    <pre className="w-full overflow-scroll">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                ) : (
                    <div>NO DATA</div>
                )}
            </div>
        </>
    );
};

export default OwnerDashboardPage;
OwnerDashboardPage.getLayout = page => {
    return <DefaultLayout>{page}</DefaultLayout>;
};
