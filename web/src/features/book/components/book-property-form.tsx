'use client';
import * as React from 'react';
// components
import { Controller } from 'react-hook-form';
import { Button } from '@locaci/ui/components/atoms/button';
import { TextInput } from '@locaci/ui/components/atoms/input';
import { NextLinkButton } from '~/features/shared/components/next-link';
import { ArrowRightIcon } from '@locaci/ui/components/atoms/icons/arrow-right';
import { CalendarInput } from '@locaci/ui/components/molecules/calendar-input';
import Image from 'next/image';

// utils
import { t } from '~/app/trpc-client-provider';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { bookPropertySchema } from '~/lib/validation-schemas/booking-schema';
import { PropertyPresentationCard } from '@locaci/ui/components/molecules/property-presentation-card';
import { getPropertyTitle } from '~/lib/functions';
import { ListingImage } from '~/features/shared/types';
import { ArrowLeftIcon } from '@locaci/ui/components/atoms/icons/arrow-left';

// types
export type BookPropertyFormProps = {
    propertyUid: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
};

export function BookPropertyForm({
    propertyUid,
    lastName,
    firstName,
    phoneNumber
}: BookPropertyFormProps) {
    const utils = t.useContext();
    const { data: property } = t.property.getPropertyDetail.useQuery(
        {
            uid: propertyUid
        },
        {
            staleTime: Infinity
        }
    );

    const { data: hasAlreadyBooked } =
        t.property.checkIfPropertyIsBooked.useQuery(
            {
                propertyId: property!.id
            },
            {
                enabled: Boolean(property)
            }
        );

    const today = new Date();
    let minDateReservation = new Date(property!.availableFrom);
    let defaultBookingDate = minDateReservation;
    if (today >= minDateReservation) {
        defaultBookingDate = today;
        defaultBookingDate.setDate(defaultBookingDate.getDate() + 1); // add +1 day
        minDateReservation = today;
    } else {
        defaultBookingDate = minDateReservation;
    }

    const form = useZodForm({
        schema: bookPropertySchema,
        defaultValues: {
            uid: property!.id,
            lastName: lastName ?? '',
            firstName: firstName ?? '',
            phoneNumber: phoneNumber ?? '',
            bookingDate: defaultBookingDate
        }
    });

    // calculate the number of bedrooms
    const noOfBedRooms = property!.rooms.filter(
        r => r.type === 'BEDROOM'
    ).length;

    const bookingMutation = t.property.bookProperty.useMutation({
        onSuccess() {
            utils.property.checkIfPropertyIsBooked.invalidate();
        }
    });

    return bookingMutation.isSuccess ? (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
            <img
                src="/success_illustration.svg"
                alt="Image de succès"
                className="h-[165px] w-[240px]"
            />

            <h2 className="text-2xl font-extrabold">Succès</h2>
            <section
                aria-live="assertive"
                className="flex flex-col gap-4 text-center text-dark">
                <p>
                    Nous avons envoyé votre demande de réservation pour une
                    visite&nbsp;
                    <strong className="font-semibold">
                        {new Intl.DateTimeFormat('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }).format(bookingMutation.data.reservationDate)}
                    </strong>
                    . Ce bailleur vous contacteras au plus tôt.
                </p>
            </section>

            <NextLinkButton
                variant="primary"
                href="/profile"
                renderTrailingIcon={cls => <ArrowRightIcon className={cls} />}>
                Voir vos réservations en cours
            </NextLinkButton>
        </div>
    ) : hasAlreadyBooked?.existing ? (
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
                <strong>Whatsapp</strong> au bailleur, il vous reviendra au plut
                tôt.
            </p>

            <NextLinkButton
                href={`/properties/${propertyUid}`}
                variant="primary">
                <ArrowLeftIcon className={`h-4 w-4`} />
                <span>Retournez à l'écran précédent</span>
            </NextLinkButton>
        </div>
    ) : (
        <div className="flex flex-col gap-4 pt-6 md:m-auto md:w-[600px]">
            <h1 className="text-center text-xl font-extrabold md:text-2xl">
                Réserver ce logement pour une prochaine visite
            </h1>

            <p className="text-center text-gray">
                Remplissez le formulaire, nous nous chargeons d'informer le
                propriétaire.
            </p>

            <PropertyPresentationCard
                className="h-full w-full"
                title={getPropertyTitle(property!)}
                address={property!.localityName}
                // @ts-ignore
                customImage={Image}
                numberOfRooms={property!.noOfRooms}
                surfaceArea={property!.surfaceArea}
                numberOfBedRooms={noOfBedRooms}
                price={property!.housingFee}
                housingPeriod={property!.housingPeriod}
                coverURL={
                    property!.images
                        ? (property!.images as Array<ListingImage>)[0]?.uri
                        : ''
                }
            />

            <span className="text-gray">Détails</span>
            <form
                className="flex w-full flex-col gap-4"
                onSubmit={form.handleSubmit(variables =>
                    bookingMutation.mutate(variables)
                )}>
                <TextInput
                    label="nom"
                    required
                    {...form.register('lastName')}
                    errorText={form.formState.errors.lastName?.message}
                />
                <TextInput
                    label="prenom"
                    required
                    {...form.register('firstName')}
                    errorText={form.formState.errors.firstName?.message}
                />
                <TextInput
                    label="téléphone"
                    required
                    {...form.register('phoneNumber')}
                    helpText={`
                    Nous utilisons ce numéro pour vous mettre en contact avec le bailleur, 
                    afin d'assurer la sécurité de nos bailleurs ainsi que votre sécurité contre les appels frauduleux.
                    `}
                    errorText={form.formState.errors.phoneNumber?.message}
                />

                <Controller
                    name="bookingDate"
                    control={form.control}
                    render={({
                        field: { ref, ...field },
                        formState: { errors }
                    }) => (
                        <CalendarInput
                            label={`Date de votre visite`}
                            minValue={minDateReservation}
                            {...field}
                            required
                            errorText={errors.bookingDate?.message}
                            helpText={`
                            Précisez la date souhaitée de votre visite, à partir de la date à laquelle le logement sera disponible.
                            Vous pourrez toujours en discuter avec le bailleur. 
                            `}
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="primary"
                    loading={bookingMutation.isLoading}>
                    {bookingMutation.isLoading
                        ? `Réservation en cours`
                        : `Réserver`}
                </Button>
            </form>
        </div>
    );
}
