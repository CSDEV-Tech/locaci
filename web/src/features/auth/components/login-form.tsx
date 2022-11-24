'use client';
import * as React from 'react';

// components
import { TextInput } from '@locaci/ui/components/atoms/input';
import { Button } from '@locaci/ui/components/atoms/button';
import LoginSuccessModal from './login-success-modal';

// utils
import { t } from '~/app/trpc-client-provider';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { sendEmailLinkSchema } from '~/server/trpc/validation/auth-schema';
import { useOAuthMutation } from '~/features/shared/hooks/use-oauth-mutation';
import { getHostWithScheme } from '~/utils/functions';
import { NextLink } from '~/features/shared/components/next-link';

export function LoginForm() {
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
            <LoginSuccessModal
                onClose={loginWithEmailMutation.reset}
                open={
                    loginWithEmailMutation.isSuccess && receiverEmail !== null
                }
                email={receiverEmail}
            />
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
                        loading={loginWithOAuthMutation.isLoading}
                        onClick={() => loginWithOAuthMutation.mutate('google')}
                        renderLeadingIcon={cls => (
                            <img src={`/Google_Logo.svg`} className={cls} />
                        )}
                        variant="outline">
                        Connectez-vous avec google
                    </Button>
                </div>
            </form>
        </>
    );
}
