import * as React from 'react';
import { ArrowLeft, ArrowRight } from 'phosphor-react';
import { getPageRange } from '../../lib/functions';
import { LinkButton } from '../atoms/link-button';
import { CustomLink } from '../atoms/link';

export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    getPageUrl: (page: number) => string;
    customLink?: React.ComponentType<CustomLink>;
};

export function Pagination({
    currentPage,
    getPageUrl,
    totalPages,
    customLink
}: PaginationProps) {
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    const pages = getPageRange(currentPage, totalPages);

    return (
        <nav
            className={`flex items-center gap-4`}
            aria-label="Navigation par pagination">
            {hasPreviousPage && (
                <LinkButton
                    Custom={customLink}
                    aria-label={`Page précédente`}
                    href={getPageUrl(currentPage - 1)}
                    renderLeadingIcon={cls => <ArrowLeft className={cls} />}>
                    Précédent
                </LinkButton>
            )}
            <ol className={`flex items-center gap-2`}>
                {pages.map(p => (
                    <li key={p}>
                        <LinkButton
                            Custom={customLink}
                            aria-label={`${
                                p === currentPage ? 'Page courante, ' : ''
                            }Page ${p}`}
                            aria-current={p === currentPage ? 'true' : 'false'}
                            variant={p === currentPage ? `primary` : `hollow`}
                            href={getPageUrl(currentPage)}>
                            {p}
                        </LinkButton>
                    </li>
                ))}
            </ol>
            {hasNextPage && (
                <LinkButton
                    Custom={customLink}
                    aria-label={`Page suivante`}
                    href={getPageUrl(currentPage + 1)}
                    renderTrailingIcon={cls => <ArrowRight className={cls} />}>
                    Suivant
                </LinkButton>
            )}
        </nav>
    );
}
