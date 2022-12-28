'use client';
import * as React from 'react';

// components
import Image from 'next/image';
import { ListingImage } from '~/features/shared/types';
import { EyeIcon } from '@locaci/ui/components/atoms/icons/eye';
import { ImageLightbox } from '@locaci/ui/components/molecules/image-lightbox';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { Button } from '@locaci/ui/components/atoms/button';
import { Share } from 'phosphor-react';
import { ShareModal } from '~/features/property-detail/components/share-modal';

// types
export type HeroImageGalleryProps = {
    images: ListingImage[];
    className?: string;
    propertyLink: string;
};

export function HeroImageGallery({
    images,
    className,
    propertyLink
}: HeroImageGalleryProps) {
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isImageLightboxOpen, setIsImageLightboxOpen] = React.useState(false);
    const [startIndex, setStartIndex] = React.useState(0);

    return (
        <>
            <ShareModal
                open={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                link={propertyLink}
            />

            <ImageLightbox
                startIndex={startIndex}
                isOpen={isImageLightboxOpen}
                images={images}
                onClose={() => setIsImageLightboxOpen(false)}
            />

            <div
                className={clsx(
                    className,
                    'relative grid h-[250px]',
                    'md:h-[320px] md:grid-cols-3 md:gap-1',
                    'lg:h-[500px] lg:grid-cols-5',
                    'lg:gap-2 lg:px-8 xl:px-0'
                )}>
                <div
                    className={clsx(
                        'w-full',
                        'md:col-span-2',
                        'lg:col-span-3 lg:rounded-l-lg',
                        'group relative'
                    )}>
                    <Image
                        width={1000}
                        height={500}
                        sizes="(max-width: 768px) 640w, (max-width: 1200px) 1080w, 1920w"
                        alt="Image 1 du logement"
                        src={images[0].uri}
                        className={clsx(
                            'h-[250px] w-full bg-gray object-cover object-center',
                            'md:h-[320px]',
                            'lg:h-[500px] lg:rounded-l-lg',
                            'relative'
                        )}
                    />

                    <button
                        onClick={() => {
                            setStartIndex(0);
                            setIsImageLightboxOpen(true);
                        }}
                        className={clsx(
                            'absolute inset-0 w-full cursor-pointer bg-dark-75/80 opacity-0',
                            'flex items-center justify-center',
                            'transition duration-200',
                            'group-hover:opacity-100 group-active:opacity-100',
                            'lg:rounded-l-lg'
                        )}>
                        <div className="flex flex-col items-center text-white">
                            <EyeIcon className="h-8 w-8" />
                            <span>Voir en grand</span>
                        </div>
                    </button>
                </div>

                <div
                    className={clsx(
                        'hidden',
                        'md:col-span-1 md:grid md:gap-1',
                        'lg:col-span-2 lg:gap-2'
                    )}>
                    <div className="group relative">
                        <Image
                            alt="Image 2 du logement"
                            src={images[1].uri}
                            width={500}
                            height={300}
                            className={clsx(
                                'h-full w-full bg-gray object-cover object-center',
                                'md:h-[158px]',
                                'lg:h-[246px] lg:rounded-tr-lg'
                            )}
                        />

                        <button
                            onClick={() => {
                                setStartIndex(1);
                                setIsImageLightboxOpen(true);
                            }}
                            className={clsx(
                                'absolute inset-0 w-full cursor-pointer bg-dark-75/80 opacity-0',
                                'flex items-center justify-center',
                                'transition duration-200',
                                'group-hover:opacity-100 group-active:opacity-100',
                                'lg:rounded-tr-lg'
                            )}>
                            <div className="flex flex-col items-center text-white">
                                <EyeIcon className="h-8 w-8" />
                                <span>Voir en grand</span>
                            </div>
                        </button>
                    </div>

                    <div className="group relative">
                        <Image
                            alt="Image 2 du logement"
                            src={images[2].uri}
                            width={500}
                            height={300}
                            className={clsx(
                                'h-full w-full bg-gray object-cover object-center',
                                'md:h-[158px]',
                                'lg:h-[246px] lg:rounded-br-lg'
                            )}
                        />

                        <button
                            onClick={() => {
                                setStartIndex(2);
                                setIsImageLightboxOpen(true);
                            }}
                            className={clsx(
                                'absolute inset-0 w-full cursor-pointer bg-dark-75/80 opacity-0',
                                'flex items-center justify-center',
                                'transition duration-200',
                                'group-hover:opacity-100 group-active:opacity-100',
                                'lg:rounded-br-lg'
                            )}>
                            <div className="flex flex-col items-center text-white">
                                <EyeIcon className="h-8 w-8" />
                                <span>Voir en grand</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 lg:right-12">
                    <Button
                        onClick={() => setIsShareModalOpen(true)}
                        variant="hollow"
                        className="border border-dark"
                        renderLeadingIcon={cls => <Share className={cls} />}>
                        Partager
                    </Button>
                    <Button
                        onClick={() => setIsImageLightboxOpen(true)}
                        variant="hollow"
                        className="border border-dark"
                        renderLeadingIcon={cls => <EyeIcon className={cls} />}>
                        Voir les photos
                    </Button>
                </div>
            </div>
        </>
    );
}
