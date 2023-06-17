'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';

// utils
import { t } from '~/app/(routes)/trpc-client-provider';
import { useRouter } from 'next/navigation';
import { clsx } from '@locaci/ui/lib/functions';

export function AddButton({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const router = useRouter();
    const [isNavigating, startTransition] = React.useTransition();

    const createPropertyMutation = t.owner.draft.newDraft.useMutation({
        onSuccess(data) {
            startTransition(() => {
                router.refresh();
                router.push(`/owner/properties/${data.uuid}/draft`);
            });
        }
    });

    return (
        <>
            <Button
                className={clsx(className, 'whitespace-nowrap')}
                variant="secondary"
                onClick={() => createPropertyMutation.mutate()}
                loading={createPropertyMutation.isLoading || isNavigating}>
                {children}
            </Button>
        </>
    );
}
