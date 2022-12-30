// components
import Image from 'next/image';
import { SearchBar } from '~/features/search/components/search-bar';
import { MunicipalityCard } from '@locaci/ui/components/molecules/municipality-card';
import { QuotesIcon } from '@locaci/ui/components/atoms/icons/quotes';
import {
    NextLink,
    NextLinkButton
} from '~/features/shared/components/next-link';
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';
import { PropertyHomeList } from '~/features/public/components/property-home-list';
import { SwitchUserMarketingTabs } from '~/features/public/components/switch-user-marketing-tabs';
import { MagnifyIngGlassIcon } from '@locaci/ui/components/atoms/icons/magnifying-glass';
import { HouseIcon } from '@locaci/ui/components/atoms/icons/house';

// utils
import headerImgUrl from '~/assets/img/header-img.jpg';
import ceoImgUrl from '~/assets/img/temomane.jpg';
import { rsc } from '~/server/trpc/rsc';
import { use } from 'react';
import { clsx } from '@locaci/ui/lib/functions';
import { getAllMunicipalities } from '~/server/trpc/rsc/cached-queries';

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
            <SectionForWho />
            <SectionAboutUs />

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

function HeaderSection() {
    const municipalitiesPromise = getAllMunicipalities().then(result =>
        result.map(m => ({ label: m.name, value: m.id }))
    );

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
                    defaultMunicipalities={use(municipalitiesPromise)}
                />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-dark-75/80" />

            {/* Bg image */}
            <Image
                src={headerImgUrl}
                priority
                fill
                alt={`Image d'entête`}
                className={`absolute inset-0 h-full w-full object-cover object-center`}
                placeholder={'blur'}
            />
        </section>
    );
}

function MunicipalitiesListSection() {
    const municipalities = use(getAllMunicipalities())
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
                                // @ts-ignore
                                customImage={Image}
                                customLink={NextLink}
                                noOfListings={m.propertyCount}
                                href={`/search?municipalityId[label]=${m.name}&municipalityId[value]=${m.id}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    ) : // We use null because react server components cannot serialize Fragments
    null;
}

function LatestPropertiesSection() {
    const { pages } = use(
        rsc.property.getRecentProperties.fetchInfinite({
            limit: 6
        })
    );

    return pages[0].properties.length > 0 ? (
        <section className="px-8 lg:px-16">
            <div
                className={clsx(
                    'flex flex-col gap-8 py-14',
                    'mx-auto max-w-[1200px]',
                    'md:gap-10 md:py-16',
                    'lg:py-32'
                )}>
                <h2
                    className={`text-left text-2xl font-bold text-dark md:text-3xl`}>
                    Nos derniers logements mis en ligne
                </h2>

                <HydrateClient state={use(rsc.dehydrate())}>
                    <PropertyHomeList />
                </HydrateClient>
            </div>
        </section>
    ) : // We use null because react server components cannot serialize Fragments
    null;
}

function SectionForWho() {
    const UserContent = () => (
        <div className="flex flex-col items-stretch gap-8 lg:items-start">
            <div className="flex flex-col gap-4">
                <h3
                    className={`w-full text-left text-xl font-semibold text-dark md:text-2xl`}>
                    Un outil de recherche&nbsp;
                    <span className="hidden text-primary lg:inline">
                        pour les futurs locataires
                    </span>
                </h3>
                <p className="lg:text-lg">
                    <span className="font-semibold">LOCACI</span> une
                    application web créée par CSDEV TECHNOLOGY qui vous permet
                    de rechercher le logement qui vous convient, en fonction de
                    critères que vous aurez saisis, parmi un catalogue de
                    bailleurs vérifiés. LOCACI vous permet aussi de consulter
                    les détails d'un appartement occupé par le dernier
                    locataire, ce qui vous permet de mieux appréhender le bien
                    que vous souhaitez louer.
                </p>
            </div>

            <NextLinkButton href="/search" variant="primary">
                <MagnifyIngGlassIcon className={`h-5 w-5`} weight={`bold`} />
                <span>Commencez votre recherche</span>
            </NextLinkButton>
        </div>
    );

    const OwnerContent = () => (
        <div className="flex flex-col items-stretch gap-4 lg:items-start">
            <h3
                className={`w-full text-left text-xl font-semibold text-dark md:text-2xl`}>
                Un logiciel de gestion de votre logement&nbsp;
                <span className="hidden text-primary lg:inline">
                    pour les propriétaires
                </span>
            </h3>
            <p className="lg:text-lg">
                <span className="font-semibold">LOCACI</span> vous offre un
                outil complet pour gérer les annonces de votre logement, créer
                de manière automatisée les documents de votre logement et suivre
                l'état des lieux de celui-ci.
            </p>

            <NextLinkButton href="/auth/request-owner" variant="primary">
                <HouseIcon className={`h-5 w-5`} weight={`bold`} />
                <span>Devenir propriétaire</span>
            </NextLinkButton>
        </div>
    );

    return (
        <section className={clsx('bg-gray/5 px-8 lg:px-16')}>
            <div
                className={clsx(
                    'flex flex-col gap-8 py-10',
                    'mx-auto max-w-[1200px]',
                    'md:items-center md:gap-10',
                    'lg:py-32'
                )}>
                <h2
                    className={`w-full text-left text-2xl font-bold text-dark md:text-3xl`}>
                    C'est quoi LOCACI ?
                </h2>

                <SwitchUserMarketingTabs
                    className="lg:hidden"
                    userContent={<UserContent />}
                    ownerContent={<OwnerContent />}
                />

                <div className="hidden lg:block">
                    <UserContent />
                </div>
                <div className="hidden lg:block">
                    <OwnerContent />
                </div>
            </div>
        </section>
    );
}

function SectionAboutUs() {
    return (
        <section className={clsx('px-8 lg:px-16')}>
            <div
                className={clsx(
                    'flex flex-col gap-8 py-10',
                    'mx-auto max-w-[1200px]',
                    'md:items-center md:gap-10',
                    'lg:py-32'
                )}>
                <h2
                    className={`w-full text-left text-2xl font-bold text-dark md:text-3xl`}>
                    Pourquoi LOCACI ?
                </h2>

                <blockquote
                    className={clsx(
                        'relative flex flex-col text-lg italic',
                        'md:flex-row md:items-center'
                    )}>
                    <QuotesIcon
                        className={clsx(
                            `relative z-10 h-10 w-10 flex-shrink-0 -scale-x-100 text-dark/20`,
                            'md:-top-4 md:left-4 md:self-start',
                            'md:h-14 md:w-14'
                        )}
                        weight="fill"
                    />
                    <div className="relative z-20 flex flex-col gap-1.5">
                        <p>
                            J'ai constaté qu'il était&nbsp;
                            <strong className="font-bold">
                                très compliqué
                            </strong>
                            &nbsp;de trouver un logement. J'ai du passer par les
                            réseaux sociaux, des démarcheurs vendeurs
                            d'illusions, tout cet épuisement sans trouver le
                            logement qui me correspondait à 100%.
                        </p>

                        <p>
                            C'est pourquoi j'ai rassemblé une équipe pour
                            réfléchir à la question : comment faciliter la
                            recherche de logements ? Comment avoir accès aux
                            détails des biens proposés ? Et après l'acquisition
                            du logement, que se passe-t'il ?
                        </p>

                        <p>
                            C'est en réponse à ces interrogations que nous avons
                            développé&nbsp;
                            <strong className="font-bold">LOCACI</strong>.
                        </p>
                    </div>
                    <QuotesIcon
                        className={clsx(
                            `relative z-10 h-10 w-10 flex-shrink-0 text-dark/20`,
                            'md:-bottom-4 md:right-4 md:self-end',
                            'md:h-14 md:w-14'
                        )}
                        weight="fill"
                    />
                </blockquote>

                <div className="flex items-center gap-4">
                    <Image
                        src={ceoImgUrl}
                        alt={`photo CEO`}
                        className={`h-[64px] w-[64px] rounded-full`}
                        width={64}
                        height={64}
                    />

                    <div className="flex flex-col gap-1">
                        <strong className="text-lg font-semibold">
                            Temomane DE SANZO
                        </strong>
                        <small className="text-gray">CEO de CSDEV</small>
                    </div>
                </div>
            </div>
        </section>
    );
}
