import * as React from 'react';

// components
import { Avatar, Button, clsx, LoadingIndicator, SideNav } from '@locaci/ui';
import { DefaultLayout } from './default-layout';
import { Door, HouseSimple, List, PlusCircle, User } from 'phosphor-react';
import { NextBreadcrumb } from '../next-breadcrumb';
import { NextLink } from '../next-link';

// utils & others
import { t } from 'web/src/utils/trpc-rq-hooks';
import { useAuthCheck } from 'web/src/hooks/use-auth-check';
import { useMediaQuery } from 'web/src/hooks/use-media-query';
import { useRouter } from 'next/router';

// types
import type { DefaultLayoutProps } from './default-layout';
import type { BreadcrumbItem } from '@locaci/ui';
import { AddListingModal, useListingModalStore } from '../add-listing-modal';

export type OwnerLayoutProps = {
    children: React.ReactNode;
    title: string;
    breadcrumbItems: BreadcrumbItem[];
} & DefaultLayoutProps;

export function OwnerLayout({
    children,
    title,
    breadcrumbItems
}: OwnerLayoutProps) {
    const { isLoading } = useAuthCheck();

    const showModal = useListingModalStore(state => state.show);

    return isLoading ? (
        <section className="flex h-screen w-screen items-center justify-center">
            <h1 className="flex items-center gap-4 text-4xl">
                <LoadingIndicator className="h-10" /> <span>CHARGEMENT...</span>
            </h1>
        </section>
    ) : (
        <DefaultLayout
            hideLogo
            hideHeader={isLoading}
            headerLeadingElement={
                <LeadingElement title={title} links={breadcrumbItems} />
            }
            headerTrailingElement={
                <Button
                    onClick={showModal}
                    variant="secondary"
                    aria-label="Ajouter une annonce"
                    renderLeadingIcon={cls => (
                        <PlusCircle className={clsx(cls)} weight={`bold`} />
                    )}
                />
            }
            hideFooter>
            {children}

            <AddListingModal />
        </DefaultLayout>
    );
}

export function LeadingElement(props: {
    title: string;
    links: BreadcrumbItem[];
}) {
    const { data: user } = t.proxy.auth.getAuthenticatedUser.useQuery();
    const [isSideNavOpen, setIsSideNavOpen] = React.useState(false);

    const canShowSideNav = useMediaQuery(`(max-width: 768px)`);
    const router = useRouter();

    console.log({
        path: router.asPath
    });

    const navLinks = [
        {
            Icon: HouseSimple,
            label: 'Tableau de bord',
            href: '/owner/dashboard'
        },
        {
            Icon: Door,
            label: 'Vos propriétés',
            href: '/owner/properties'
        },
        {
            Icon: List,
            label: 'Vos annonces',
            href: '/owner/listings'
        }
    ];

    return (
        <div className="flex items-center gap-2">
            <Button
                square
                aria-label="menu"
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
                            className="!h-32 !w-32 !rounded-3xl bg-lightgray"
                            imgClassName="!rounded-3xl"
                            name={`${user?.firstName} ${user?.lastName}`}
                            // TODO : Use user's image
                            src="https://i.pravatar.cc/300"
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
                                                router.asPath.startsWith(href)
                                        }
                                    )}>
                                    <Icon
                                        className="h-8 text-secondary"
                                        weight="bold"
                                    />
                                    <NextLink
                                        href={href}
                                        className="after:absolute after:inset-0">
                                        {label}
                                    </NextLink>
                                </li>
                            ))}
                        </ul>
                        <div
                            className={clsx(
                                'relative flex items-center',
                                'gap-2 px-4 py-3 font-semibold',
                                'justify-self-end',
                                {
                                    'bg-lightgray':
                                        router.asPath === '/profile-settings'
                                }
                            )}>
                            <User
                                className="h-8 text-secondary"
                                weight="fill"
                            />
                            <NextLink
                                href="/owner"
                                className="after:absolute after:inset-0">
                                Paramètres du compte
                            </NextLink>
                        </div>
                    </div>
                </div>
            </SideNav>

            <NextBreadcrumb links={props.links} />
        </div>
    );
}
