// components
import { OwnerLayout } from 'web/src/components/layouts/owner-layout';
// utils
// types
import type { NextPageWithLayout } from '../../_app';

export type PropertiesListPageProps = {};

const PropertiesListPage: NextPageWithLayout<
    PropertiesListPageProps
> = props => {
    return <></>;
};

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
