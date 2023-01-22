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
            <Tabs className="md:hidden">
                <Tabs.Header>
                    <Tabs.HeaderItem>A venir</Tabs.HeaderItem>
                    <Tabs.HeaderItem>Passées</Tabs.HeaderItem>
                </Tabs.Header>
                <Tabs.Body>
                    <Tabs.Item>
                        <section className="grid items-center gap-4 py-10 sm:grid-cols-2 md:grid-cols-3">
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
                        <section className="grid items-center gap-4 py-10 sm:grid-cols-2 md:grid-cols-3">
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
                                            Aucune réservation passée
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

            {/* Desktop */}
            <div className="mx-auto hidden w-full max-w-[1200px] grid-cols-2 gap-8 md:grid">
                <section className="flex w-full flex-col gap-4 py-4">
                    <h1 className="text-start text-2xl font-bold sm:self-start">
                        Vos réservations à venir
                    </h1>
                    <section className="grid gap-4 lg:grid-cols-2 ">
                        {future.length > 0 ? (
                            future
                        ) : (
                            <>
                                <div className="col-span-2 mx-auto flex w-[400px] flex-col items-center gap-4 pt-28">
                                    <img
                                        src="/no_booking_illustration.svg"
                                        alt="Illustration Aucune Annonce"
                                        className="h-40"
                                    />

                                    <h1 className="text-2xl font-extrabold">
                                        Aucune réservation à venir
                                    </h1>

                                    <p className="text-center text-gray">
                                        Lorsque vous ferez une réservation, elle
                                        apparaîtra ici.
                                    </p>

                                    <NextLinkButton
                                        renderLeadingIcon={cls => (
                                            <PlusCircleIcon className={cls} />
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
                </section>

                <section className="flex w-full flex-col gap-4 px-4 py-4">
                    <h1 className="text-center text-2xl font-bold sm:self-start">
                        Vos réservations passées
                    </h1>
                    <section className="grid grid-cols-2 gap-4">
                        {past.length > 0 ? (
                            past
                        ) : (
                            <>
                                <div className="col-span-2 mx-auto flex w-[400px] flex-col items-center gap-4 pt-28">
                                    <img
                                        src="/no_booking_illustration.svg"
                                        alt="Illustration Aucune Annonce"
                                        className="h-40"
                                    />

                                    <h1 className="text-2xl font-extrabold">
                                        Aucune réservation passée
                                    </h1>

                                    <p className="text-center text-gray">
                                        Lorsque vous ferez une réservation, elle
                                        apparaîtra ici.
                                    </p>

                                    <NextLinkButton
                                        renderLeadingIcon={cls => (
                                            <PlusCircleIcon className={cls} />
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
                </section>
            </div>
        </>
    );
}
