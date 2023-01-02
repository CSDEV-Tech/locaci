// components
import { ArrowLeftIcon } from '@locaci/ui/components/atoms/icons/arrow-left';
import { PropertyPresentationCard } from '@locaci/ui/components/molecules/property-presentation-card';
import { NextLinkButton } from '~/features/shared/components/next-link';

// utils
import { notFound } from 'next/navigation';
import { use } from 'react';
import {
    getPropertyDetail,
    getUserCached
} from '~/server/trpc/rsc/cached-queries';
import { clsx } from '@locaci/ui/lib/functions';
import { rsc } from '~/server/trpc/rsc';

// types
import type { PageProps } from '~/types';
import { getPropertyTitle } from '~/utils/functions';
import { ListingImage } from '~/features/shared/types';
import Image from 'next/image';
import { BookPropertyForm } from '~/features/book/components/book-property-form';

export default function BookingPage({ params }: PageProps<{ uid: string }>) {
    const property = use(getPropertyDetail(params.uid));

    if (!property) {
        notFound();
    }

    const user = use(getUserCached());
    let hasAlreadyBooked = false;

    if (user) {
        hasAlreadyBooked = use(
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
                ) : hasAlreadyBooked ? (
                    <>
                        <div className="flex flex-col items-center gap-8 pt-24">
                            <img
                                src="/forbidden_illustration.svg"
                                alt="Image de succès"
                                className="h-[165px] w-[240px] text-primary-15"
                            />

                            <h1 className="text-center text-2xl font-extrabold">
                                Vous avez déjà réservé ce logement
                            </h1>

                            <p className="text-center text-gray">
                                Nous avons déjà envoyé un message&nbsp;
                                <strong>Whatsapp</strong> au bailleur, il vous
                                reviendra au plut tôt.
                            </p>

                            <NextLinkButton
                                href={`/properties/${params.uid}`}
                                variant="primary">
                                <ArrowLeftIcon className={`h-4 w-4`} />
                                <span>Retournez à l'écran précédent</span>
                            </NextLinkButton>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-4 pt-6 md:m-auto md:w-[600px]">
                        <BookPropertyForm
                            availableFrom={property.availableFrom}
                            propertyUid={property.id}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            phoneNumber={user.phoneNumber}
                            initialHeader={
                                <>
                                    <h1 className="text-center text-xl font-extrabold">
                                        Réserver ce logement pour une prochaine
                                        visite
                                    </h1>

                                    <p className="text-center text-gray">
                                        Remplissez le formulaire, nous nous
                                        chargeons d'informer le propriétaire.
                                    </p>

                                    <PropertyPresentationCard
                                        className="h-full w-full"
                                        title={getPropertyTitle(property)}
                                        address={property.localityName}
                                        // @ts-ignore
                                        customImage={Image}
                                        numberOfRooms={property.noOfRooms}
                                        surfaceArea={property.surfaceArea}
                                        price={property.housingFee}
                                        housingPeriod={property.housingPeriod}
                                        coverURL={
                                            property.images
                                                ? (
                                                      property.images as Array<ListingImage>
                                                  )[0]?.uri
                                                : ''
                                        }
                                    />
                                </>
                            }
                        />
                    </div>
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
