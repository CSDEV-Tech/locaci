'use client';
import * as React from 'react';

// components
import { Progress } from '@locaci/ui/components/atoms/progress';
import { FormStep1 } from './form-step1';
import { FormStep2 } from './form-step2';
import { FormStep3 } from './form-step3';
import { FormStep4 } from './form-step4';
import { FormStep5 } from './form-step5';
import { FormStep6 } from './form-step6';
import { FormStep7 } from './form-step7';
import { FormStep8 } from './form-step8';
import { EditPropertySuccessModal } from './edit-property-success-modal';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { t } from '~/app/trpc-client-provider';
import { useRouter } from 'next/navigation';
import {
    updatePropertyStep5Schema,
    updatePropertyStep6Schema,
    updatePropertyStep7Schema
} from '~/validation/property-schema';

// types
import type { z } from 'zod';
import type { Form2Values } from './form-step2';
import type { BoundingBox } from '~/utils/types';

type EditPropertyPropertyFormProps = {
    propertyUid: string;
};

export function EditPropertyPropertyForm({
    propertyUid
}: EditPropertyPropertyFormProps) {
    const { data: property } = t.owner.property.getSingle.useQuery(
        {
            uid: propertyUid
        },
        {
            staleTime: Infinity
        }
    );

    if (!property) {
        return null;
    }

    const utils = t.useContext();
    const router = useRouter();

    // states
    const [step, goTo] = React.useState(1);
    const [isSuccessModalOpen, setSuccessModalOpen] = React.useState(false);
    const [propertyShortUid, setPropertyShortUid] = React.useState<
        string | null
    >(null);

    const [valuesForm2, setValuesForm2] = React.useState<
        Form2Values & { boundingBox: BoundingBox }
    >({
        localityName: property.localityName,
        localityOSMID: property.locality_osm_id,
        municipalityUid: property.municipalityId,
        cityUid: property.cityId,
        municipalityQuery: property.municipality.name,
        boundingBox: property.locality_bbox as BoundingBox
    });

    // mutations
    const savePropertyStep1 = t.owner.property.savePropertyStep1.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingle.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(2);
        }
    });

    const savePropertyStep2 = t.owner.property.savePropertyStep2.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingle.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(4);
        }
    });

    const savePropertyStep4 = t.owner.property.savePropertyStep4.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingle.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(5);
        }
    });

    const savePropertyStep5 = t.owner.property.savePropertyStep5.useMutation({
        onSuccess: async data => {
            await utils.owner.property.getSingle.invalidate();
            await utils.owner.draft.getAll.invalidate();

            if (data.rentType === 'SHORT_TERM') {
                goTo(6);
            } else {
                goTo(7);
            }
        }
    });

    const savePropertyStep6 = t.owner.property.savePropertyStep6.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingle.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(7);
        }
    });

    const saveDraftStep7 = t.owner.property.savePropertyStep7.useMutation({
        onSuccess: async () => {
            await utils.owner.property.getSingle.invalidate();
            await utils.owner.draft.getAll.invalidate();
            goTo(8);
        }
    });

    const savePropertyStep8 = t.owner.property.savePropertyStep8.useMutation({
        onSuccess: async data => {
            await utils.owner.property.getSingle.invalidate();
            await utils.owner.draft.getAll.invalidate();
            setPropertyShortUid(data.propertyShortUid);
            setSuccessModalOpen(true);
        }
    });

    return (
        <>
            {propertyShortUid && (
                <EditPropertySuccessModal
                    propertyUid={propertyUid}
                    open={isSuccessModalOpen}
                    onClose={() => {
                        router.push(`/owner`);
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
                            savePropertyStep1.mutate({
                                ...values,
                                uid: property.id
                            });
                        }}
                        defaultValues={{
                            surfaceArea: property.surfaceArea,
                            rentType: property.rentType
                        }}
                        isSubmitting={savePropertyStep1.isLoading}
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
                            savePropertyStep2.mutate({
                                ...values,
                                uid: property.id,
                                cityUid: valuesForm2.cityUid,
                                localityName: valuesForm2.localityName,
                                municipalityUid: valuesForm2.municipalityUid,
                                boundingBox: valuesForm2.boundingBox,
                                municipalityName: valuesForm2.municipalityQuery
                            });
                        }}
                        onPreviousClick={() => goTo(2)}
                        defaultValues={{
                            localityOSMID: valuesForm2.localityOSMID,
                            boundingbox: valuesForm2.boundingBox
                        }}
                        isSubmitting={savePropertyStep2.isLoading}
                    />
                )}

                {step === 4 && (
                    <FormStep4
                        onSubmit={values => {
                            console.log({ step4: values });
                            savePropertyStep4.mutate({
                                ...values,
                                uid: property.id
                            });
                        }}
                        onPreviousClick={() => goTo(3)}
                        defaultValues={{
                            addressInstructions:
                                property.addressInstructions ?? ''
                        }}
                        isSubmitting={savePropertyStep4.isLoading}
                    />
                )}

                {step === 5 && (
                    <FormStep5
                        onSubmit={values => {
                            console.log({ step5: values });
                            savePropertyStep5.mutate({
                                ...values,
                                uid: property.id
                            });
                        }}
                        onPreviousClick={() => goTo(4)}
                        defaultValues={{
                            additionalRooms:
                                (property.rooms as z.TypeOf<
                                    typeof updatePropertyStep5Schema
                                >['additionalRooms']) ?? []
                        }}
                        isSubmitting={savePropertyStep5.isLoading}
                    />
                )}

                {step === 6 && (
                    <FormStep6
                        onSubmit={values => {
                            console.log({ step6: values });
                            savePropertyStep6.mutate({
                                ...values,
                                uid: property.id
                            });
                        }}
                        onPreviousClick={() => goTo(5)}
                        defaultValues={{
                            amenities:
                                (property.amenities as z.TypeOf<
                                    typeof updatePropertyStep6Schema
                                >['amenities']) ?? []
                        }}
                        isSubmitting={savePropertyStep6.isLoading}
                    />
                )}

                {step === 7 && (
                    <FormStep7
                        onSubmit={values => {
                            console.log({ step7: values });
                            saveDraftStep7.mutate({
                                ...values,
                                uid: property.id
                            });
                        }}
                        onPreviousClick={() => {
                            if (property.rentType === 'SHORT_TERM') {
                                goTo(6);
                            } else {
                                goTo(5);
                            }
                        }}
                        defaultValues={{
                            images:
                                (property.images as z.TypeOf<
                                    typeof updatePropertyStep7Schema
                                >['images']) ?? []
                        }}
                        isSubmitting={saveDraftStep7.isLoading}
                    />
                )}

                {step === 8 && (
                    <FormStep8
                        intent="edit"
                        onSubmit={values => {
                            console.log({ step8: values });
                            savePropertyStep8.mutate({
                                ...values,
                                uid: property.id
                            });
                        }}
                        onPreviousClick={() => goTo(7)}
                        defaultValues={{
                            rentType: property.rentType,
                            cautionMonthsPaymentAdvance:
                                property.cautionMonthsPaymentAdvance,
                            agencyMonthsPaymentAdvance:
                                property.agencyMonthsPaymentAdvance,
                            availableFrom: property.availableFrom,
                            description: property.description,
                            housingFee: property.housingFee,
                            housingPeriod: property.housingPeriod
                        }}
                        isSubmitting={savePropertyStep8.isLoading}
                    />
                )}
            </div>
        </>
    );
}
