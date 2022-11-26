'use client';
import * as React from 'react';

// components
import { Progress } from '@locaci/ui/components/atoms/progress';
import { FormStep1 } from '~/features/edit-property/components/form-step1';

// utils
import { clsx } from '@locaci/ui/lib/functions';

// types
import type { Property } from '@prisma/client';
export type EditPropertyFormProps = {
    property: Property;
};

export function EditPropertyForm({ property }: EditPropertyFormProps) {
    const [step, setStep] = React.useState(1);

    function goToPrevious() {
        setStep(prev => prev - 1);
    }
    function goToNext() {
        setStep(prev => prev + 1);
    }

    let CurrentForm = () => <FormStep1 onSubmit={goToNext} />;

    switch (property.currentStep) {
        case 'ADDRESS':
            CurrentForm = () => <></>;
            break;
        default:
            break;
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
