'use client';
import * as React from 'react';

// components
import { TextInput } from '@locaci/ui/components/atoms/input';
import { Button } from '@locaci/ui/components/atoms/button';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';
import LoginSuccessModal from './login-success-modal';
import { CaretDoubleLeftIcon } from '@locaci/ui/components/atoms/icons/caret-double-left';

// utils
import { useRouter } from 'next/navigation';
import { t } from '~/app/trpc-client-provider';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import {
    sendOtpSchema,
    verifyOtpSchema
} from '~/lib/validation-schemas/auth-schema';
import { getHostWithScheme } from '~/lib/functions';
import { env } from '~/env/client.mjs';
import toast from 'react-hot-toast';

export type LoginFormProps = {
    redirectTo?: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
    // forms
    const sendOtpForm = useZodForm({
        schema: sendOtpSchema,
        defaultValues: {
            email: ''
        }
    });

    const verifyOtpForm = useZodForm({
        schema: verifyOtpSchema.omit({
            email: true
        })
    });

    // state
    const [step, setStep] = React.useState<'INITIAL' | 'CODE'>('INITIAL');
    const [receiverEmail, setReceiverEmail] = React.useState<string>();

    const router = useRouter();
    const [isRefreshing, startTransition] = React.useTransition();

    // mutations
    const sendOtpMutation = t.auth.sendOtpCode.useMutation({
        onSuccess(_, variables) {
            sendOtpForm.reset();
            setReceiverEmail(variables.email);
            setStep('CODE');
        }
    });

    const verifyOtpMutation = t.auth.verifyOtpCode.useMutation({
        onSuccess() {
            // refresh to redirect to login
            toast.success(`Connexion effectuée avec succès`);
            startTransition(() => {
                if (redirectTo) {
                    router.push(redirectTo);
                } else {
                    router.refresh();
                }
            });
        }
    });

    return (
        <>
            <LoginSuccessModal
                onClose={sendOtpMutation.reset}
                open={sendOtpMutation.isSuccess && receiverEmail !== null}
                email={receiverEmail}
            />

            {step === 'INITIAL' && (
                <form
                    className="flex flex-col items-stretch gap-4"
                    onSubmit={sendOtpForm.handleSubmit(({ email }) =>
                        sendOtpMutation.mutate({
                            email
                        })
                    )}>
                    <div className="flex flex-col gap-4 text-lg">
                        <TextInput
                            className="w-full"
                            type="email"
                            label="Email"
                            required
                            {...sendOtpForm.register('email')}
                            errorText={
                                sendOtpForm.formState.errors.email?.message ||
                                sendOtpMutation.error?.message
                            }
                        />

                        <Button
                            variant="primary"
                            type="submit"
                            block
                            loading={sendOtpMutation.isLoading}>
                            Continuer
                        </Button>

                        <small className="text-gray">
                            En cliquant sur "Connexion", vous acceptez nos&nbsp;
                            <NextLink
                                target="_blank"
                                className="font-semibold underline"
                                href="/cgu">
                                conditions générales
                            </NextLink>
                            &nbsp;et notre&nbsp;
                            <NextLink
                                target="_blank"
                                className="font-semibold underline"
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

                        <NextLinkButton
                            href={`${
                                env.NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL
                            }/authorize?${getAuth0URL(
                                'google-oauth2',
                                redirectTo
                            ).toString()}`}
                            renderLeadingIcon={cls => (
                                <img src={`/Google_Logo.svg`} className={cls} />
                            )}
                            variant="outline">
                            Connectez-vous avec google
                        </NextLinkButton>
                    </div>
                </form>
            )}

            {step === 'CODE' && (
                <form
                    className="flex flex-col items-stretch gap-4"
                    onSubmit={verifyOtpForm.handleSubmit(({ otp }) =>
                        verifyOtpMutation.mutate({ otp, email: receiverEmail! })
                    )}>
                    <div className="flex flex-col gap-4 text-lg">
                        <TextInput
                            className="w-full"
                            type="text"
                            inputMode="numeric"
                            label="Code secret"
                            required
                            {...verifyOtpForm.register('otp')}
                            errorText={
                                verifyOtpForm.formState.errors.otp?.message ||
                                verifyOtpMutation.error?.message
                            }
                        />

                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="hollow"
                                className="w-full"
                                onClick={() => {
                                    setStep('INITIAL');
                                    verifyOtpForm.reset();
                                    verifyOtpMutation.reset();
                                }}
                                renderLeadingIcon={cls => (
                                    <CaretDoubleLeftIcon className={cls} />
                                )}>
                                Recommencer
                            </Button>

                            <Button
                                variant="primary"
                                type="submit"
                                block
                                className="w-full"
                                loading={
                                    verifyOtpMutation.isLoading || isRefreshing
                                }>
                                Connexion
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}

function getAuth0URL(
    provider: string,
    redirect_after_callback?: string
): URLSearchParams {
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', env.NEXT_PUBLIC_OAUTH_CLIENT_ID);
    params.append(
        'redirect_uri',
        `${getHostWithScheme(env.NEXT_PUBLIC_SITE_URL)}/api/auth-callback${
            redirect_after_callback
                ? `?redirect_to=${encodeURIComponent(redirect_after_callback)}`
                : ''
        }`
    );
    params.append('connection', provider);
    params.append('scope', 'openid profile email');

    return params;
}
