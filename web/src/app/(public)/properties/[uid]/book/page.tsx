// components
import { ArrowLeftIcon } from '@locaci/ui/components/atoms/icons/arrow-left';
import { NextLinkButton } from '~/features/shared/components/next-link';
import { BookPropertyForm } from '~/features/book/components/book-property-form';
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';

// utils
import { notFound } from 'next/navigation';
import { use } from 'react';
import {
    getPropertyDetail,
    getUserCached
} from '~/server/trpc/rsc/cached-queries';
import { clsx } from '@locaci/ui/lib/functions';
import { rsc } from '~/server/trpc/rsc';
import { capitalize, getPropertyTitle } from '~/lib/functions';

// types
import type { MetadataParams, PageProps } from '~/next-app-types';
import { Metadata } from 'next';
import { env } from '~/env/server.mjs';

// this is a dynamic page
export const dynamic = 'force-dynamic';

export async function generateMetadata({
    params
}: MetadataParams<{ uid: string }>): Promise<Metadata> {
    const property = await getPropertyDetail(params.uid);

    let title = 'Erreur 404';

    if (property) {
        const type = getPropertyTitle({
            noOfRooms: property.noOfRooms,
            rentType: property.rentType
        });

        const commune = capitalize(property.municipality.name);

        title = `Effectuer une visite pour un ${type} à ${commune}`;
    }
    return {
        title,
        openGraph: {
            title
        },
        twitter: {
            title
        },
        metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
        alternates: {
            canonical: `/properties/${params.uid}/book`
        }
    };
}

export default function BookingPage({ params }: PageProps<{ uid: string }>) {
    const property = use(getPropertyDetail(params.uid));

    if (!property) {
        notFound();
    }

    const user = use(getUserCached());

    if (user) {
        // eagerly check if the user can check the property, so that in client it is already loaded
        use(
            rsc.property.checkIfPropertyIsBooked
                .fetch({
                    propertyId: property.id
                })
                .then(r => r.existing)
        );
    }

    // the url to redirect back if the user is not connected
    const loginRedirectSearchParams = new URLSearchParams();
    loginRedirectSearchParams.append('force_login', 'true');
    loginRedirectSearchParams.append(
        'redirect_to',
        `/properties/${params.uid}/book`
    );

    return (
        <>
            <section className={clsx('relative w-full px-4 pb-24', 'md:px-8')}>
                {!user ? (
                    <div className="flex flex-col items-center gap-8 pt-24">
                        <img
                            src="/secure_login_illustration.svg"
                            alt="Illustration d'empreinte digitale"
                            className="h-[165px] w-[240px]"
                        />

                        <h1 className="text-center text-2xl font-extrabold">
                            Connectez-vous pour pouvoir réserver ce logement
                        </h1>
                        <section
                            aria-live="assertive"
                            className="flex flex-col gap-4 text-left text-gray">
                            <p>Veuillez-vous connecter pour continuer</p>
                        </section>

                        <NextLinkButton
                            href={`/auth/login?${loginRedirectSearchParams.toString()}`}
                            variant="primary">
                            Connectez-vous
                        </NextLinkButton>
                    </div>
                ) : user.id === property?.userId ? (
                    <div className="flex flex-col items-center gap-8 pt-24">
                        <img
                            src="/forbidden_illustration.svg"
                            alt="Image de succès"
                            className="h-[165px] w-[240px] text-primary-15"
                        />

                        <h1 className="text-center text-2xl font-extrabold">
                            Vous ne pouvez pas réserver votre propre logement
                        </h1>

                        <NextLinkButton
                            href={`/properties/${params.uid}`}
                            variant="primary">
                            <ArrowLeftIcon className={`h-4 w-4`} />
                            <span>Retournez à l'écran précédent</span>
                        </NextLinkButton>
                    </div>
                ) : (
                    <>
                        <HydrateClient state={use(rsc.dehydrate())}>
                            <BookPropertyForm
                                propertyUid={params.uid}
                                firstName={user.firstName}
                                lastName={user.lastName}
                                phoneNumber={user.phoneNumber}
                            />
                        </HydrateClient>
                    </>
                )}

                <div
                    className={clsx(
                        'absolute bottom-0 right-0 z-[-1] hidden',
                        'md:flex md:items-end md:justify-end'
                    )}>
                    <img
                        src="/empty_street.svg"
                        alt="Maison vide"
                        width={400}
                        height={300}
                        loading={`lazy`}
                        className={clsx(
                            'w-52 object-contain object-center',
                            'lg:w-64',
                            'xl:w-72'
                        )}
                    />
                </div>
            </section>
        </>
    );
}
