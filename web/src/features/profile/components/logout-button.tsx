'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';

// utils
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { t } from '~/app/trpc-client-provider';

export function LogoutButton() {
    const router = useRouter();
    const [isNavigating, startTransition] = React.useTransition();

    const logoutMutation = t.auth.removeAuthCookie.useMutation({
        onSuccess() {
            startTransition(() => {
                router.replace(`/`);
                router.refresh();

                toast.success(`Vous vous êtes déconnecté`);
            });
        }
    });

    return (
        <>
            <Button
                variant="danger"
                loading={isNavigating}
                onClick={() => logoutMutation.mutate()}>
                Déconnexion
            </Button>
        </>
    );
}
