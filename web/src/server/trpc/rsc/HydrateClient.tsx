'use client';

import * as React from 'react';
import { type DehydratedState, Hydrate } from '@tanstack/react-query';
import superjson from 'superjson';

import type { DataTransformer } from '@trpc/server';

export function createHydrateClient(opts: { transformer?: DataTransformer }) {
    return function HydrateClient(props: {
        children: React.ReactNode;
        state: DehydratedState;
    }) {
        const { state, children } = props;

        const transformedState: DehydratedState = React.useMemo(() => {
            if (opts.transformer) {
                return opts.transformer.deserialize(state);
            }
            return state;
        }, [state]);
        return <Hydrate state={transformedState}>{children}</Hydrate>;
    };
}

export const HydrateClient = createHydrateClient({
    transformer: superjson
});
