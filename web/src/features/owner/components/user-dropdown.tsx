'use client';
import * as React from 'react';

// components
import { Dropdown } from '@locaci/ui/components/molecules/dropdown';
import { SignOut, SquaresFour, User } from 'phosphor-react';
import { Avatar } from '@locaci/ui/components/atoms/avatar';

// utils
import { useRouter } from 'next/navigation';
import { t } from '~/app/trpc-client-provider';
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
            <Dropdown
                align="right"
                className="z-20"
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
                        Icon: props => (
                            <SquaresFour
                                className={props.className}
                                weight={'bold'}
                            />
                        ),
                        href: `/owner`
                    },
                    {
                        text: 'Votre profil',
                        Icon: props => (
                            <User className={props.className} weight={'bold'} />
                        ),
                        href: `/profile`
                    },
                    {
                        text: 'Déconnexion',
                        Icon: props => (
                            <SignOut
                                className={props.className}
                                weight={'bold'}
                            />
                        ),
                        onClick() {
                            logoutMutation.mutate();
                        }
                    }
                ]}
            />
        </>
    );
}
