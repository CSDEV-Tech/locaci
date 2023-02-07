import * as React from 'react';
import { ArrowLeftIcon } from '../atoms/icons/arrow-left';
import { ArrowRightIcon } from '../atoms/icons/arrow-right';
import { getPageRange } from '../../lib/functions';
import { LinkButton } from '../atoms/link-button';
import { CustomLink } from '../atoms/link';

export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    getPageUrl: (page: number) => string;
    customLink?: React.ComponentType<CustomLink>;
    onNavigate?: (page: number) => void;
};

export function Pagination({
    currentPage,
    getPageUrl,
    totalPages,
    customLink,
    onNavigate
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
                    onClick={e => {
                        onNavigate?.(currentPage - 1);
                    }}
                    Custom={customLink}
                    aria-label={`Page précédente`}
                    href={getPageUrl(currentPage - 1)}
                    renderLeadingIcon={cls => (
                        <ArrowLeftIcon className={cls} />
                    )}>
                    <span className="hidden md:inline">Précédent</span>
                </LinkButton>
            )}
            <ol className={`flex items-center gap-2`}>
                {pages.map(p => (
                    <li key={p}>
                        <LinkButton
                            onClick={e => {
                                onNavigate?.(p);
                            }}
                            Custom={customLink}
                            aria-label={`${
                                p === currentPage ? 'Page courante, ' : ''
                            }Page ${p}`}
                            aria-current={p === currentPage ? 'true' : 'false'}
                            variant={p === currentPage ? `primary` : `hollow`}
                            href={getPageUrl(p)}>
                            {p}
                        </LinkButton>
                    </li>
                ))}
            </ol>
            {hasNextPage && (
                <LinkButton
                    onClick={e => {
                        onNavigate?.(currentPage + 1);
                    }}
                    Custom={customLink}
                    aria-label={`Page suivante`}
                    href={getPageUrl(currentPage + 1)}
                    renderTrailingIcon={cls => (
                        <ArrowRightIcon className={cls} />
                    )}>
                    <span className="hidden md:inline">Suivant</span>
                </LinkButton>
            )}
        </nav>
    );
}
