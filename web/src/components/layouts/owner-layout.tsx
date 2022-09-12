import * as React from 'react';

// components
import { Avatar, Button, clsx, LoadingIndicator, SideNav } from '@locaci/ui';
import { DefaultLayout, DefaultLayoutProps } from './default-layout';
import { House, List, PlusCircle } from 'phosphor-react';
import { NextBreadcrumb } from '../next-breadcrumb';
import { NextLinkButton } from '../next-link';

// utils & others
import { t } from 'web/src/utils/trpc-rq-hooks';
import { useAuthCheck } from 'web/src/hooks/use-auth-check';
import { useMediaQuery } from 'web/src/hooks/use-media-query';

// types
import type { BreadcrumbItem } from '@locaci/ui';

export type OwnerLayoutProps = {
    children: React.ReactNode;
    title: string;
    links: BreadcrumbItem[];
} & DefaultLayoutProps;

export function OwnerLayout({ children, title, links }: OwnerLayoutProps) {
    const { isLoading } = useAuthCheck();

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
                <LeadingElement title={title} links={links} />
            }
            headerTrailingElement={
                <NextLinkButton
                    href="/owner/add"
                    aria-label="Ajouter une annonce"
                    renderLeadingIcon={cls => (
                        <PlusCircle
                            className={clsx(cls, 'text-gray')}
                            weight={`fill`}
                        />
                    )}
                />
            }
            hideFooter>
            {children}
        </DefaultLayout>
    );
}

export function LeadingElement(props: {
    title: string;
    links: BreadcrumbItem[];
}) {
    const { data: user } = t.proxy.auth.getAuthenticatedUser.useQuery();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const canShowModal = useMediaQuery(`(max-width: 768px)`);

    return (
        <div className="flex items-center gap-2">
            <Button
                square
                aria-label="menu"
                onClick={() => setIsMenuOpen(true)}
                renderLeadingIcon={cls => (
                    <List className={cls} weight={`bold`} />
                )}
            />
            <SideNav
                isOpen={canShowModal && isMenuOpen}
                onClose={() => setIsMenuOpen(false)}>
                <ul className="flex flex-col gap-4">
                    <li className="px-4">
                        <Avatar
                            className="!h-32 !w-32 !rounded-3xl bg-lightgray"
                            imgClassName="!rounded-3xl"
                            name={`${user?.firstName} ${user?.lastName}`}
                            // TODO : Use user's image
                            src="https://i.pravatar.cc/300"
                        />
                    </li>

                    {/* TODO : Current Menu */}
                    <li className="flex items-center gap-2 bg-lightgray px-4 py-3 font-semibold">
                        <House className="h-8 text-secondary" weight="fill" />
                        <span>Tableau de bord</span>
                    </li>
                    {/* TODO : Reste des menus */}
                </ul>
            </SideNav>

            <NextBreadcrumb links={props.links} />
        </div>
    );
}
