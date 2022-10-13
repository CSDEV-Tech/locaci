import * as React from 'react';

// components
import { OwnerLayout } from '@/features/shared/components/layouts/owner-layout';
import { AddListingForm } from '@/features/add-listing/components/add-listing-form';
import { LoadingIndicator } from '@locaci/ui';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

// utils
import { useRouter } from 'next/router';

// types
import type { NextPageWithLayout } from '@/pages/_app';
import { NextLinkButton } from '@/features/shared/components/next-link';
export type AddListingPageProps = {};

const AddListingPage: NextPageWithLayout<AddListingPageProps> = props => {
    return (
        <>
            <section className="flex h-full w-full flex-col gap-14 p-4 pt-20 pb-10">
                <QueryErrorResetBoundary>
                    {({ reset }) => (
                        <ErrorBoundary
                            onReset={reset}
                            fallbackRender={({ error }) => (
                                <section className="mx-auto flex w-full flex-col items-center justify-center gap-6 py-64 px-4">
                                    <h1 className="flex items-center gap-4 text-2xl font-bold">
                                        {error.message}
                                    </h1>

                                    <img
                                        src="/error_illustration.svg"
                                        alt="Image d'erreur"
                                        className="h-[165px] w-[240px]"
                                    />

                                    <NextLinkButton
                                        href="/owner/properties"
                                        variant="secondary">
                                        Retour à la liste des propriétés
                                    </NextLinkButton>
                                </section>
                            )}>
                            <React.Suspense
                                fallback={
                                    <>
                                        <section className="mx-auto flex w-full items-center justify-center py-64 px-4">
                                            <h1 className="flex items-center gap-4 text-2xl">
                                                <LoadingIndicator className="h-10" />
                                                <span>
                                                    Chargement de votre
                                                    propriété...
                                                </span>
                                            </h1>
                                        </section>
                                    </>
                                }>
                                <h1 className="text-center text-2xl font-bold">
                                    Ajouter une nouvelle annonce pour votre
                                    logement
                                </h1>
                                <AddListingForm />
                            </React.Suspense>
                        </ErrorBoundary>
                    )}
                </QueryErrorResetBoundary>
            </section>
        </>
    );
};

AddListingPage.getLayout = page => {
    const router = useRouter();
    const { uid } = router.query;
    return (
        <OwnerLayout
            title={`Ajouter une nouvelle annonce`}
            breadcrumbItems={[
                {
                    href: `/owner`,
                    label: `Tableau de bord`
                },
                {
                    href: `/owner/properties`,
                    label: `Propriétés`
                },
                {
                    href: `/owner/properties/${uid}`,
                    label: `Détail`
                },
                {
                    href: `/owner/properties/${uid}/listings/add`,
                    label: `Ajouter une annonce`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};

export default AddListingPage;
