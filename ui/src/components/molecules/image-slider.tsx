import * as React from 'react';
import type { CustomImageComponentType } from './dashboard-property-card';
import useEmblaCarousel from 'embla-carousel-react';
import { clsx } from '../../lib/functions';

export type ImageSliderProps = {
    imageURIs: string[];
    className?: string;
    customImage?: CustomImageComponentType;
};

export function ImageSlider({
    imageURIs,
    className,
    customImage
}: ImageSliderProps) {
    const [emblaRef, embla] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const goTo = React.useCallback(
        (index: number) => embla && embla.scrollTo(index),
        [embla]
    );

    const onSelect = React.useCallback(() => {
        if (!embla) return;

        setSelectedIndex(embla.selectedScrollSnap());
    }, [embla]);

    React.useEffect(() => {
        if (!embla) return;
        onSelect();

        embla.on('select', onSelect);
    }, [embla]);

    const Img = customImage ?? 'img';

    return (
        <div
            className={clsx(
                'h-full w-full overflow-x-hidden rounded-t-lg',
                'relative z-20 flex items-center gap-4',
                className
            )}>
            <div className="h-full w-full overflow-hidden" ref={emblaRef}>
                <ul className="flex h-full w-full">
                    {imageURIs.map((uri, index) => (
                        <li
                            className="flex min-w-0 flex-shrink-0 flex-grow-0 basis-full"
                            key={`image-${uri}`}>
                            <Img
                                width={370}
                                height={200}
                                src={uri}
                                loading={`lazy`}
                                alt={`Image ${index}`}
                                className="w-full rounded-t-lg object-cover object-center"
                            />
                        </li>
                    ))}
                </ul>
            </div>

            <ul className="absolute bottom-0 left-0 right-0 z-10 flex h-12 items-center justify-center gap-2 bg-gradient-to-b from-transparent to-black/50">
                {imageURIs.map((uri, index) => (
                    <li key={`thumb-${uri}`} className={`flex items-center`}>
                        <button
                            className={clsx('rounded-full', {
                                'h-3 w-3 bg-gray-300/80':
                                    selectedIndex !== index,
                                'h-4 w-4 bg-white': selectedIndex === index
                            })}
                            aria-label={`Aller à la page ${index + 1}`}
                            onClick={() => goTo(index)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
