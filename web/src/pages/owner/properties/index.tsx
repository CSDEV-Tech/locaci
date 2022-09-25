import * as React from 'react';
// components
import { PlusCircle } from 'phosphor-react';
import { OwnerLayout } from '@web/features/shared';
import { NextLinkButton } from '@web/components/next-link';
import { LoadingIndicator } from '@locaci/ui';

// utils
import { t } from '@web/utils/trpc-rq-hooks';

// types
import type { NextPageWithLayout } from '@web/pages/_app';

export type PropertiesListPageProps = {};

const PropertiesListPage: NextPageWithLayout<
    PropertiesListPageProps
> = props => {
    return (
        <React.Suspense
            fallback={
                <section className="mx-auto flex w-full items-center justify-center py-64 px-4">
                    <h1 className="flex items-center gap-4 text-2xl">
                        <LoadingIndicator className="h-10" />
                        <span>Chargement de vos propriétés...</span>
                    </h1>
                </section>
            }>
            <PropertyList />
        </React.Suspense>
    );
};

function PropertyList() {
    const { data: properties } = t.owner.property.getAll.useQuery(undefined, {
        suspense: true
    });

    return (
        <>
            <section className="flex flex-col gap-4 p-4">
                {properties?.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-10">
                        <img
                            src="/property_not_found.svg"
                            alt="Illustration Propriété non trouvée"
                            className="h-40 w-40"
                        />
                        <h3 className="text-2xl font-bold">
                            Aucune propriété trouvée
                        </h3>
                        <p className="text-center text-gray">
                            Ajouter une nouvelle propriété pour accueillir vos
                            prochains locataires
                        </p>

                        <NextLinkButton
                            href="/owner/properties/add"
                            className="w-full"
                            variant="dark"
                            renderLeadingIcon={cls => (
                                <PlusCircle className={cls} weight={'bold'} />
                            )}>
                            Nouvelle propriété
                        </NextLinkButton>
                    </div>
                ) : (
                    <>
                        <h2 className="text-center text-2xl font-bold">
                            Liste de vos propriétés
                        </h2>
                    </>
                )}
            </section>
        </>
    );
}

export default PropertiesListPage;
PropertiesListPage.getLayout = function (page) {
    return (
        <OwnerLayout
            title="Tableau de bord"
            breadcrumbItems={[
                {
                    href: `/owner`,
                    label: `Tableau de bord`
                },
                {
                    href: `/owner/properties`,
                    label: `Propriétés`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};
