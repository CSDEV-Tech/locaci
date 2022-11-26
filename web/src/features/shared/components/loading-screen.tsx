import * as React from 'react';
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { clsx } from '@locaci/ui/lib/functions';

export type LoadingScreenProps = {
    title?: string;
    className?: string;
};

export function LoadingScreen({
    title = 'Chargement...',
    className
}: LoadingScreenProps) {
    return (
        <>
            <section
                className={clsx(className, 'flex items-center justify-center')}>
                <h1 className="flex items-center gap-4 text-3xl md:text-4xl">
                    <LoadingIndicator className="h-10" />
                    <span>{title}</span>
                </h1>
            </section>
        </>
    );
}
