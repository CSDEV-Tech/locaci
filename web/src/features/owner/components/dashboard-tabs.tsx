'use client';
import * as React from 'react';
// components
import { Tabs } from '@locaci/ui/components/molecules/tabs';
import { Button } from '@locaci/ui/components/atoms/button';
import { RefreshIcon } from '@locaci/ui/components/atoms/icons/refresh';

// types
export type DashboardTabsProps = {
    properties: React.ReactNode;
    bookings: React.ReactNode;
};

export function DashboardTabs({ properties, bookings }: DashboardTabsProps) {
    return (
        <>
            {/* Mobile */}
            <Tabs className="lg:hidden">
                <Tabs.Header>
                    <Tabs.HeaderItem>Logements</Tabs.HeaderItem>
                    <Tabs.HeaderItem>Réservations</Tabs.HeaderItem>
                </Tabs.Header>
                <Tabs.Body>
                    <Tabs.Item>
                        <section className="flex flex-col items-center gap-4 px-4 py-10">
                            {properties}
                        </section>
                    </Tabs.Item>

                    <Tabs.Item>
                        <section className="flex flex-col items-center gap-4 px-4 py-10">
                            {bookings}
                        </section>
                    </Tabs.Item>
                </Tabs.Body>
            </Tabs>

            {/* Desktop */}
            <div className="mx-auto hidden max-w-[1200px] grid-cols-5 gap-8 lg:grid">
                <section className="col-span-3 flex flex-col gap-4 py-10">
                    <h1 className="text-start text-2xl font-bold sm:self-start">
                        Vos logements
                    </h1>
                    {properties}
                </section>

                <section className="col-span-2 flex flex-col gap-4 px-4 py-10">
                    <h1 className="text-center text-2xl font-bold sm:self-start">
                        Réservations
                    </h1>
                    {bookings}
                </section>
            </div>
        </>
    );
}
