import * as React from 'react';
// components
import { DefaultLayout } from '~/features/shared/components/layouts/default-layout';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';
import { Button, clsx, TextInput } from '@locaci/ui';

// functions & others
import { getHostWithScheme } from '~/utils/functions';
import { t } from '~/utils/trpc-rq-hooks';
import { sendEmailLinkSchema } from '~/server/trpc/validation/auth-schema';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { useOAuthMutation } from '~/features/shared/hooks/use-oauth-mutation';
import dynamic from 'next/dynamic';

// types
import type { NextPageWithLayout } from './_app';

const LoginSuccessModal = dynamic(
    () => import('~/features/auth/components/login-success-modal'),
    {
        ssr: false,
        suspense: true
    }
);

export const LoginPage: NextPageWithLayout = () => {
    const form = useZodForm({
        schema: sendEmailLinkSchema.omit({
            redirectTo: true
        }),
        defaultValues: {
            email: ''
        }
    });

    const loginWithEmailMutation = t.auth.sendEmailLink.useMutation();
    const loginWithOAuthMutation = useOAuthMutation();
    const [receiverEmail, setReceiverEmail] = React.useState<string>();

    async function login({ email }: { email: string }) {
        await loginWithEmailMutation.mutateAsync({
            email,
            redirectTo: `${getHostWithScheme(
                window.location.href
            )}/auth/callback`
        });

        setReceiverEmail(email);
        form.reset();
    }

    return (
        <>
            <React.Suspense fallback={<></>}>
                <LoginSuccessModal
                    onClose={loginWithEmailMutation.reset}
                    open={
                        loginWithEmailMutation.isSuccess &&
                        receiverEmail !== null
                    }
                    email={receiverEmail}
                />
            </React.Suspense>

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

                    <form
                        className="flex flex-col items-stretch gap-4"
                        onSubmit={form.handleSubmit(login)}>
                        <div className="flex flex-col gap-4 text-lg">
                            <TextInput
                                className="w-full"
                                type="email"
                                label="Email"
                                required
                                {...form.register('email')}
                                errorText={form.formState.errors.email?.message}
                            />

                            <Button
                                variant="primary"
                                type="submit"
                                block
                                loading={loginWithEmailMutation.isLoading}>
                                Connexion
                            </Button>

                            <small className="text-gray">
                                En cliquant sur "Connexion", vous acceptez
                                nos&nbsp;
                                <NextLink
                                    target="_blank"
                                    className="font-bold"
                                    href="/cgu">
                                    conditions générales
                                </NextLink>
                                &nbsp;et notre&nbsp;
                                <NextLink
                                    target="_blank"
                                    className="font-bold"
                                    href="/terms-and-policy">
                                    politique de confidentialité
                                </NextLink>
                                .
                            </small>

                            {/* Separator */}
                            <div className="my-2 flex items-center gap-2">
                                <hr className="h-[1px] w-full bg-lightgray" />
                                <span className="text-gray">Ou</span>
                                <hr className="h-[1px] w-full bg-lightgray" />
                            </div>

                            <Button
                                type="button"
                                loading={loginWithOAuthMutation.isLoading}
                                onClick={() =>
                                    loginWithOAuthMutation.mutate('google')
                                }
                                renderLeadingIcon={cls => (
                                    <img
                                        src={`/Google_Logo.svg`}
                                        className={cls}
                                    />
                                )}
                                variant="outline">
                                Connectez-vous avec google
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            <section
                className={clsx(
                    'fixed bottom-0 right-0 z-[-1] hidden',
                    'md:flex md:items-end md:justify-end'
                )}>
                <img
                    src="/empty_street.svg"
                    alt="Maison vide"
                    className={clsx(
                        'w-52 object-contain object-center',
                        'lg:w-64',
                        'xl:w-7'
                    )}
                />
            </section>
        </>
    );
};

export default LoginPage;

LoginPage.getLayout = page => {
    return (
        <DefaultLayout
            hideFooter
            title="Connexion"
            headerLeadingElement={<></>}
            toastDirection={`top-center`}
            className={`md:h-[calc(100vh-78px)]`}
            headerTrailingElement={
                <>
                    <NextLinkButton
                        href="/auth/request-access"
                        variant="hollow"
                        className="whitespace-nowrap">
                        Vous êtes un bailleur ?
                    </NextLinkButton>
                </>
            }>
            {page}
        </DefaultLayout>
    );
};
