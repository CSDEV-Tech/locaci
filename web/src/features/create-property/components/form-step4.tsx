import * as React from 'react';
// components

// utils
import { z } from 'zod';
import { createPropertyRequestSchema } from '@web/server/trpc/validation/property-schema';

// types
export type Form4Values = Pick<
    z.TypeOf<typeof createPropertyRequestSchema>,
    'addressInstructions'
>;

export type FormStep4Props = {
    onPreviousClick: () => void;
    onSubmit: () => void;
};

export function FormStep4({}: FormStep4Props) {
    return <></>;
}
