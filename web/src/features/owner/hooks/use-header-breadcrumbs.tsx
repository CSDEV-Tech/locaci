import { usePathname } from 'next/navigation';

import type { BreadcrumbItem } from '@locaci/ui/components/molecules/breadcrumb';

export function useHeaderBreadcrumbs(): BreadcrumbItem[] {
    const path = usePathname();

    return [
        {
            href: `/owner`,
            label: `Tableau de bord`
        }
    ];
}
