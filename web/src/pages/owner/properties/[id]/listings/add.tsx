// components
import { OwnerLayout } from '@/features/shared/components/layouts/owner-layout';

// utils
import { useRouter } from 'next/router';

// types
import type { NextPageWithLayout } from '@/pages/_app';
export type AddListingPageProps = {};

const AddListingPage: NextPageWithLayout<AddListingPageProps> = props => {
    return <></>;
};

AddListingPage.getLayout = page => {
    const router = useRouter();
    const { id } = router.query;
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
                    href: `/owner/properties/${id}`,
                    label: `Détail`
                },
                {
                    href: `/owner/properties/${id}/listings/add`,
                    label: `Ajouter une annonce`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};

export default AddListingPage;
