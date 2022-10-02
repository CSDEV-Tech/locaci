// components
import { OwnerLayout } from '@web/features/shared';

// utils
import { useRouter } from 'next/router';

// types
import type { NextPageWithLayout } from '@web/pages/_app';
export type AddListingPageProps = {};

const AddListingPage: NextPageWithLayout<AddListingPageProps> = props => {
    return <></>;
};

AddListingPage.getLayout = page => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <OwnerLayout
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
                    label: `Détail de la propriété`
                },
                {
                    href: `/owner/properties/${id}/listings/add`,
                    label: `Ajout d'une annonce`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};

export default AddListingPage;
