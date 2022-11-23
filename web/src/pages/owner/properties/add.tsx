import * as React from 'react';

// components
import { Button, LoadingIndicator, Progress } from '@locaci/ui';
import { OwnerLayout } from '~/features/shared/components/layouts/owner-layout';
import {
    FormStep1,
    FormStep2,
    FormStep3,
    FormStep4,
    FormStep5,
    FormStep6,
    FormStep7
} from '~/features/create-property';
import {
    ArrowCounterClockwise,
    ArrowLeft,
    CaretDoubleLeft
} from 'phosphor-react';
import {
    NextLinkButton,
    NextLink
} from '~/features/shared/components/next-link';

// utils
import { clsx } from '@locaci/ui';
import { createPropertyRequestSchema } from '~/server/trpc/validation/property-schema';
import { t } from '~/utils/trpc-rq-hooks';

// types
import type { z } from 'zod';
import type { NextPageWithLayout } from '~/pages/_app';
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '~/server/trpc/router';

export type CreatePropertyProps = {};

type CreatePropertyInput = z.TypeOf<typeof createPropertyRequestSchema>;

const CreatePropertyPage: NextPageWithLayout<CreatePropertyProps> = () => {
    const [step, setStep] = React.useState(1);

    const [formValues, setFormValues] = React.useState<
        Partial<
            CreatePropertyInput & {
                localityQuery: string;
                municipalityQuery: string;
            }
        >
    >({
        rentType: 'LOCATION'
    });

    function goToPrevious() {
        setStep(prev => prev - 1);
    }
    function goToNext() {
        setStep(prev => prev + 1);
    }

    const utils = t.useContext();

    // Mutation Result
    const [createdProperty, setCreatedProperty] =
        React.useState<
            inferProcedureOutput<AppRouter['owner']['property']['create']>
        >();
    const [createdPropertyError, setCreatedPropertyError] =
        React.useState<string>();
    const createPropertyMutation = t.owner.property.create.useMutation({
        onSuccess(result) {
            setCreatedProperty(result);
            utils.owner.property.getAll.invalidate();
        },
        onError(error) {
            setCreatedPropertyError(error.message);
        }
    });

    return (
        <section className="relative flex h-full items-center justify-center">
            <Progress
                value={(step / 8) * 100}
                min={0}
                max={100}
                className="!absolute top-0 left-0 right-0"
                variant="secondary"
            />
            <div
                className={clsx(
                    'flex h-full w-full flex-col',
                    'gap-14 pt-20 pb-10',
                    'md:m-auto md:h-auto'
                )}>
                {step === 1 && (
                    <FormStep1
                        defaultValues={formValues}
                        onSubmit={values => {
                            setFormValues(old => {
                                // should not pass amenities in if the rentType is not a short term
                                return {
                                    ...old,
                                    ...values,
                                    amenities:
                                        values.rentType !== 'SHORT_TERM'
                                            ? []
                                            : old.amenities ?? []
                                };
                            });
                            goToNext();
                        }}
                    />
                )}

                {step === 2 && (
                    <FormStep2
                        defaultValues={formValues}
                        onSubmit={values => {
                            setFormValues(old => ({ ...old, ...values }));
                            goToNext();

                            console.log({
                                formValues: {
                                    ...formValues,
                                    ...values
                                }
                            });
                        }}
                        onPreviousClick={goToPrevious}
                    />
                )}

                {step === 3 && (
                    <FormStep3
                        defaultValues={formValues}
                        onSubmit={values => {
                            setFormValues(old => ({ ...old, ...values }));
                            goToNext();
                        }}
                        onPreviousClick={goToPrevious}
                    />
                )}

                {step === 4 && (
                    <FormStep4
                        defaultValues={formValues}
                        onSubmit={values => {
                            setFormValues(old => ({ ...old, ...values }));
                            goToNext();
                            console.log({
                                formValues: {
                                    ...formValues,
                                    ...values
                                }
                            });
                        }}
                        onPreviousClick={goToPrevious}
                    />
                )}

                {step === 5 && (
                    <FormStep5
                        defaultValues={formValues}
                        onSubmit={values => {
                            setFormValues(old => ({ ...old, ...values }));
                            goToNext();

                            // only go to step 6 if rentType is "short term"
                            if (formValues.rentType !== 'SHORT_TERM') {
                                goToNext();
                            }

                            console.log({
                                formValues: {
                                    ...formValues,
                                    ...values
                                }
                            });
                        }}
                        onPreviousClick={goToPrevious}
                    />
                )}

                {step === 6 && (
                    <FormStep6
                        defaultValues={formValues}
                        onSubmit={values => {
                            setFormValues(old => ({ ...old, ...values }));
                            goToNext();
                            console.log({
                                formValues: {
                                    ...formValues,
                                    ...values
                                }
                            });
                        }}
                        onPreviousClick={goToPrevious}
                    />
                )}

                {step === 7 && (
                    <FormStep7
                        defaultValues={formValues}
                        onSubmit={values => {
                            setFormValues(old => ({ ...old, ...values }));
                            goToNext();
                            console.log({
                                formValues: {
                                    ...formValues,
                                    ...values
                                }
                            });

                            const input = {
                                ...formValues,
                                ...values
                            } as CreatePropertyInput;
                            createPropertyMutation.mutate(input);
                        }}
                        onPreviousClick={() => {
                            goToPrevious();
                            // only go to step 6 if rentType is "short term"
                            if (formValues.rentType !== 'SHORT_TERM') {
                                goToPrevious();
                            }
                        }}
                    />
                )}

                {step === 8 && (
                    <div
                        className={`flex flex-col items-center gap-14 px-6 pt-24`}>
                        {createPropertyMutation.isLoading ? (
                            <div className={`pt-48 md:m-auto md:w-[450px]`}>
                                <div className="flex items-center gap-4">
                                    <LoadingIndicator className={`h-14 w-14`} />
                                    <span
                                        className={`text-center text-2xl font-semibold`}>
                                        Création de votre propriété
                                    </span>
                                </div>
                            </div>
                        ) : createPropertyMutation.isSuccess ? (
                            <>
                                <div
                                    className={`flex flex-col items-center gap-6 md:m-auto md:w-[450px]`}>
                                    <img
                                        src="/success_illustration.svg"
                                        alt="Image de succès"
                                        className="h-[165px] w-[240px]"
                                    />

                                    <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                                        Votre logement a été créé
                                    </h1>

                                    <h2 className="text-center text-lg text-gray">
                                        Vous pouvez dès à présent y ajouter des
                                        annonces pour accueuillir vos clients
                                    </h2>
                                </div>

                                <NextLinkButton
                                    href={`/owner/properties/${
                                        createdProperty!.id
                                    }/listings/add`}
                                    variant={`secondary`}>
                                    Créer votre première annonce
                                </NextLinkButton>
                            </>
                        ) : (
                            <>
                                <div
                                    className={`flex flex-col items-center gap-6 md:m-auto md:w-[450px]`}>
                                    <img
                                        src="/error_illustration.svg"
                                        alt="Image d'erreur"
                                        className="h-[165px] w-[240px]"
                                    />

                                    <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                                        Une erreur est survenue !
                                    </h1>

                                    <em className="max-w-full overflow-scroll rounded-md border border-danger bg-danger-15 p-4 text-danger">
                                        {createdPropertyError}
                                    </em>

                                    <h2 className="text-center text-lg text-gray">
                                        Veuillez <strong>Recommencer</strong> ou
                                        modifier les informations de votre
                                        logement en cliquant sur&nbsp;
                                        <strong>Précédant</strong>
                                    </h2>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        type="button"
                                        variant="hollow"
                                        className="w-full"
                                        onClick={goToPrevious}
                                        renderLeadingIcon={cls => (
                                            <CaretDoubleLeft className={cls} />
                                        )}>
                                        Précédant
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => {
                                            createPropertyMutation.mutate(
                                                formValues as CreatePropertyInput
                                            );
                                        }}
                                        renderTrailingIcon={cls => (
                                            <ArrowCounterClockwise
                                                className={cls}
                                            />
                                        )}>
                                        Recommencer
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {step !== 8 && (
                    <NextLink
                        href="/owner/properties"
                        className="mx-4 flex items-center gap-3 self-center underline">
                        <ArrowLeft className={'h-4'} />
                        <span>Enregistrer et revenir plus tard</span>
                    </NextLink>
                )}
            </div>
        </section>
    );
};

export default CreatePropertyPage;
CreatePropertyPage.getLayout = function (page) {
    return (
        <OwnerLayout
            title="Ajouter une nouvelle propriété"
            breadcrumbItems={[
                {
                    href: `/owner`,
                    label: `Tableau de bord`
                },
                {
                    href: `/owner/properties`,
                    label: `Propriétés`
                },
                {
                    href: `/owner/properties/add`,
                    label: `Ajouter`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};
