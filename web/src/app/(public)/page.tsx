// components
import Image from 'next/image';
import { SearchBar } from '~/features/search/components/search-bar';

// utils
import { rsc } from '~/server/trpc/rsc';
import { use } from 'react';
import HeaderImg from '~/assets/img/header-img.jpg';

// this page should be static and only be revalidated each day
export const dynamic = 'force-static',
    revalidate = 86400; // 1 day

// types
export default async function IndexPage() {
    return (
        <>
            <HeaderSection />
        </>
    );
}

function HeaderSection() {
    const municipalitiesPromise = rsc.geo.getAllMunicipalities
        .fetch()
        .then(result => result.map(m => ({ label: m.name, value: m.id })));

    return (
        <>
            <section className={'relative px-8 py-10'}>
                <div className="relative z-20 flex flex-col gap-4 md:gap-8">
                    <h1
                        className={`px-8 text-center text-3xl font-bold text-white md:text-4xl`}>
                        Des logements adaptés à tous les besoins, disponibles en
                        quelques clics
                    </h1>

                    <h2 className="text-center text-base font-medium text-white md:hidden">
                        Trouvez votre prochaine maison - qu'il s'agisse d'un
                        appartement, d'un studio, meublé ou non meublé - tout en
                        un seul et même endroit
                        <span
                            role={'img'}
                            aria-label="Doigt pointant vers le bas">
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
                    src={HeaderImg}
                    alt={`Image d'entête`}
                    className={`absolute inset-0 h-full object-cover object-center`}
                    placeholder={'blur'}
                />
            </section>
        </>
    );
}
