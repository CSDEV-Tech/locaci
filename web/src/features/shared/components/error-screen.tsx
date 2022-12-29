import { clsx } from '@locaci/ui/lib/functions';
import * as React from 'react';

export type ErrorScreenProps = {
    errorDescription: string;
    errorTitle?: string;
    children: React.ReactNode;
    className?: string;
    illustration_url?: string;
};

export function ErrorScreen({
    children,
    className,
    errorDescription,
    illustration_url = '/error_illustration.svg',
    errorTitle = 'OOPS !'
}: ErrorScreenProps) {
    return (
        <div className={clsx(className, 'flex items-center justify-center')}>
            <div
                className={`flex flex-col items-center gap-6 md:m-auto md:w-[450px]`}>
                <img
                    src={illustration_url}
                    alt="Image d'erreur"
                    className="h-[165px] w-[240px]"
                />

                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    {errorTitle}
                </h1>

                <h2 className="text-center text-lg text-gray">
                    {errorDescription}
                </h2>

                {children}
            </div>
        </div>
    );
}
