'use client';
import * as React from 'react';

// utils
import dynamic from 'next/dynamic';

// types
import type { ModalProps } from '@locaci/ui/components/atoms/modal';

const Modal = dynamic(() => import(`@locaci/ui/components/atoms/modal`), {
    // FIXME : this should be fixed by the next release of nextjs
    // ssr: false,
    loading: () => <></>
});

export function LazyModal(props: ModalProps) {
    return <Modal {...props} />;
}
