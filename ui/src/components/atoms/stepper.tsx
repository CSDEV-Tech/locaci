import * as React from 'react';
import { clsx } from '../../lib/functions';

export type StepperProps = {
    stepLabels: string[];
    // the current step, starting from 1
    currentStep: number;
    className?: string;
    onChangeStep?: (newStep: number) => void;
    variant?: 'primary' | 'secondary';
};

export function Stepper({
    currentStep,
    className,
    stepLabels,
    onChangeStep,
    variant = 'primary'
}: StepperProps) {
    return (
        <ol
            className={clsx(
                className,
                `flex w-full max-w-full overflow-scroll`
            )}>
            {stepLabels.map(label => (
                <li key={label} className={``}>
                    {label}
                </li>
            ))}
        </ol>
    );
}
