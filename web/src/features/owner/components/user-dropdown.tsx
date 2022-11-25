'use client';
import * as React from 'react';

// components
import { Dropdown } from '@locaci/ui/components/molecules/dropdown';
import { SignOut, SquaresFour } from 'phosphor-react';
import { Avatar } from '@locaci/ui/components/atoms/avatar';

// utils
import { useRouter } from 'next/navigation';
import { t } from '~/utils/trpc-rq-hooks';
import { toast } from 'react-hot-toast';
import { NextLink } from '~/features/shared/components/next-link';

// types
export type UserDropdownProps = {
    user: {
        firstName?: string | null;
        lastName?: string | null;
        avatarURL?: string | null;
    };
};

export function UserDropdown({ user }: UserDropdownProps) {
    const router = useRouter();
    const [_, startTransition] = React.useTransition();

    const logoutMutation = t.auth.removeAuthCookie.useMutation({
        onSuccess(data, variables, context) {
            startTransition(() => {
                router.replace(`/`);
                router.refresh();

                toast.success(`Vous vous êtes déconnecté`);
            });
        }
    });

    return (
        <>
            <Dropdown
                align="right"
                customLink={NextLink}
                button={() => (
                    <button>
                        <Avatar
                            name={`${user.firstName} ${user.lastName}`}
                            src={user.avatarURL}
                            className="bg-secondary"
                        />
                    </button>
                )}
                items={[
                    {
                        text: 'Tableau de bord',
                        Icon: SquaresFour,
                        href: `/owner`
                    },
                    {
                        text: 'Déconnexion',
                        Icon: SignOut,
                        onClick() {
                            logoutMutation.mutate();
                        }
                    }
                ]}
            />
        </>
    );
}
