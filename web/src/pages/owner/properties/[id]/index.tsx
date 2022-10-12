// components
import { OwnerLayout } from '@/features/shared/components/layouts/owner-layout';
import { NextLinkButton } from '@/features/shared/components/next-link';
import { PlusCircle } from 'phosphor-react';

// utils
import { useRouter } from 'next/router';

// types
import type { NextPageWithLayout } from '@/pages/_app';

export type PropertyDetailsPageProps = {};

const PropertyDetailsPage: NextPageWithLayout<
    PropertyDetailsPageProps
> = props => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <section className="flex h-full flex-col gap-4 p-4">
                <h1 className="text-center text-2xl font-bold">
                    Détail de la propriété
                </h1>
            </section>
            <div className="fixed bottom-10 w-full px-10">
                <NextLinkButton
                    href={`/owner/properties/${id}/listings/add`}
                    className="w-full"
                    variant="secondary"
                    renderLeadingIcon={cls => (
                        <PlusCircle className={cls} weight={'bold'} />
                    )}>
                    Ajouter une nouvelle annonce
                </NextLinkButton>
            </div>
        </>
    );
};

PropertyDetailsPage.getLayout = page => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <OwnerLayout
            title={`Détail de la propriété`}
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
                    href: `/owner/properties/${id}`,
                    label: `Détail`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};

export default PropertyDetailsPage;
