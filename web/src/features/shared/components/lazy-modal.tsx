'use client';
import * as React from 'react';

// utils
import dynamic from 'next/dynamic';

// types
import type { ModalProps } from '@locaci/ui/components/atoms/modal';

const Modal = dynamic(() => import(`@locaci/ui/components/atoms/modal`), {
    ssr: false
});

export function LazyModal(props: ModalProps) {
    return <Modal {...props} />;
}
