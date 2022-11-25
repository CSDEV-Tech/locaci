import { usePathname, useSelectedLayoutSegment } from 'next/navigation';

import type { BreadcrumbItem } from '@locaci/ui/components/molecules/breadcrumb';

export function useHeaderBreadcrumbs(): BreadcrumbItem[] {
    const path = usePathname();

    const selectedSegment = useSelectedLayoutSegment();
    const items: BreadcrumbItem[] = [
        {
            href: `/owner`,
            label: `Tableau de bord`
        }
    ];

    switch (selectedSegment) {
        case 'add-listing':
            items.push({
                href: `/owner/add-listing`,
                label: `Nouvelle annonce`
            });
            break;
    }

    return items;
}
