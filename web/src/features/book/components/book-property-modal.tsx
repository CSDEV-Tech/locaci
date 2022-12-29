import * as React from 'react';
// components
import { ResponsiveModal } from '~/features/shared/components/responsive-modal';

// utils
import { t } from '~/app/trpc-client-provider';
import { NextLinkButton } from '~/features/shared/components/next-link';
import { Button } from '@locaci/ui/components/atoms/button';
import { CalendarInput } from '@locaci/ui/components/molecules/calendar-input';
import { TextInput } from '@locaci/ui/components/atoms/input';
import { useZodForm } from '~/features/shared/hooks/use-zod-form';
import { bookPropertySchema } from '~/validation/booking-schema';
import { Controller } from 'react-hook-form';

export type BookPropertyModalProps = {
    open: boolean;
    onClose: () => void;
    propertyUid: string;
};

export function BookPropertyModal({
    onClose,
    open,
    propertyUid
}: BookPropertyModalProps) {
    const { data: property } = t.property.getPropertyDetail.useQuery(
        {
            uid: propertyUid
        },
        {
            staleTime: Infinity
        }
    );

    const { data: user } = t.auth.getUser.useQuery(undefined, {
        staleTime: Infinity
    });

    const loginSearchParams = new URLSearchParams();
    loginSearchParams.append('force_login', 'true');
    loginSearchParams.append(
        'redirect_to',
        `/properties/${propertyUid}?booking_modal_open=true`
    );

    return (
        <ResponsiveModal
            title="Réservation"
            isOpen={open}
            onClose={onClose}
            minHeightRatio={0.7}
            maxHeightRatio={0.8}>
            <div className="flex h-full flex-col items-center justify-center gap-6 px-6 py-10">
                {!user ? (
                    <>
                        <img
                            src="/secure_login_illustration.svg"
                            alt="Illustration d'empreinte digitale"
                            className="h-[165px] w-[240px]"
                        />

                        <h2 className="text-2xl font-extrabold">
                            Connectez-vous pour pouvoir réserver ce logement
                        </h2>
                        <section
                            aria-live="assertive"
                            className="flex flex-col gap-4 text-left text-gray">
                            <p>Veuillez-vous connecter pour continuer</p>
                        </section>

                        <NextLinkButton
                            href={`/auth/login?${loginSearchParams.toString()}`}
                            variant="primary">
                            Connectez-vous
                        </NextLinkButton>
                    </>
                ) : user.id === property?.userId ? (
                    <>
                        <img
                            src="/forbidden_illustration.svg"
                            alt="Image de succès"
                            className="h-[165px] w-[240px] text-primary-15"
                        />

                        <h2 className="text-2xl font-extrabold">
                            Vous ne pouvez pas réserver votre propre logement
                        </h2>

                        <Button onClick={onClose} variant="hollow">
                            Fermer
                        </Button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-extrabold">
                            Réserver ce logement pour votre visite
                        </h2>

                        <section
                            aria-live="assertive"
                            className="flex flex-col gap-4 text-left text-gray">
                            <p>
                                Remplissez le formulaire, nous nous chargeons
                                d'informer le propriétaire.
                            </p>
                        </section>

                        <BookingForm
                            availableFrom={property!.availableFrom}
                            propertyUid={property!.id}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            phoneNumber={user.phoneNumber}
                        />
                    </>
                )}
            </div>
        </ResponsiveModal>
    );
}

function BookingForm({
    availableFrom,
    propertyUid,
    lastName,
    firstName,
    phoneNumber
}: {
    availableFrom: Date;
    propertyUid: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
}) {
    const form = useZodForm({
        schema: bookPropertySchema,
        defaultValues: {
            uid: propertyUid,
            lastName: lastName ?? '',
            firstName: firstName ?? '',
            phoneNumber: phoneNumber ?? ''
        }
    });

    return (
        <form
            className="flex w-full flex-col gap-4 pb-[25rem] md:pb-0"
            onSubmit={form.handleSubmit(variables =>
                console.log({ variables })
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
                helpText="Exemple: +2250148351513, ou 0648351513"
                errorText={form.formState.errors.phoneNumber?.message}
            />

            <Controller
                name="date"
                control={form.control}
                render={({
                    field: { ref, ...field },
                    formState: { errors }
                }) => (
                    <CalendarInput
                        {...field}
                        label={`Date de votre visite`}
                        minValue={availableFrom}
                        errorText={errors.date?.message}
                    />
                )}
            />

            <Button type="submit" variant="primary">
                Réserver
            </Button>
        </form>
    );
}
