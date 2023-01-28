// components
import { RemixLink } from '~/www/features/shared/components/remix-link';
import { SearchBar } from '~/www/features/search/components/search-bar';
import { MunicipalityCard } from '@locaci/ui/components/molecules/municipality-card';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getAllMunicipalities } from '~/www/server/municipalities.server';

// types
import type { HeadersFunction } from '@remix-run/node';

// Cache for 1 day
export const headers: HeadersFunction = () => ({
    'cache-control': 's-maxage=86400, stale-while-revalidate'
});

export async function loader() {
    return json({
        municipalities: await getAllMunicipalities()
    });
}

export default function Index() {
    return (
        <>
            <HeroSection />
            <MunicipalitiesListSection />
            <section className={clsx('px-8 lg:px-16')}>
                <img
                    decoding="async"
                    loading="lazy"
                    src="/street_illustration.svg"
                    alt="Maison vide"
                    width={400}
                    height={300}
                    className={clsx(
                        'mx-auto w-52 object-contain object-center',
                        'md:w-[250px]',
                        'lg:w-[400px]'
                    )}
                />
            </section>
        </>
    );
}

function HeroSection() {
    const { municipalities } = useLoaderData<typeof loader>();
    return (
        <section
            className={clsx(
                'relative px-8 py-10',
                'md:py-14',
                'lg:h-[500px] lg:py-20'
            )}>
            <div
                className={clsx(
                    'relative z-20 flex flex-col gap-6',
                    'mx-auto max-w-[1200px]'
                )}>
                <h1
                    className={clsx(
                        `px-8 text-center text-3xl font-bold text-white`,
                        `md:text-left md:text-4xl`,
                        `lg:text-5xl`
                    )}>
                    Des logements pour tout le monde, en toute confiance
                </h1>

                <h2 className="font-regular flex-col px-8 text-center text-base text-white md:text-left lg:flex lg:text-xl">
                    <span>
                        Nous nous sommes associés avec plusieurs propriétaires
                        certifiés pour vous aider à trouver votre prochaine
                        maison
                    </span>
                    <span className="lg:hidden"> - </span>
                    <span>
                        Démarrez votre recherche ici&nbsp;
                        <span
                            role={'img'}
                            aria-label="Doigt pointant vers le bas">
                            👇
                        </span>
                    </span>
                </h2>

                <SearchBar
                    className={clsx(
                        'relative z-20 mx-auto w-full shadow-md',
                        'md:w-[500px]',
                        'lg:mx-8 lg:w-fit lg:shadow-none'
                    )}
                    defaultMunicipalities={municipalities.map(m => ({
                        label: m.name,
                        value: m.name
                    }))}
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-dark-75/80" />

            {/* Bg image */}
            <img
                src={`/header-img.jpg`}
                width={320}
                height={120}
                sizes={`(min-width: 640px) 100vw, 320px`}
                alt={`Entête`}
                className={`absolute inset-0 h-full w-full object-cover object-center`}
                placeholder={'blur'}
            />
        </section>
    );
}

function MunicipalitiesListSection() {
    const data = useLoaderData<typeof loader>();

    const municipalities = data.municipalities
        .filter(m => m.previewPhotoURL !== null && m.propertyCount > 0)
        .slice(0, 9);

    return municipalities.length > 0 ? (
        <section className={clsx('bg-gray/5 px-8 lg:px-16')}>
            <div
                className={clsx(
                    'flex flex-col gap-8 py-14',
                    'mx-auto max-w-[1200px]',
                    'md:gap-10 md:py-16',
                    'lg:py-32'
                )}>
                <h2
                    className={`text-left text-2xl font-bold text-dark md:text-3xl`}>
                    Recherchez par commune
                </h2>

                <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {municipalities.map(m => (
                        <li key={m.id}>
                            <MunicipalityCard
                                name={m.name}
                                coverURL={m.previewPhotoURL!}
                                customLink={RemixLink}
                                noOfListings={m.propertyCount}
                                href={`/search?municipalityId[label]=${m.name}&municipalityId[value]=${m.id}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    ) : null;
}
