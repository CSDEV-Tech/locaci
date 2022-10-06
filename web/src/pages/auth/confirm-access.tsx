import * as React from 'react';

// components
import { LoadingIndicator } from '@locaci/ui';
import { DefaultLayout } from '@/features/shared/components/layouts/default-layout';

// utils
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { t } from '@/utils/trpc-rq-hooks';

// types
import type { NextPageWithLayout } from '@/pages/_app';

export type ConfirmAccessPageProps = {};

const ConfirmAccessPage: NextPageWithLayout<ConfirmAccessPageProps> = props => {
    const router = useRouter();

    const setAuthCookieMutation = t.auth.setAuthCookie.useMutation({
        onSuccess() {
            router.push('/owner');
        }
    });

    const confirmAccessMutation = t.auth.owner.confirmAccess.useMutation({
        onSuccess(data) {
            setAuthCookieMutation.mutate({
                uid: data.uid
            });
        },
        onError(error) {
            toast.error(error.message);
            router.push('/auth/request-access');
        }
    });

    // use effect because you cannot call router in server environment
    React.useEffect(() => {
        if (!(typeof router.query.token === 'string')) {
            toast.error(
                `Ce lien est invalide, veuillez en demander un nouveau`
            );
            router.push('/auth/request-access');
            return;
        }

        confirmAccessMutation.mutate({
            token: router.query.token
        });
    }, [router.query.token]);

    return (
        <section className="flex h-screen w-screen items-center justify-center">
            <h1 className="flex items-center gap-4 text-4xl">
                <LoadingIndicator className="h-10" /> <span>CHARGEMENT...</span>
            </h1>
        </section>
    );
};

export default ConfirmAccessPage;
ConfirmAccessPage.getLayout = page => (
    <DefaultLayout hideFooter hideHeader title="Connexion à votre compte...">
        {page}
    </DefaultLayout>
);
