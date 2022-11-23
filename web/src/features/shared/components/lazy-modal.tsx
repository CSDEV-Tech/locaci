'use client';
import * as React from 'react';

// utils
import dynamic from 'next/dynamic';

// types
import type { ModalProps } from '@locaci/ui';

const Modal = dynamic(
    // @ts-ignore
    () => import(`@locaci/ui/dist/components/atoms/modal`),
    {
        ssr: false,
        suspense: true
    }
);

export function LazyModal(props: ModalProps) {
    return (
        <React.Suspense fallback={<></>}>
            {/* @ts-ignore */}
            <Modal {...props} />
        </React.Suspense>
    );
}
