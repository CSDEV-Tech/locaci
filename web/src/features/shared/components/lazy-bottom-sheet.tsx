'use client';
import * as React from 'react';

// utils
import dynamic from 'next/dynamic';

// types
import type { BottomSheetProps } from '@locaci/ui';

const BottomSheet = dynamic(
    // @ts-ignore
    () => import(`@locaci/ui/components/atoms/bottom-sheet`),
    {
        ssr: false
    }
);

export function LazyBottomSheet(props: BottomSheetProps) {
    return <BottomSheet {...props} />;
}
