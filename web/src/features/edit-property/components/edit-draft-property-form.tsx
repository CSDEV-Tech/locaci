'use client';
import * as React from 'react';

// components
import { Progress } from '@locaci/ui/components/atoms/progress';
import { FormStep1 } from '~/features/edit-property/components/form-step1';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { t } from '~/utils/trpc-rq-hooks';
import type { PropertyFormStep } from '@prisma/client';

// types
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
    const [step, setStep] = React.useState(getStepNumber(draft?.currentStep));

    if (!draft) return null;

    function goToNext() {
        setStep(step => step + 1);
    }

    function goToPrevious() {
        setStep(step => step - 1);
    }

    return (
        <>
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
                {step === 1 && <FormStep1 onSubmit={goToNext} />}
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
