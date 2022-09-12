// components

// utils

// types
import type { NextPageWithLayout } from '../_app';
import { OwnerLayout } from 'web/src/components/layouts/owner-layout';

export type OwnerDashboardPageProps = {};

const OwnerDashboardPage: NextPageWithLayout<OwnerDashboardPageProps> = () => {
    return <></>;
};

export default OwnerDashboardPage;
OwnerDashboardPage.getLayout = page => {
    return (
        <OwnerLayout
            title="Tableau de bord"
            links={[
                {
                    href: `/owner`,
                    label: `Tableau de bord`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};
