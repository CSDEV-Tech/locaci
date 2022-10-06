// components
import { OwnerLayout } from '@/features/shared/components/layouts/owner-layout';

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
        <section className="flex flex-col gap-4 p-4">
            <h1 className="text-center text-2xl font-bold">
                Détail de la propriété
            </h1>
        </section>
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
