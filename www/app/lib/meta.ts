import type { HtmlMetaDescriptor } from '@remix-run/node';
import { getAbsoluteURLForImage, linkWithSlash } from './functions';

export type MetaTags = {
    title?: string;
    description?: string;
    imageURL?: string;
    pathname?: string;
    type?: 'website' | 'article';
    articlePublishedAt?: Date;
    baseURL: string;
};

export function getMetaTags(tags?: MetaTags) {
    const title =
        tags?.title ?? 'Trouvez votre prochain Logement en quelques clics';
    const description =
        tags?.description ??
        "Découvrez le premier site de recherche et gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.";

    const contentType = tags?.type ?? 'website';

    const metaImgURL = tags?.imageURL
        ? getAbsoluteURLForImage(tags.imageURL, tags.baseURL)
        : `${tags?.baseURL}/logo.png`;

    const url = `${tags?.baseURL}${linkWithSlash(tags?.pathname ?? '')}`;

    const meta = {
        title: `${title} | LOCACI`,
        description,
        'og:type': contentType,
        'og:url': url,
        'og:image': metaImgURL,
        'og:title': `${title} | LOCACI`,
        'og:description': description,
        'twitter:url': url,
        'twitter:title': `${title} | LOCACI`,
        'twitter:description': description,
        'twitter:card': 'summary_large_image' as const,
        'twitter:image': metaImgURL,
        charSet: 'utf-8' as const,
        viewport: 'width=device-width,initial-scale=1' as const
    } as HtmlMetaDescriptor;

    if (tags?.articlePublishedAt) {
        meta['article:published_time'] = tags.articlePublishedAt.toISOString();
    }

    return meta;
}

// WTF REMIX ???
export function getLinks(links: Pick<MetaTags, 'baseURL' | 'pathname'>) {
    const url = `${links.baseURL}${linkWithSlash(links.pathname ?? '')}`;

    return {
        rel: 'canonical',
        url
    };
}
