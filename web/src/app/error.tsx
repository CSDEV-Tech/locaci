'use client';
import * as React from 'react';
// components
import { Button } from '@locaci/ui/components/atoms/button';
import { ErrorScreen } from '~/features/shared/components/error-screen';

// types
import type { ErrorBoundaryProps } from '~/types';

export default function Error(props: ErrorBoundaryProps) {
    React.useEffect(() => {
        console.log(props.error);
    }, []);
    return (
        <ErrorScreen
            errorDescription={props.error.message}
            errorTitle={`OOPS ! Une erreur est survenue`}
            className={`h-screen w-screen`}>
            <Button onClick={props.reset}>Recharger la page</Button>
        </ErrorScreen>
    );
}
