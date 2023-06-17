// components
import { LoginForm } from '~/features/auth/components/login-form';

// utils
import { redirect } from 'next/navigation';
import { getMetadata, getRoleURL } from '~/lib/functions';
import { clsx } from '@locaci/ui/lib/functions';
import { getUser } from '~/server/trpc/rsc/getUser';
import { use } from 'react';

// types
import type { Metadata } from 'next';
import type { PageProps } from '~/next-app-types';

export function generateMetadata(): Metadata {
    return getMetadata({
        title: 'Connexion',
        path: '/auth/login'
    });
}

export default function LoginPage({
    searchParams
}: PageProps<{}, { force_login?: string; redirect_to?: string }>) {
    if (searchParams?.force_login !== 'true') {
        const user = use(getUser());

        if (user) {
            redirect(getRoleURL(user.role));
        }
    }

    return (
        <>
            <section className="flex h-full items-center justify-center">
                <div
                    className={clsx(
                        'flex h-full w-full flex-col gap-14 px-6 pt-20 pb-10',
                        'md:m-auto md:h-auto md:w-[450px]'
                    )}>
                    <div>
                        <h1 className="text-center text-2xl font-extrabold leading-normal md:text-3xl">
                            Bienvenue sur Locaci
                        </h1>
                        <h2 className="text-center text-lg text-gray">
                            Entrez vos informations pour continuer
                        </h2>
                    </div>

                    <LoginForm redirectTo={searchParams?.redirect_to} />
                </div>
            </section>
        </>
    );
}
