'use client';
import * as React from 'react';

// components
import { Progress } from '@locaci/ui/components/atoms/progress';
import { DraftSuccessModal } from './draft-success-modal';
import { FormStep1 } from './form-step1';
import { FormStep2 } from './form-step2';
import { FormStep3 } from './form-step3';
import { FormStep4 } from './form-step4';
import { FormStep5 } from './form-step5';
import { FormStep6 } from './form-step6';
import { FormStep7 } from './form-step7';
import { FormStep8 } from './form-step8';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { t } from '~/app/trpc-client-provider';
import { useRouter } from 'next/navigation';

// types
import type { z } from 'zod';
import {
    updatePropertyStep5Schema,
    updatePropertyStep6Schema,
    updatePropertyStep7Schema
} from '~/validation/property-schema';
import type { PropertyFormStep } from '@prisma/client';
import type { Form2Values } from './form-step2';
import type { BoundingBox } from '~/utils/types';

type EditDraftPropertyFormProps = {
    propertyDraftUid: string;
};

export function EditDraftPropertyForm({
    propertyDraftUid
}: EditDraftPropertyFormProps) {
    const { data: draft } = t.owner.draft.getSingleDraft.useQuery(
        {
            uid: propertyDraftUid
        },
        {
            staleTime: Infinity
        }
    );
    const utils = t.useContext();
    const router = useRouter();

    // states
    const [step, goTo] = React.useState(getStepNumber(draft?.currentStep));
    const [isSuccessModalOpen, setSuccessModalOpen] = React.useState(false);
    const [propertyUid, setPropertyUid] = React.useState<string | null>(null);

    const [valuesForm2, setValuesForm2] = React.useState<
        Partial<Form2Values & { boundingbox?: BoundingBox }>
    >({
        localityName: draft?.localityName ?? '',
        localityOSMID: draft?.locality_osm_id ?? '',
        municipalityUid: draft?.municipalityId ?? '',
        cityUid: draft?.cityId ?? '',
        municipalityQuery: draft?.municipalityName ?? '',
        boundingBox: draft?.locality_bbox as BoundingBox | undefined
    });

    // mutations
    const saveDraftStep1 = t.owner.draft.saveDraftStep1.useMutation({
        onSuccess: async () => {
            await utils.owner.draft.getSingleDraft.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(2);
        }
    });

    const saveDraftStep2 = t.owner.draft.saveDraftStep2.useMutation({
        onSuccess: async () => {
            await utils.owner.draft.getSingleDraft.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(4);
        }
    });

    const saveDraftStep4 = t.owner.draft.saveDraftStep4.useMutation({
        onSuccess: async () => {
            await utils.owner.draft.getSingleDraft.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(5);
        }
    });

    const saveDraftStep5 = t.owner.draft.saveDraftStep5.useMutation({
        onSuccess: async data => {
            await utils.owner.draft.getSingleDraft.invalidate();
            await utils.owner.draft.getAll.invalidate();

            if (data.rentType === 'SHORT_TERM') {
                goTo(6);
            } else {
                goTo(7);
            }
        }
    });

    const saveDraftStep6 = t.owner.draft.saveDraftStep6.useMutation({
        onSuccess: async () => {
            await utils.owner.draft.getSingleDraft.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(7);
        }
    });

    const saveDraftStep7 = t.owner.draft.saveDraftStep7.useMutation({
        onSuccess: async () => {
            await utils.owner.draft.getSingleDraft.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(8);
        }
    });

    const saveDraftStep8 = t.owner.draft.saveDraftStep8.useMutation({
        onSuccess: async data => {
            await utils.owner.draft.getSingleDraft.invalidate();
            await utils.owner.draft.getAll.invalidate();
            setPropertyUid(data.propertyUid);
            setSuccessModalOpen(true);
        }
    });

    if (!draft) return null;

    return (
        <>
            {propertyUid && (
                <DraftSuccessModal
                    propertyUid={propertyUid}
                    open={isSuccessModalOpen}
                    onClose={() => {
                        router.replace(`/owner`);
                    }}
                />
            )}

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
                    'gap-14 pb-44 pt-20',
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
                                localityName: valuesForm2.localityName!,
                                municipalityUid: valuesForm2.municipalityUid!,
                                boundingBox: valuesForm2.boundingBox!,
                                municipalityName: valuesForm2.municipalityQuery!
                            });
                        }}
                        onPreviousClick={() => goTo(2)}
                        defaultValues={{
                            localityOSMID: valuesForm2.localityOSMID!,
                            boundingbox: valuesForm2.boundingBox!
                        }}
                        isSubmitting={saveDraftStep2.isLoading}
                    />
                )}

                {step === 4 && (
                    <FormStep4
                        onSubmit={values => {
                            console.log({ step4: values });
                            saveDraftStep4.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => goTo(3)}
                        defaultValues={{
                            addressInstructions: draft.addressInstructions ?? ''
                        }}
                        isSubmitting={saveDraftStep4.isLoading}
                    />
                )}

                {step === 5 && (
                    <FormStep5
                        onSubmit={values => {
                            console.log({ step5: values });
                            saveDraftStep5.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => goTo(4)}
                        defaultValues={{
                            additionalRooms:
                                (draft.rooms as z.TypeOf<
                                    typeof updatePropertyStep5Schema
                                >['additionalRooms']) ?? []
                        }}
                        isSubmitting={saveDraftStep5.isLoading}
                    />
                )}

                {step === 6 && (
                    <FormStep6
                        onSubmit={values => {
                            console.log({ step6: values });
                            saveDraftStep6.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => goTo(5)}
                        defaultValues={{
                            amenities:
                                (draft.amenities as z.TypeOf<
                                    typeof updatePropertyStep6Schema
                                >['amenities']) ?? []
                        }}
                        isSubmitting={saveDraftStep6.isLoading}
                    />
                )}

                {step === 7 && (
                    <FormStep7
                        onSubmit={values => {
                            console.log({ step7: values });
                            saveDraftStep7.mutate({
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
                                    typeof updatePropertyStep7Schema
                                >['images']) ?? []
                        }}
                        isSubmitting={saveDraftStep7.isLoading}
                    />
                )}

                {step === 8 && (
                    <FormStep8
                        intent="draft"
                        onSubmit={values => {
                            console.log({ step8: values });
                            saveDraftStep8.mutate({
                                ...values,
                                uid: draft.id
                            });
                        }}
                        onPreviousClick={() => goTo(7)}
                        defaultValues={{
                            rentType: draft.rentType
                        }}
                        isSubmitting={saveDraftStep8.isLoading}
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
        case 'COMPLETE':
            return 8;
        default:
            return 1;
    }
}
