'use client';
import * as React from 'react';
// components
import { HouseSimple, List, User } from 'phosphor-react';
import { SideNav } from '@locaci/ui/components/molecules/side-nav';
import { Avatar } from '@locaci/ui/components/atoms/avatar';
import { Button } from '@locaci/ui/components/atoms/button';
import { NextLink } from '~/features/shared/components/next-link';

// utils
import { usePathname } from 'next/navigation';
import { clsx } from '@locaci/ui/lib/functions';
import useMediaQuery from '~/features/shared/hooks/use-media-query';

// types
export type OwnerSidebarProps = {
    user: {
        email: string;
        firstName: string | null;
        lastName: string | null;
        avartarURL: string | null;
    };
};

export function OwnerSidebar({ user }: OwnerSidebarProps) {
    const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);
    const canShowSideNav = useMediaQuery(`(max-width: 768px)`);
    const pathname = usePathname();

    const navLinks = [
        {
            Icon: HouseSimple,
            label: 'Tableau de bord',
            href: '/owner'
        },
        {
            Icon: User,
            label: 'Paramètres du compte',
            href: '/owner/settings'
        }
    ];

    return (
        <>
            <Button
                square
                aria-label="Ouvrir le menu"
                onClick={() => setIsSideNavOpen(true)}
                renderLeadingIcon={cls => (
                    <List className={cls} weight={`bold`} />
                )}
            />

            <SideNav
                isOpen={canShowSideNav && isSideNavOpen}
                onClose={() => setIsSideNavOpen(false)}>
                <div className="flex h-full flex-col gap-4">
                    <div className="flex items-start gap-4 px-4">
                        <Avatar
                            className="!h-32 !w-32 !rounded-3xl bg-secondary"
                            imgClassName="!rounded-3xl"
                            name={`${user?.firstName} ${user?.lastName}`}
                            // TODO : default user profile
                            src={user.avartarURL}
                        />

                        <div className="flex flex-col gap-2 py-10">
                            <h2 className="text-lg font-bold">
                                {user?.firstName} {user?.lastName}
                            </h2>
                            <h3 className="text-gray">{user?.email}</h3>
                        </div>
                    </div>

                    <div className="flex h-full flex-col justify-between">
                        <ul className="flex flex-col">
                            {navLinks.map(({ href, Icon, label }) => (
                                <li
                                    key={href}
                                    className={clsx(
                                        'relative flex items-center',
                                        'gap-2 px-4 py-3 font-semibold',
                                        {
                                            'bg-lightgray':
                                                !!pathname?.startsWith(href)
                                        }
                                    )}>
                                    <Icon
                                        className="h-8 text-secondary"
                                        weight="bold"
                                    />
                                    <NextLink
                                        onClick={() => setIsSideNavOpen(false)}
                                        href={href}
                                        className="after:absolute after:inset-0">
                                        {label}
                                    </NextLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </SideNav>
        </>
    );
}
