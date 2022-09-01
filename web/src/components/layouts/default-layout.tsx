import * as React from 'react';
// components
import Head from 'next/head';
import { NextLink, NextLinkButton } from '../next-link';
import { Avatar, clsx, Footer, Header, SearchButton } from '@locaci/ui';
// for react-hot-toast to work
import { Toaster } from 'react-hot-toast';

// functions & others
import { t } from 'web/src/utils/trpc-rq-hooks';
import { env } from 'web/src/env/client.mjs';

// types
import type { SeoData } from 'web/src/types';
import type { ToastPosition } from 'react-hot-toast';

export type DefaultLayoutProps = {
    children: React.ReactNode;
    headerLeadingElement?: React.ReactNode;
    headerTrailingElement?: React.ReactNode;
    hideFooter?: boolean;
    className?: string;
    toastDirection?: ToastPosition;
} & SeoData;

export function DefaultLayout({
    children,
    hideFooter = false,
    ...props
}: DefaultLayoutProps) {
    const title =
        props.title ?? 'Trouvez votre prochain Logement en quelques clics';
    const description =
        props.description ??
        "Découvrez le premier logiciel de gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.";

    return (
        <>
            <Head key={'document-head'}>
                <title>{title} | LOCACI</title>
                <meta name="description" content={description} />
                <link rel="icon" href="/favicon.svg" />
                <meta name="title" content={`${title} | LOCACI`} />

                {/*Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={env.NEXT_PUBLIC_SITE_URL} />
                <meta property="og:title" content={`${title} | LOCACI`} />
                <meta property="og:description" content={description} />
                <meta
                    property="og:image"
                    content={`${env.NEXT_PUBLIC_SITE_URL}/logo.svg`}
                />

                {/* Twitter */}
                <meta
                    property="twitter:url"
                    content={env.NEXT_PUBLIC_SITE_URL}
                />
                <meta name="twitter:card" content="summary" />
                <meta property="twitter:title" content={`${title} | LOCACI`} />
                <meta property="twitter:description" content={description} />

                {/* TODO : update */}
                <meta
                    name="twitter:image"
                    content={`${env.NEXT_PUBLIC_SITE_URL}/logo.svg`}
                />

                {/* OpenGraph */}
                <meta
                    prefix="og: http://ogp.me/ns#"
                    property="og:type"
                    content="website"
                />
                <meta
                    prefix="og: http://ogp.me/ns#"
                    property="og:title"
                    content="LOCACI | Logiciel de gestion locaci"
                />
                <meta
                    prefix="og: http://ogp.me/ns#"
                    property="og:description"
                    content={description}
                />
                <meta
                    prefix="og: http://ogp.me/ns#"
                    property="og:image"
                    content={`${env.NEXT_PUBLIC_SITE_URL}/logo.svg`}
                />
                <meta
                    prefix="og: http://ogp.me/ns#"
                    property="og:url"
                    content={env.NEXT_PUBLIC_SITE_URL}
                />
            </Head>

            <Header
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                leadingElement={
                    props.headerLeadingElement ?? (
                        <DefaultHeaderLeadingElement />
                    )
                }
                trailingElement={
                    props.headerTrailingElement ?? (
                        <DefaultHeaderTrailingElement />
                    )
                }
            />
            <main className={clsx(props.className, 'h-full')}>{children}</main>

            {!hideFooter && (
                <Footer
                    className="stiky bottom-0"
                    customLink={NextLink}
                    // TODO : Links
                    links={[]}
                />
            )}

            <Toaster position={props.toastDirection} />
        </>
    );
}

function DefaultHeaderLeadingElement() {
    return (
        <SearchButton className="lg:hidden" onClick={() => {}}>
            Rechercher un logement
        </SearchButton>
    );
}

function DefaultHeaderTrailingElement() {
    const { data: user } = t.proxy.auth.getUser.useQuery();

    return user ? (
        <NextLinkButton href="/profile" className="gap-4">
            <span className="font-semibold">Hello</span>
            <Avatar
                name={`${user.firstName} ${user.lastName}`}
                // TODO : Use user's image
                src="https://i.pravatar.cc/300"
            />
        </NextLinkButton>
    ) : (
        <>
            <NextLinkButton href="/login" variant="hollow">
                Connexion
            </NextLinkButton>
        </>
    );
}
