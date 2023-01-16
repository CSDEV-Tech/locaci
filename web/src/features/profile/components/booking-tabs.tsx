'use client';
import * as React from 'react';

// components
import { Tabs } from '@locaci/ui/components/molecules/tabs';
import { NextLinkButton } from '~/features/shared/components/next-link';
import { PlusCircleIcon } from '@locaci/ui/components/atoms/icons/plus-circle';

// types
export type BookingTabsProps = {
    past: React.ReactNode[];
    future: React.ReactNode[];
};

export function BookingTabs({ past, future }: BookingTabsProps) {
    return (
        <>
            {/* Mobile */}
            <Tabs className="lg:hidden">
                <Tabs.Header>
                    <Tabs.HeaderItem>A venir</Tabs.HeaderItem>
                    <Tabs.HeaderItem>Passées</Tabs.HeaderItem>
                </Tabs.Header>
                <Tabs.Body>
                    <Tabs.Item>
                        <section className="flex flex-col items-center gap-4 py-10">
                            {future.length > 0 ? (
                                future
                            ) : (
                                <>
                                    <div className="mx-auto flex w-[400px] flex-col items-center gap-4 pt-28">
                                        <img
                                            src="/no_booking_illustration.svg"
                                            alt="Illustration Aucune Annonce"
                                            className="h-40"
                                        />

                                        <h1 className="text-2xl font-extrabold">
                                            Aucune réservation à venir
                                        </h1>

                                        <p className="text-center text-gray">
                                            Lorsque vous ferez une réservation,
                                            elle apparaîtra ici.
                                        </p>

                                        <NextLinkButton
                                            renderLeadingIcon={cls => (
                                                <PlusCircleIcon
                                                    className={cls}
                                                />
                                            )}
                                            href="/search"
                                            dynamic
                                            variant="secondary">
                                            Effectuer une réservation
                                        </NextLinkButton>
                                    </div>
                                </>
                            )}
                        </section>
                    </Tabs.Item>

                    <Tabs.Item>
                        <section className="flex flex-col items-center gap-4 py-10">
                            {past.length > 0 ? (
                                past
                            ) : (
                                <>
                                    <div className="mx-auto flex w-[400px] flex-col items-center gap-4 pt-28">
                                        <img
                                            src="/no_booking_illustration.svg"
                                            alt="Illustration Aucune Annonce"
                                            className="h-40"
                                        />

                                        <h1 className="text-2xl font-extrabold">
                                            Aucune réservation Passées
                                        </h1>

                                        <p className="text-center text-gray">
                                            Lorsque vous ferez une réservation,
                                            elle apparaîtra ici.
                                        </p>

                                        <NextLinkButton
                                            renderLeadingIcon={cls => (
                                                <PlusCircleIcon
                                                    className={cls}
                                                />
                                            )}
                                            href="/search"
                                            dynamic
                                            variant="secondary">
                                            Effectuer une réservation
                                        </NextLinkButton>
                                    </div>
                                </>
                            )}
                        </section>
                    </Tabs.Item>
                </Tabs.Body>
            </Tabs>
        </>
    );
}
