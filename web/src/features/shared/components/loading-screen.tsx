import * as React from 'react';
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';

export type LoadingScreenProps = {
    title?: string;
};

export function LoadingScreen({ title = 'Chargement...' }: LoadingScreenProps) {
    return (
        <>
            <section className="flex h-screen w-screen items-center justify-center">
                <h1 className="flex items-center gap-4 text-4xl">
                    <LoadingIndicator className="h-10" />
                    <span>{title}</span>
                </h1>
            </section>
        </>
    );
}
