'use client';
import * as React from 'react';
import { Tabs } from '@locaci/ui/components/molecules/tabs';
import { Button } from '@locaci/ui/components/atoms/button';

export type DashboardTabsProps = {
    properties: React.ReactNode;
    notifications: React.ReactNode;
};

export function DashboardTabs({
    properties,
    notifications
}: DashboardTabsProps) {
    return (
        <>
            <Tabs className="md:hidden">
                <Tabs.Header>
                    <Tabs.HeaderItem>Annonces</Tabs.HeaderItem>
                    <Tabs.HeaderItem>Notifications</Tabs.HeaderItem>
                </Tabs.Header>
                <Tabs.Body>
                    <Tabs.Item>{properties}</Tabs.Item>

                    <Tabs.Item>
                        <section className="flex flex-col items-center gap-4 px-4 py-10">
                            <img
                                src="/void_illustration.svg"
                                alt="Illustration Aucune notification"
                                className="h-44"
                            />

                            <h1 className="text-2xl font-extrabold">
                                Aucune notification en vue
                            </h1>

                            <p className="text-center text-gray">
                                Un client vous contacte ? Un impayé ? Un
                                problème avec le logement ? Retrouvez toutes vos
                                notifications à un seul endroit.
                            </p>
                        </section>
                    </Tabs.Item>
                </Tabs.Body>
            </Tabs>
        </>
    );
}
