import * as React from 'react';
import { Breadcrumb } from '@locaci/ui';
import type { BreadcrumbItem } from '@locaci/ui';
import { NextLink } from '@/features/shared/components/next-link';

export type NextBreadcrumbProps = {
    links: BreadcrumbItem[];
    className?: string;
};

export function NextBreadcrumb({ links, className }: NextBreadcrumbProps) {
    return (
        <Breadcrumb items={links} customLink={NextLink} className={className} />
    );
}
