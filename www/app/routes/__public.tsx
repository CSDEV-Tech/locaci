import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Footer } from '~/www/features/shared/components/footer';
import { Header } from '~/www/features/shared/components/header';
import { RemixLinkButton } from '../features/shared/components/remix-link';
import { getAllMunicipalities } from '../server/municipalities.server';

export async function loader() {
    return json({
        municipalities: await getAllMunicipalities()
    });
}

export default function PublicLayout() {
    const { municipalities } = useLoaderData<typeof loader>();

    return (
        <>
            <Header
                defaultMunicipalities={municipalities.map(m => ({
                    label: m.name,
                    value: m.name
                }))}
                trailingElement={
                    <RemixLinkButton href="/auth/login" variant="hollow">
                        Connexion
                    </RemixLinkButton>
                }
            />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
