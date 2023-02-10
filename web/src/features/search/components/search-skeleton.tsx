// components
import { Skeleton } from '@locaci/ui/components/atoms/skeleton';

// utils
import { clsx, range } from '@locaci/ui/lib/functions';

type SearchSkeletonProps = {
    hideMap?: boolean;
};

export function SearchSkeleton({ hideMap = false }: SearchSkeletonProps) {
    return (
        <div
            className={clsx('w-full', {
                'grid lg:grid-cols-5 xl:grid-cols-8': !hideMap,
                'lg:col-span-3 xl:col-span-5': hideMap
            })}>
            <section
                className={clsx('grid w-full items-start gap-4  py-8 ', {
                    'px-4 md:px-8 lg:col-span-3 xl:col-span-5': !hideMap
                })}>
                <h1 className="text-2xl font-semibold">
                    Chargement de vos logements...
                </h1>

                <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {range(0, 6).map(i => (
                        <li key={i}>
                            <PropertySkeleton />
                        </li>
                    ))}
                </ul>
            </section>

            {/* Map */}
            {!hideMap && (
                <section className="sticky top-0 hidden lg:col-span-2 lg:block xl:col-span-3">
                    <Skeleton
                        aria-label="chargement de votre carte"
                        className="h-full w-full"
                    />
                </section>
            )}
        </div>
    );
}

export function PropertySkeleton() {
    return (
        <article className="flex flex-col">
            <div
                className={clsx(
                    'flex flex-shrink-0 items-center justify-center bg-gray/20',
                    'h-[200px] w-full rounded-t-lg'
                )}>
                <Skeleton className="h-full w-full rounded-t-lg" />
            </div>

            <div className="flex h-full flex-col justify-between gap-2 p-4">
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 rounded-md" />
                <Skeleton className="h-5 w-[200px] rounded-md" />
                <Skeleton className="mt-4 h-6 w-[150px] rounded-md" />
            </div>
        </article>
    );
}
