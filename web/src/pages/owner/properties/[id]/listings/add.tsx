import * as React from 'react';

// components
import { OwnerLayout } from '@/features/shared/components/layouts/owner-layout';
import { Button, CalendarInput, NumberInput, TextArea } from '@locaci/ui';

// utils
import { useRouter } from 'next/router';

// types
import type { NextPageWithLayout } from '@/pages/_app';
export type AddListingPageProps = {};

const AddListingPage: NextPageWithLayout<AddListingPageProps> = props => {
    const [date, setDate] = React.useState(new Date());

    return (
        <>
            <section className="flex h-full w-full flex-col gap-14 p-4 pt-20 pb-10">
                <h1 className="text-center text-2xl font-bold">
                    Ajouter une nouvelle annonce pour votre logement
                </h1>

                <form
                    className="flex flex-col items-stretch gap-4"
                    onSubmit={e => e.preventDefault()}>
                    <NumberInput
                        required
                        onChange={() => {}}
                        label={`Nombre de chambres disponibles`}
                        value={1}
                        min={1}
                        showButtons
                    />

                    <NumberInput
                        onChange={() => {}}
                        label={`Nombre de mois de caution`}
                        showButtons
                    />

                    <NumberInput
                        onChange={() => {}}
                        label={`Nombre de mois d'agence`}
                        showButtons
                    />

                    <NumberInput
                        required
                        onChange={() => {}}
                        label={`Prix du logement`}
                        appendix={`FCFA`}
                    />

                    <CalendarInput
                        label={`Date de disponibilité`}
                        value={date}
                        onChange={setDate}
                    />

                    <TextArea
                        required
                        label="Description de votre logement"
                        helpText={`Vendez votre logement, et donnez le plus d'informatins dessus`}
                    />

                    <Button type="submit" variant="secondary">
                        Ajouter
                    </Button>
                </form>
            </section>
        </>
    );
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
