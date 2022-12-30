import * as React from 'react';
import { clsx } from '../../lib/functions';
import { Button } from '../atoms/button';
import { CaretLeftIcon } from '../atoms/icons/caret-left';
import { CaretRightIcon } from '../atoms/icons/caret-right';
import { XIcon } from '../atoms/icons/x';
import { createPortal } from 'react-dom';
import { Transition } from '@headlessui/react';

import useEmblaCarousel from 'embla-carousel-react';

export type ImageLightboxProps = {
    className?: string;
    images: { uri: string; name: string }[];
    onClose: () => void;
    isOpen: boolean;
    startIndex?: number;
};

export function ImageLightbox({
    className,
    images,
    onClose,
    isOpen,
    startIndex = 0
}: ImageLightboxProps) {
    const [emblaRef, embla] = useEmblaCarousel({ loop: true, startIndex });
    const [selectedIndex, setSelectedIndex] = React.useState(startIndex);
    const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

    const scrollPrev = React.useCallback(
        () => embla && embla.scrollPrev(),
        [embla]
    );
    const scrollNext = React.useCallback(
        () => embla && embla.scrollNext(),
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

    React.useEffect(() => {
        if (isOpen) {
            cancelButtonRef.current?.focus();
        }

        // Hide all elements from screen readers
        const elementsToHide = document.querySelectorAll(`main,header,footer`);
        const body = document.querySelector('body');

        for (let i = 0; i < elementsToHide.length; i++) {
            const element = elementsToHide[i];
            if (isOpen) {
                element.setAttribute(`aria-hidden`, 'true');
                (element as HTMLElement).style.overflow = 'hidden';
            } else {
                element.removeAttribute('aria-hidden');
                (element as HTMLElement).style.removeProperty('overflow');
            }
        }

        if (body) {
            if (isOpen) {
                body.style.overflow = 'hidden';
            } else {
                body.style.removeProperty('overflow');
            }
        }
    }, [isOpen]);

    React.useEffect(() => {
        const listener = function (ev: KeyboardEvent) {
            const evt = ev || window.event;
            switch (evt.key) {
                case 'Escape':
                case 'Esc':
                    onClose();
                    break;
                case 'ArrowLeft':
                    scrollPrev();
                    break;
                case 'ArrowRight':
                    scrollNext();
                    break;
            }
        };

        document.addEventListener('keydown', listener);
        return () => document.removeEventListener('keydown', listener);
    }, [scrollPrev, scrollNext]);

    return isOpen ? (
        createPortal(
            <>
                <Transition appear show={isOpen} as={React.Fragment}>
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <div className="fixed inset-0 z-30 bg-dark/80" />
                    </Transition.Child>
                </Transition>

                <div
                    className={clsx(
                        className,
                        'fixed inset-0 z-[100] py-4',
                        'flex h-full w-full flex-col gap-4',
                        'lg:py-8'
                    )}>
                    <div className="flex justify-between px-4 lg:px-8">
                        <span className="text-white">
                            <strong className="font-bold" aria-hidden={`true`}>
                                {selectedIndex + 1}
                            </strong>
                            &nbsp;/&nbsp;{images.length}
                        </span>

                        <span className="sr-only" aria-live="assertive">
                            Image {selectedIndex + 1} sur {images.length}
                        </span>

                        <Button
                            onClick={onClose}
                            renderTrailingIcon={cls => (
                                <XIcon className={cls} />
                            )}>
                            Fermer
                        </Button>
                    </div>

                    <div
                        className={clsx(
                            'h-full w-full overflow-x-hidden',
                            'flex items-center gap-4',
                            'md:px-4 lg:px-8'
                        )}>
                        <Button
                            square
                            onClick={scrollPrev}
                            className={`hidden md:flex`}
                            aria-label="Aller à l'image précédente"
                            renderLeadingIcon={cls => (
                                <CaretLeftIcon className={cls} />
                            )}
                        />

                        <div
                            className="h-full w-full overflow-hidden"
                            ref={emblaRef}>
                            <ul className="flex h-full w-full">
                                {images.map((image, index) => (
                                    <li
                                        className="flex min-w-0 flex-shrink-0 flex-grow-0 basis-full"
                                        key={image.uri}>
                                        <Transition
                                            appear
                                            show={isOpen}
                                            as={React.Fragment}>
                                            <Transition.Child
                                                as={React.Fragment}
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0">
                                                <img
                                                    src={image.uri}
                                                    loading={`lazy`}
                                                    alt={`Image ${index}`}
                                                    className="w-full object-contain object-center"
                                                />
                                            </Transition.Child>
                                        </Transition>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            square
                            onClick={scrollNext}
                            className={`hidden md:flex`}
                            aria-label="Aller à l'image suivante"
                            renderLeadingIcon={cls => (
                                <CaretRightIcon className={cls} />
                            )}
                        />
                    </div>
                </div>
            </>,
            document.body
        )
    ) : (
        <></>
    );
}
