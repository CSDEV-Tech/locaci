import * as React from 'react';
import { Button, TextInput } from '@locaci/ui';
import { getHostWithScheme } from '../lib/functions';
import { trpc } from '../utils/trpc-rq-hooks';
import toast, { Toaster } from 'react-hot-toast';

export type LoginPageProps = {};

export default function LoginPage(props: LoginPageProps) {
    const [email, setEmail] = React.useState('');
    const mutation = trpc.proxy.auth.sendEmailLink.useMutation();

    async function login(email: string) {
        await mutation.mutateAsync({
            email,
            redirectTo: `${getHostWithScheme(
                window.location.href
            )}/auth/callback`
        });

        toast.success('Email envoyé!');
    }

    return (
        <main className="flex flex-col gap-4 items-center justify-center min-h-screen p-4 bg-dark text-white">
            <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-primary">
                LOGIN
            </h1>
            <form
                className="flex flex-col gap-4 items-stretch"
                onSubmit={e => {
                    e.preventDefault();
                    login(email);
                }}>
                <TextInput
                    type="email"
                    required
                    value={email}
                    label="Email"
                    onChange={setEmail}
                />
                <Button
                    variant="hollow"
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
