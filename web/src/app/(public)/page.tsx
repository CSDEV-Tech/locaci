// components
import Image from 'next/image';
import { SearchBar } from '~/features/search/components/search-bar';
import { MunicipalityCard } from '@locaci/ui/components/molecules/municipality-card';
import { NextLink } from '~/features/shared/components/next-link';
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';
import { PropertyHomeList } from '~/features/public/components/property-home-list';

// utils
import headerImgUrl from '~/assets/img/header-img.jpg';
import { rsc } from '~/server/trpc/rsc';
import { cache, use } from 'react';
import { clsx } from '@locaci/ui/lib/functions';

// this page should be static and only be revalidated each day
export const dynamic = 'force-static',
    revalidate = 86400; // 1 day

// types
export default async function HomePage() {
    return (
        <>
            <HeaderSection />
            <MunicipalitiesListSection />
            <LatestPropertiesSection />

            <img
                src="/street_illustration.svg"
                alt="Maison vide"
                className={clsx(
                    'mx-auto w-52 object-contain object-center',
                    'lg:w-64',
                    'xl:w-72'
                )}
            />
        </>
    );
}

const getAllMunicipalities = cache(() => rsc.geo.getAllMunicipalities.fetch());

function HeaderSection() {
    const municipalitiesPromise = getAllMunicipalities().then(result =>
        result.map(m => ({ label: m.name, value: m.id }))
    );

    return (
        <section className={'relative px-8 py-10'}>
            <div className="relative z-20 flex flex-col gap-4 md:gap-8">
                <h1
                    className={`px-8 text-center text-3xl font-bold text-white md:text-4xl`}>
                    Des logements pour tout le monde, en toute confiance
                </h1>

                <h2 className="text-center text-base font-medium text-white md:hidden">
                    Nous nous sommes associés avec plusieurs propriétaires
                    certifiés pour vous aider à trouver votre prochaine maison -
                    démarrez votre recherche ici&nbsp;
                    <span role={'img'} aria-label="Doigt pointant vers le bas">
                        👇
                    </span>
                </h2>

                <SearchBar
                    className="relative z-20 mx-auto w-full shadow-md md:w-[450px] lg:hidden"
                    defaultMunicipalities={use(municipalitiesPromise)}
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-dark-75/80" />

            {/* Bg image */}
            <Image
                src={headerImgUrl}
                alt={`Image d'entête`}
                className={`absolute inset-0 h-full object-cover object-center`}
                placeholder={'blur'}
            />
        </section>
    );
}

function MunicipalitiesListSection() {
    const municipalities = use(getAllMunicipalities())
        .filter(m => m.previewPhotoURL !== null && m._count.Property > 0)
        .slice(0, 9);
    return municipalities.length > 0 ? (
        <section className="flex flex-col gap-4 bg-gray/5 px-8 py-14">
            <h2
                className={`text-left text-2xl font-bold text-dark md:text-3xl`}>
                Recherchez par ville
            </h2>

            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {municipalities.map(m => (
                    <li key={m.id}>
                        <MunicipalityCard
                            name={m.name}
                            coverURL={m.previewPhotoURL!}
                            // @ts-ignore
                            customImage={Image}
                            customLink={NextLink}
                            noOfListings={m._count.Property}
                            href={`/search?municipalityId[label]=${m.name}&municipalityId[value]=${m.id}`}
                        />
                    </li>
                ))}
            </ul>
        </section>
    ) : (
        <></>
    );
}

function LatestPropertiesSection() {
    use(rsc.property.getRecentProperties.fetchInfinite({ limit: 4 }));

    return (
        <section className="flex flex-col gap-4  px-8 py-14">
            <h2
                className={`text-left text-2xl font-bold text-dark md:text-3xl`}>
                Nos derniers logements mis en ligne
            </h2>

            <HydrateClient state={use(rsc.dehydrate())}>
                <PropertyHomeList />
            </HydrateClient>
        </section>
    );
}
