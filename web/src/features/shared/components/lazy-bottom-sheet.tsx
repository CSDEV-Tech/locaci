import * as React from 'react';

// utils
import dynamic from 'next/dynamic';

// types
import type { BottomSheetProps } from '@locaci/ui';

const BottomSheet = dynamic(
    // @ts-ignore
    () => import(`@locaci/ui/dist/components/atoms/bottom-sheet`),
    {
        ssr: false,
        suspense: true
    }
);

export function LazyBottomSheet(props: BottomSheetProps) {
    return (
        <React.Suspense fallback={<></>}>
            <BottomSheet {...props} />
        </React.Suspense>
    );
}
