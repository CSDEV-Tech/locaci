'use client';
import * as React from 'react';
import { z } from 'zod';
import { searchSchema } from '~/lib/validation-schemas/search-schema';

export type FiltersMobileProps = {
    className?: string;
    filters: z.infer<typeof searchSchema>;
};

export function FiltersMobile({}: FiltersMobileProps) {
    return <div className=""></div>;
}
