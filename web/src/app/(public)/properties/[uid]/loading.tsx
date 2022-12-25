// components
import { Skeleton } from '@locaci/ui/components/atoms/skeleton';

// utils
import { clsx } from '@locaci/ui/lib/functions';

export default function Loading() {
    return (
        <section
            className={clsx(
                'mt-4 flex max-w-[1200px] flex-col gap-4 pb-20',
                'lg:gap-8'
            )}>
            <span className="sr-only">Chargement de votre logement...</span>
            <div
                className={clsx(
                    'grid h-[250px]',
                    'md:h-[320px] md:grid-cols-3 md:gap-1',
                    'lg:h-[500px] lg:grid-cols-5',
                    'lg:gap-2 lg:px-8'
                )}>
                <Skeleton
                    className={clsx(
                        'h-full w-full',
                        'md:col-span-2 md:border-r',
                        'lg:col-span-3 lg:rounded-l-lg'
                    )}
                />

                <div
                    className={clsx(
                        'hidden',
                        'md:col-span-1 md:grid md:gap-1',
                        'lg:col-span-2 lg:gap-2'
                    )}>
                    <Skeleton
                        className={clsx('h-full w-full', 'lg:rounded-tr-lg')}
                    />

                    <Skeleton
                        className={clsx('h-full w-full', 'lg:rounded-br-lg')}
                    />
                </div>
            </div>

            <div
                className={clsx(
                    'flex max-w-[650px] flex-col gap-2 px-4',
                    'lg:gap-4 lg:px-8'
                )}>
                <Skeleton roundedCorners className="h-[30px] w-2/3" />
                <Skeleton roundedCorners className="h-[15px] w-full" />
            </div>
        </section>
    );
}
