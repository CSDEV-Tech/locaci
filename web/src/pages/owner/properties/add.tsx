// components
import { OwnerLayout } from '@web/components/layouts/owner-layout';
// utils
// types
import { NextPageWithLayout } from '@web/pages/_app';

export type AddPropertyPageProps = {};

const AddPropertyPage: NextPageWithLayout<AddPropertyPageProps> = props => {
    return <section className=""></section>;
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
