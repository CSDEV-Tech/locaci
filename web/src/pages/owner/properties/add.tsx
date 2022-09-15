// components
import { OwnerLayout } from 'web/src/components/layouts/owner-layout';
// utils
// types
import { NextPageWithLayout } from '../../_app';

export type AddPropertyPageProps = {};

const AddPropertyPage: NextPageWithLayout<AddPropertyPageProps> = props => {
    return <></>;
};

export default AddPropertyPage;
AddPropertyPage.getLayout = function (page) {
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
                },
                {
                    href: `/owner/properties/add`,
                    label: `Ajouter`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};
