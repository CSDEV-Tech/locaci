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
        case 'properties':
            items.push({
                href: `${path}#`,
                label: `Modification annonce`
            });
            break;
    }

    return items;
}
