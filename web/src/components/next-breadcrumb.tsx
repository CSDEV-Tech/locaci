import * as React from 'react';
import { Breadcrumb } from '@locaci/ui';
import type { BreadcrumbItem } from '@locaci/ui';
import { NextLink } from './next-link';

export type NextBreadcrumbProps = {
    links: BreadcrumbItem[];
};

export function NextBreadcrumb({ links }: NextBreadcrumbProps) {
    return <Breadcrumb links={links} customLink={NextLink} />;
}
