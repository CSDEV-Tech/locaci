// components
import { Button, Tabs } from '@locaci/ui';
import { OwnerLayout } from '@web/components/layouts/owner-layout';

// utils
import { useListingModalStore } from '@web/components/add-listing-modal';

// types
import type { NextPageWithLayout } from '@web/pages/_app';

export type OwnerDashboardPageProps = {};

const OwnerDashboardPage: NextPageWithLayout<OwnerDashboardPageProps> = () => {
    const showModal = useListingModalStore(state => state.show);
    return (
        <div className="px-4 pt-10">
            <Tabs className="md:hidden">
                <Tabs.Header>
                    <Tabs.HeaderItem>Annonces</Tabs.HeaderItem>
                    <Tabs.HeaderItem>Alertes</Tabs.HeaderItem>
                </Tabs.Header>
                <Tabs.Body>
                    <Tabs.Item>
                        <section className="flex flex-col items-center gap-4 px-4 py-10">
                            <img
                                src="/listing_not_found.svg"
                                alt="Illustration Aucune Annonce"
                            />

                            <h1 className="text-2xl font-extrabold">
                                Aucune annonce trouvée
                            </h1>

                            <p className="text-center text-gray">
                                Créer votre première annonce pour mettre en
                                valeur votre logement et attirer les futurs
                                locataires.
                            </p>
                            <Button variant="secondary" onClick={showModal}>
                                Ajouter votre première annonce
                            </Button>
                        </section>
                    </Tabs.Item>

                    <Tabs.Item>
                        <section className="flex flex-col items-center gap-4 px-4 py-10">
                            <img
                                src="/notification_not_found.svg"
                                alt="Illustration Aucune notification"
                                className="w-[307px]"
                            />

                            <h1 className="text-2xl font-extrabold">
                                Aucune alerte en vue
                            </h1>

                            <p className="text-center text-gray">
                                Un client vous contacte ? Un impayé ? Un
                                problème avec le logement ? Retrouvez toutes vos
                                alertes à un seul endroit.
                            </p>
                        </section>
                    </Tabs.Item>
                </Tabs.Body>
            </Tabs>
        </div>
    );
};

export default OwnerDashboardPage;
OwnerDashboardPage.getLayout = page => {
    return (
        <OwnerLayout
            title="Tableau de bord"
            breadcrumbItems={[
                {
                    href: `/owner`,
                    label: `Tableau de bord`
                }
            ]}>
            {page}
        </OwnerLayout>
    );
};
