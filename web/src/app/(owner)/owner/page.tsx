import * as React from 'react';

// components
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { DashboardTabs } from '~/features/owner/components/dashboard-tabs';
import { PropertyList } from '~/features/owner/components/property-list';

// utils
import { rsc } from '~/server/trpc/rsc';
import { use } from 'react';

// types
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';

export default async function OwnerDashboardPage() {
    return (
        <>
            <div className="px-4 pt-10">
                <DashboardTabs
                    properties={
                        <React.Suspense
                            fallback={
                                <section className="mx-auto flex w-full items-center justify-center py-64 px-4">
                                    <h1 className="flex items-center gap-4 text-2xl">
                                        <LoadingIndicator className="h-10" />
                                        <span>
                                            Chargement de vos propriétés...
                                        </span>
                                    </h1>
                                </section>
                            }>
                            <DraftList />
                        </React.Suspense>
                    }
                    notifications={<></>}
                />
            </div>
        </>
    );
}

function DraftList() {
    use(rsc.owner.draft.getAll.fetch());

    return (
        <HydrateClient state={use(rsc.dehydrate())}>
            <PropertyList />
        </HydrateClient>
    );
}
