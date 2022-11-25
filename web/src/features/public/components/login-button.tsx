'use client';
import * as React from 'react';
import { Button } from '@locaci/ui/components/atoms/button';
import { useRouter } from 'next/navigation';

export function LoginButton() {
    const [isNavigating, startTransition] = React.useTransition();
    const router = useRouter();

    return (
        <>
            <Button
                variant="hollow"
                loading={isNavigating}
                onClick={() =>
                    startTransition(() => {
                        router.push('/auth/login');
                    })
                }>
                Connexion
            </Button>
        </>
    );
}
