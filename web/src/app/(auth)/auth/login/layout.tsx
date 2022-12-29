// components
import { Header } from '@locaci/ui/components/organisms/header';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';

// utils
import { clsx } from '@locaci/ui/lib/functions';

// types
import type { LayoutProps } from '~/types';

export default async function LoginLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen">
            <Header
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                trailingElement={
                    <>
                        <NextLinkButton
                            href="/auth/request-access"
                            variant="hollow"
                            className="whitespace-nowrap">
                            Vous êtes un bailleur ?
                        </NextLinkButton>
                    </>
                }
            />

            <main className={'h-full'}>{children}</main>

            <section
                className={clsx(
                    'fixed bottom-0 right-0 z-[-1] hidden',
                    'md:flex md:items-end md:justify-end'
                )}>
                <img
                    src="/empty_street.svg"
                    alt="Maison vide"
                    className={clsx(
                        'w-52 object-contain object-center',
                        'lg:w-64',
                        'xl:w-72'
                    )}
                />
            </section>
        </div>
    );
}
