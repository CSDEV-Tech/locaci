import * as React from 'react';

// components
import { Progress } from '@locaci/ui';
import { OwnerLayout } from '@web/features/shared';
import {
    Form6Values,
    FormStep1,
    FormStep2,
    FormStep3,
    FormStep4,
    FormStep5,
    FormStep6
} from '@web/features/create-property';

// utils
import { clsx } from '@locaci/ui';

// types
import type { NextPageWithLayout } from '@web/pages/_app';
import type {
    Form1Values,
    Form2Values,
    Form4Values,
    Form5Values
} from '@web/features/create-property';

export type CreatePropertyProps = {};

const CreatePropertyPage: NextPageWithLayout<CreatePropertyProps> = () => {
    const [step, setStep] = React.useState(1);

    const [formValues, setFormValues] = React.useState<
        Partial<
            Form1Values &
                Form2Values &
                Form5Values &
                Form6Values &
                Form4Values & {
                    localityQuery: string;
                    municipalityQuery: string;
                }
        >
    >({});

    function goToPrevious() {
        setStep(prev => prev - 1);
    }
    function goToNext() {
        setStep(prev => prev + 1);
    }

    return (
        <section className="relative flex h-full items-center justify-center">
            <Progress
                value={(step / 6) * 100}
                min={0}
                max={100}
                className="!absolute top-0 left-0 right-0"
                variant="secondary"
            />
            <div
                className={clsx(
                    'flex h-full w-full flex-col',
                    'gap-14 pt-20 pb-10',
                    'md:m-auto md:h-auto md:w-[450px]'
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
                        onSubmit={goToNext}
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
                            // goToNext();
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
