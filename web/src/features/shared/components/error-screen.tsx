'use client';
import * as React from 'react';

export type ErrorScreenProps = {
    error: string;
    children: React.ReactNode;
};

export function ErrorScreen({ children, error }: ErrorScreenProps) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div
                className={`flex flex-col items-center gap-6 md:m-auto md:w-[450px]`}>
                <img
                    src="/error_illustration.svg"
                    alt="Image d'erreur"
                    className="h-[165px] w-[240px]"
                />

                <h1 className="px-6 text-center text-2xl font-extrabold leading-normal md:text-3xl">
                    OOPS !
                </h1>

                <h2 className="text-center text-lg text-gray">{error}</h2>

                {children}
            </div>
        </div>
    );
}
