import { env } from '~/env/server.mjs';
import { linkWithSlash } from '~/utils/functions';

export type MetaProps = {
    title?: string;
    description?: string;
    imageURL?: string;
    pathname?: string;
};

export function Meta(props: MetaProps) {
    const title =
        props.title ?? 'Trouvez votre prochain Logement en quelques clics';
    const description =
        props.description ??
        "Découvrez le premier site de recherche et gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.";

    const metaImgURL = props.imageURL
        ? `${env.NEXT_PUBLIC_SITE_URL}${props.imageURL}`
        : `${env.NEXT_PUBLIC_SITE_URL}/logo.svg`;
    const url = `${env.NEXT_PUBLIC_SITE_URL}${linkWithSlash(
        props.pathname ?? ''
    )}`;

    return (
        <>
            {/* General */}
            <title>{`${title} | LOCACI`}</title>
            <link rel="canonical" href={url} />
            <meta name="description" content={description} />

            {/*Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={metaImgURL} />
            <meta property="og:title" content={`${title} | LOCACI`} />
            <meta property="og:description" content={description} />

            {/* Twitter */}
            <meta property="twitter:url" content={url} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={`${title} | LOCACI`} />
            <meta property="twitter:description" content={description} />
            <meta name="twitter:image" content={metaImgURL} />
        </>
    );
}
