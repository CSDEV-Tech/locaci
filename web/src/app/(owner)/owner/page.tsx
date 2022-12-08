import * as React from 'react';

// components
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { DashboardTabs } from '~/features/owner/components/dashboard-tabs';
import { PropertyList } from '~/features/owner/components/property-list';

// utils
import { rsc } from '~/server/trpc/rsc';

// types
import type { ListingImage } from '~/types';
import type { DraftProperty, Property } from '@prisma/client';

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
                            {/* @ts-ignore */}
                            <DraftList />
                        </React.Suspense>
                    }
                    notifications={<></>}
                />
            </div>
        </>
    );
}

async function DraftList() {
    const { properties, drafts } = await rsc.owner.draft.getAll.fetch();

    return (
        <>
            <PropertyList properties={properties} drafts={drafts} />
        </>
    );
}
