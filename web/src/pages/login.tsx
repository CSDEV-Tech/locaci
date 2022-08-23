import type { GetStaticProps } from 'next';
import * as React from 'react';
import { Button, TextInput } from '@locaci/ui';
import { getHostWithScheme } from '../lib/functions';
import { X } from 'phosphor-react';
import { trpc } from '../utils/trpc';

export type LoginPageProps = {};

export default function LoginPage(props: LoginPageProps) {
    const [email, setEmail] = React.useState('');
    const [msg, setMsg] = React.useState<string | null>(null);
    const mutation = trpc.useMutation('auth.sendEmailLink');

    async function login(email: string) {
        await mutation.mutateAsync({
            email,
            redirectTo: `${getHostWithScheme(
                window.location.href
            )}/auth/callback`
        });

        setMsg('Email envoyé !');
    }

    return (
        <main className="flex flex-col gap-4 items-center justify-center min-h-screen p-4 bg-dark text-white">
            <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-primary">
                LOGIN
            </h1>

            {msg && (
                <div className="flex items-center gap-1 border border-secondary p-2 bg-secondary-15 rounded-md text-dark font-medium">
                    <span>{msg}</span>

                    <Button
                        square
                        variant="outline"
                        onClick={() => setMsg(null)}
                        ariaLabel="fermer"
                        renderLeadingIcon={cls => (
                            <X className={cls} weight="bold" />
                        )}
                    />
                </div>
            )}
            <form
                className="flex flex-col gap-4 items-stretch"
                onSubmit={e => {
                    e.preventDefault();
                    login(email);
                }}>
                <TextInput
                    type="email"
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
        </main>
    );
}

export const getStaticProps: GetStaticProps<LoginPageProps> = async () => {
    // TODO
    const props = {};

    return {
        props,
        revalidate: 1
    };
};
