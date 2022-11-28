'use client';
import * as React from 'react';

// components
import { Progress } from '@locaci/ui/components/atoms/progress';
import { FormStep1 } from './form-step1';
import { FormStep2 } from './form-step2';
import { FormStep4 } from './form-step4';
import { FormStep5 } from './form-step5';
import { FormStep3 } from './form-step3';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { t } from '~/utils/trpc-rq-hooks';
import {
    updatePropertyStep4Schema,
    updatePropertyStep5Schema,
    updatePropertyStep6Schema
} from '~/validation/property-schema';

// types
import type { z } from 'zod';
import type { PropertyFormStep } from '@prisma/client';
import type { Form2Values } from './form-step2';
import { FormStep6 } from './form-step6';
import { FormStep7 } from './form-step7';

type EditPropertyFormProps = {
    propertyDraftUid: string;
};

export function EditPropertyForm({ propertyDraftUid }: EditPropertyFormProps) {
    const { data: draft } = t.owner.property.getSingleDraft.useQuery(
        {
            uid: propertyDraftUid
        },
        {
            staleTime: Infinity
        }
    );
    const utils = t.useContext();
    // states
    const [step, goTo] = React.useState(getStepNumber(draft?.currentStep));
    const [valuesForm2, setValuesForm2] = React.useState<Partial<Form2Values>>({
        localityUid: draft?.localityId ?? '',
        municipalityUid: draft?.municipalityId ?? '',
        cityUid: draft?.cityId ?? '',
        localityQuery: draft?.localityName ?? '',
        municipalityQuery: draft?.municipalityName ?? ''
    });

    // mutations
    const saveDraftStep1 = t.owner.property.saveDraftStep1.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingleDraft.invalidate();
            goTo(2);
        }
    });

    const saveDraftStep2 = t.owner.property.saveDraftStep2.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingleDraft.invalidate();
            goTo(4);
        }
    });

    const saveDraftStep3 = t.owner.property.saveDraftStep3.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingleDraft.invalidate();
            goTo(5);
        }
    });

    const saveDraftStep4 = t.owner.property.saveDraftStep4.useMutation({
        onSuccess: async data => {
            await utils.owner.property.getSingleDraft.invalidate();

            if (data.rentType === 'SHORT_TERM') {
                goTo(6);
            } else {
                goTo(7);
            }
        }
    });

    const saveDraftStep5 = t.owner.property.saveDraftStep5.useMutation({
        onSuccess: async data => {
            await utils.owner.property.getSingleDraft.invalidate();
            goTo(7);
        }
    });

    const saveDraftStep6 = t.owner.property.saveDraftStep6.useMutation({
        onSuccess: async data => {
            await utils.owner.property.getSingleDraft.invalidate();
            goTo(8);
        }
    });

    if (!draft) return null;

    return (
        <>
            <Progress
                value={(step / 9) * 100}
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
                        onSubmit={values => {
                            console.log({ step1: values });
                            saveDraftStep1.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        defaultValues={{
                            surfaceArea: draft.surfaceArea,
                            rentType: draft.rentType
                        }}
                        isSubmitting={saveDraftStep1.isLoading}
                    />
                )}
                {step === 2 && (
                    <FormStep2
                        onSubmit={values => {
                            console.log({ step2: values });
                            setValuesForm2(values);
                            goTo(3);
                        }}
                        onPreviousClick={() => goTo(1)}
                        defaultValues={valuesForm2}
                    />
                )}
                {step === 3 && (
                    <FormStep3
                        onSubmit={values => {
                            console.log({ step3: values });
                            saveDraftStep2.mutate({
                                ...values,
                                uid: draft.id,
                                cityUid: valuesForm2.cityUid!,
                                localityUid: valuesForm2.localityUid!,
                                municipalityUid: valuesForm2.municipalityUid!
                            });
                        }}
                        onPreviousClick={() => goTo(2)}
                        defaultValues={{
                            localityUid: valuesForm2.localityUid!
                        }}
                        isSubmitting={saveDraftStep2.isLoading}
                    />
                )}

                {step === 4 && (
                    <FormStep4
                        onSubmit={values => {
                            console.log({ step4: values });
                            saveDraftStep3.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => goTo(3)}
                        defaultValues={{
                            addressInstructions: draft.addressInstructions ?? ''
                        }}
                        isSubmitting={saveDraftStep3.isLoading}
                    />
                )}

                {step === 5 && (
                    <FormStep5
                        onSubmit={values => {
                            console.log({ step5: values });
                            saveDraftStep4.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => goTo(4)}
                        defaultValues={{
                            additionalRooms:
                                (draft.rooms as z.TypeOf<
                                    typeof updatePropertyStep4Schema
                                >['additionalRooms']) ?? []
                        }}
                        isSubmitting={saveDraftStep4.isLoading}
                    />
                )}

                {step === 6 && (
                    <FormStep6
                        onSubmit={values => {
                            console.log({ step6: values });
                            saveDraftStep5.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => goTo(5)}
                        defaultValues={{
                            amenities:
                                (draft.amenities as z.TypeOf<
                                    typeof updatePropertyStep5Schema
                                >['amenities']) ?? []
                        }}
                        isSubmitting={saveDraftStep5.isLoading}
                    />
                )}

                {step === 7 && (
                    <FormStep7
                        onSubmit={values => {
                            console.log({ step7: values });
                            saveDraftStep6.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => {
                            if (draft.rentType === 'SHORT_TERM') {
                                goTo(6);
                            } else {
                                goTo(5);
                            }
                        }}
                        defaultValues={{
                            images:
                                (draft.images as z.TypeOf<
                                    typeof updatePropertyStep6Schema
                                >['images']) ?? []
                        }}
                        isSubmitting={saveDraftStep6.isLoading}
                    />
                )}
            </div>
        </>
    );
}

function getStepNumber(step?: PropertyFormStep | null) {
    switch (step) {
        case 'ADDRESS':
            return 2;
        case 'INSTRUCTIONS':
            return 4;
        case 'ROOMS':
            return 5;
        case 'AMENITIES':
            return 6;
        case 'IMAGES':
            return 7;
        case 'LISTING_DETAILS':
            return 8;
        default:
            return 1;
    }
}
