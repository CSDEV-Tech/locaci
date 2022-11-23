import { env } from '~/env/server.mjs';
import { SeoData } from '~/types';
import { linkWithSlash } from '~/utils/functions';

export function Meta(props: SeoData) {
    const title =
        props.title ?? 'Trouvez votre prochain Logement en quelques clics';
    const description =
        props.description ??
        "Découvrez le premier logiciel de gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.";

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
            <link rel="icon" href={`${env.NEXT_PUBLIC_SITE_URL}/favicon.svg`} />
            <meta name="charset" content={'utf-8'} />
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
