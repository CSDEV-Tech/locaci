'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { ResponsiveModal } from '~/features/shared/components/responsive-modal';
import {
    ChatCircleText,
    FacebookLogo,
    MessengerLogo,
    WhatsappLogo
} from 'phosphor-react';

// utils
import { toast } from 'react-hot-toast';
import { isMobileOrTablet } from '~/utils/functions';
import { env } from '~/env/client.mjs';

// types
export type ShareModalProps = {
    open: boolean;
    onClose: () => void;
    link: string;
};

export function ShareModal({ onClose, open, link }: ShareModalProps) {
    return (
        <>
            <ResponsiveModal
                maxHeightRatio={0.7}
                title="Partager le logement"
                isOpen={open}
                onClose={onClose}>
                <ShareModalContent link={link} />
            </ResponsiveModal>
        </>
    );
}

function ShareModalContent({ link }: Pick<ShareModalProps, 'link'>) {
    async function copyToClipBoard() {
        await navigator.clipboard.writeText(link);
        toast.success('Lien copié dans votre presse-papier.');
    }

    const waRef = React.useRef<HTMLAnchorElement>(null);
    const messengerRef = React.useRef<HTMLAnchorElement>(null);
    const text = `Découvrez ce logement sur LOCACI : ${link}`;

    React.useEffect(() => {
        setShareLinks();
    });

    /**
     * Set whatsapp & messenger links to mobile href when
     * the user agent is a mobile, so that it opens an app instead of
     * a new tab, in desktop, it will open a new tab.
     */
    function setShareLinks() {
        if (waRef.current) {
            waRef.current.setAttribute(
                'href',
                isMobileOrTablet()
                    ? `whatsapp://send?text=${encodeURI(text)}`
                    : `https://web.whatsapp.com/send?text=${encodeURI(text)}`
            );
        }

        if (messengerRef.current) {
            messengerRef.current.setAttribute(
                'href',
                isMobileOrTablet()
                    ? `fb-messenger://share/?link=${encodeURI(link)}&app_id=${
                          env.NEXT_PUBLIC_FACEBOOK_APP_ID
                      }`
                    : `http://www.facebook.com/dialog/send?app_id=${
                          env.NEXT_PUBLIC_FACEBOOK_APP_ID
                      }&link=${encodeURI(link)}&redirect_uri=${
                          env.NEXT_PUBLIC_SITE_URL
                      }`
            );
        }
    }

    return (
        <div className={`flex flex-col items-start gap-6 py-10 px-6`}>
            <h2 className="text-left text-2xl font-extrabold leading-normal md:text-3xl">
                Partagez ce logement avec des proches
            </h2>

            <div className="flex w-full flex-col gap-2">
                <h3 className="text-gray">Lien vers le logement</h3>
                <div className="flex items-center justify-between gap-2 bg-primary-15 p-4">
                    <span className="break-all">{link}</span>
                    <Button variant="dark" onClick={copyToClipBoard}>
                        Copier
                    </Button>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <h3 className="text-gray">Partager sur les réseaux sociaux</h3>
                <div className="grid w-full grid-cols-2 place-content-stretch gap-4">
                    <a
                        target={`_blank`}
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
                            link
                        )}`}
                        className="flex items-center gap-2 rounded-md border px-8 py-4 ring-gray/50 hover:bg-gray/20 focus:ring active:ring">
                        <FacebookLogo className={`h-6 w-6`} />
                        <span>Facebook</span>
                    </a>

                    <a
                        target={`_blank`}
                        ref={waRef}
                        href={`#`}
                        data-action="share/whatsapp/share"
                        className="flex items-center gap-2 rounded-md border px-8 py-4 ring-gray/50 hover:bg-gray/20 focus:ring active:ring">
                        <WhatsappLogo className={`h-6 w-6`} />
                        <span>Whatsapp</span>
                    </a>

                    <a
                        target={`_blank`}
                        ref={messengerRef}
                        href={`#`}
                        className="flex items-center gap-2 rounded-md border px-8 py-4 ring-gray/50 hover:bg-gray/20 focus:ring active:ring">
                        <MessengerLogo className={`h-6 w-6`} />
                        <span>Messenger</span>
                    </a>

                    <a
                        href={`sms:?&body=${encodeURI(text)}`}
                        className="flex items-center gap-2 rounded-md border px-8 py-4 ring-gray/50 hover:bg-gray/20 focus:ring active:ring">
                        <ChatCircleText className={`h-6 w-6`} />
                        <span>SMS</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
