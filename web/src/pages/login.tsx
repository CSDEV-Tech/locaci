import * as React from 'react';
// components
import { DefaultLayout } from '../components/layouts/default-layout';
import { NextLink, NextLinkButton } from '../components/next-link';
import { BottomSheet, Button, TextInput } from '@locaci/ui';

// functions & others
import { getHostWithScheme } from '../lib/functions';
import { t } from '../utils/trpc-rq-hooks';
import { sendEmailLinkSchema } from '../server/trpc/validation/auth-schema';
import { useZodForm } from '../hooks/use-zod-form';

// types
import type { NextPageWithLayout } from './_app';

export const LoginPage: NextPageWithLayout = () => {
    const form = useZodForm({
        schema: sendEmailLinkSchema.omit({
            redirectTo: true
        }),
        defaultValues: {
            email: ''
        }
    });

    const mutation = t.proxy.auth.sendEmailLink.useMutation();
    const [receiverEmail, setReceiverEmail] = React.useState<string>();

    async function login({ email }: { email: string }) {
        await mutation.mutateAsync({
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
            <SuccessModal
                onClose={mutation.reset}
                open={mutation.isSuccess && receiverEmail !== null}
                email={receiverEmail}
            />

            <div className="flex h-full w-full flex-col justify-between gap-14 px-6 pt-20 pb-10">
                <div>
                    <h1 className="text-center text-2xl font-extrabold leading-normal md:text-3xl">
                        Bienvenue sur Locaci
                    </h1>
                    <h2 className="text-center text-lg text-gray">
                        Entrez vos coordonnées pour continuer
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
                            loading={mutation.isLoading}>
                            Connexion
                        </Button>

                        <small className="text-gray">
                            En cliquant sur "Connexion", vous acceptez nos&nbsp;
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
                            renderLeadingIcon={cls => (
                                <img src={`/Google_Logo.svg`} className={cls} />
                            )}
                            variant="outline">
                            Connectez-vous avec google
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;

LoginPage.getLayout = page => {
    return (
        <DefaultLayout
            hideFooter
            headerLeadingElement={<></>}
            toastDirection={`top-center`}
            headerTrailingElement={
                <>
                    <NextLinkButton href="/request-access" variant="hollow">
                        Vous êtes un bailleur ?
                    </NextLinkButton>
                </>
            }>
            {page}
        </DefaultLayout>
    );
};

type SuccessModalProps = {
    open: boolean;
    onClose: () => void;
    email?: string | null;
};

function SuccessModal({ email, onClose, open }: SuccessModalProps) {
    return (
        <BottomSheet
            open={open}
            expandOnContentDrag
            onDismiss={onClose}
            defaultSnap={({ minHeight }) => minHeight}
            snapPoints={({ maxHeight, minHeight }) => [
                minHeight,
                maxHeight * 0.95
            ]}
            className={`md:hidden `}>
            <div
                className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10"
                aria-live="assertive">
                <img
                    src="/success_illustration.svg"
                    alt="Image de succès"
                    className="h-[165px] w-[240px]"
                />

                <h2 className="text-2xl font-extrabold">
                    Vérifiez votre boîte email
                </h2>
                <section className="flex flex-col gap-4 text-left text-gray">
                    <p>
                        Nous avons envoyé un email de vérification à
                        l'adresse&nbsp;
                        <strong className="font-bold">{email}</strong>.
                    </p>
                    <p>
                        Vous n'avez qu'à cliquer sur le lien dans cet email pour
                        vous connecter. Si vous ne le trouvez pas, veuillez
                        vérifier dans vos SPAMS.
                    </p>
                </section>

                <Button variant="hollow" onClick={onClose}>
                    Fermer
                </Button>
            </div>
        </BottomSheet>
    );
}
