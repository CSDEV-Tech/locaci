import * as React from 'react';
import { Button } from '../atoms/button';
import { UploadSimple } from 'phosphor-react';
import { clsx } from '../../lib/functions';

export type DropZoneProps = {
    className?: string;
    label: string;
};

export function DropZone({ className, label }: DropZoneProps) {
    return (
        <>
            <div
                className={clsx(
                    className,
                    `my-6 grid items-center justify-center`,
                    `rounded-md border-2 border-dashed border-lightgray p-4`
                )}>
                <Button
                    renderLeadingIcon={cls => <UploadSimple className={cls} />}>
                    {label}
                </Button>
            </div>
        </>
    );
}
