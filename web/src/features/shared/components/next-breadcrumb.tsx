'use client';
import {
    Breadcrumb,
    type BreadcrumbItem
} from '@locaci/ui/components/molecules/breadcrumb';
import { NextLink } from '~/features/shared/components/next-link';

export type NextBreadcrumbProps = {
    links: BreadcrumbItem[];
    className?: string;
};

export function NextBreadcrumb({ links, className }: NextBreadcrumbProps) {
    return (
        <Breadcrumb items={links} customLink={NextLink} className={className} />
    );
}
