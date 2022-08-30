import * as React from 'react';
import { Button, TextInput } from '@locaci/ui';
import { getHostWithScheme } from '../lib/functions';
import { trpc } from '../utils/trpc-rq-hooks';
import toast, { Toaster } from 'react-hot-toast';

import { sendEmailLinkSchema } from '../server/trpc/validation/auth-schema';
import { useZodForm } from '../hooks/use-zod-form';

export type LoginPageProps = {};

export default function LoginPage(props: LoginPageProps) {
    const {
        handleSubmit,
        register,
        reset: resetForm,
        formState: { errors }
    } = useZodForm({
        schema: sendEmailLinkSchema.omit({
            redirectTo: true
        }),
        defaultValues: {
            email: ''
        }
    });

    const mutation = trpc.proxy.auth.sendEmailLink.useMutation();

    async function login({ email }: { email: string }) {
        await mutation.mutateAsync({
            email,
            redirectTo: `${getHostWithScheme(
                window.location.href
            )}/auth/callback`
        });

        toast.success('Email envoyé!');
        resetForm();
    }

    return (
        <main className="flex flex-col gap-4 items-center justify-center min-h-screen p-4 bg-dark">
            <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-primary">
                LOGIN
            </h1>
            <form
                className="flex flex-col gap-4 items-stretch"
                onSubmit={handleSubmit(login)}>
                <TextInput
                    type="email"
                    label="Email"
                    required
                    {...register('email')}
                    errorText={errors.email?.message}
                />

                <Button
                    variant="primary"
                    type="submit"
                    block
                    loading={mutation.isLoading}>
                    Login with email
                </Button>
            </form>
            <Toaster />
        </main>
    );
}
