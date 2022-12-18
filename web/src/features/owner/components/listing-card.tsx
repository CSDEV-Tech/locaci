'use client';
import * as React from 'react';

// components
import { PropertyCard } from '@locaci/ui/components/molecules/property-card';
import { HorizontalPropertyCard } from '@locaci/ui/components/molecules/horizontal-property-card';
import { NextLink } from '~/features/shared/components/next-link';
import Image from 'next/image';
import { Copy, Eye, PencilSimple, TrashSimple } from 'phosphor-react';
import { DropdownItem } from '@locaci/ui/components/molecules/dropdown';
import { DeleteConfirmationModal } from './delete-confirmation-modal';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { t } from '~/utils/trpc-rq-hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Uuid } from '~/utils/uuid';

// types
import type { PropertyCardProps } from '@locaci/ui/components/molecules/property-card';

export type ListingCardProps = Omit<
    PropertyCardProps,
    'customLink' | 'customImage' | 'actionBar'
> & {
    id: string;
};

export function ListingCard({
    id,
    isDraft,
    href,
    title,
    ...props
}: ListingCardProps) {
    // state
    const router = useRouter();
    const [deletedPropertiesIds, setDeletedPropertiesIds] = React.useState<
        string[]
    >([]);
    const [_, startTransition] = React.useTransition();
    const [isModalConfirmationOpen, setModalConfirmationOpenState] =
        React.useState(false);

    // mutations
    const { mutate: deleteDraft } = t.owner.draft.deleteDraft.useMutation({
        onSuccess() {
            startTransition(() => router.refresh());
            toast.success(`Ce brouillon a bien été supprimé`);
        }
    });

    const { mutate: deleteProperty } =
        t.owner.property.deleteProperty.useMutation({
            onSuccess() {
                startTransition(() => router.refresh());
                toast.success(`Votre logement a bien été supprimé`);
            }
        });

    const { mutate: duplicateProperty } =
        t.owner.property.duplicate.useMutation({
            onSuccess() {
                startTransition(() => router.refresh());
                toast.success(`Votre logement a bien été dupliqué`);
            }
        });

    async function handleDelete() {
        if (isDraft) {
            deleteDraft({ uid: id });
        } else {
            deleteProperty({ uid: id });
        }

        setDeletedPropertiesIds(oldIds => {
            return [...oldIds, id];
        });
    }

    const actions: DropdownItem[] = !isDraft
        ? [
              {
                  href: `/properties/${new Uuid(id).short()}`,
                  text: 'Voir les détails',
                  Icon: props => (
                      <Eye className={props.className} weight="bold" />
                  )
              },
              {
                  href,
                  text: 'Modifier',
                  Icon: props => (
                      <PencilSimple className={props.className} weight="bold" />
                  )
              },
              {
                  onClick() {
                      duplicateProperty({ uid: id });
                  },
                  text: 'Dupliquer',
                  Icon: props => (
                      <Copy className={props.className} weight="bold" />
                  )
              },
              {
                  onClick: () => setModalConfirmationOpenState(true),
                  text: 'Supprimer',
                  Icon: props => (
                      <TrashSimple
                          className={clsx(props.className)}
                          weight="fill"
                      />
                  ),
                  clsx: ({ active }) => (active ? 'text-white' : 'text-danger')
              }
          ]
        : [
              {
                  href,
                  text: 'Modifier',
                  Icon: props => (
                      <PencilSimple className={props.className} weight="bold" />
                  )
              },
              {
                  onClick: () => setModalConfirmationOpenState(true),
                  text: 'Supprimer',
                  Icon: props => (
                      <TrashSimple
                          className={clsx(props.className)}
                          weight="fill"
                      />
                  ),
                  clsx: ({ active }) => (active ? 'text-white' : 'text-danger')
              }
          ];

    return (
        <>
            <DeleteConfirmationModal
                title={title.trim()}
                isOpen={isModalConfirmationOpen}
                onClose={() => setModalConfirmationOpenState(false)}
                onConfirm={handleDelete}
            />

            <PropertyCard
                isDraft={isDraft}
                href={href}
                title={title.trim()}
                customLink={NextLink}
                // @ts-ignore
                customImage={Image}
                {...props}
                actions={actions}
                className="h-full w-full lg:hidden"
                disabled={deletedPropertiesIds.includes(id)}
            />

            <HorizontalPropertyCard
                {...props}
                disabled={deletedPropertiesIds.includes(id)}
                className={`hidden lg:flex`}
                isDraft={isDraft}
                customLink={NextLink}
                actions={actions}
                href={href}
                title={title.trim()}
            />
        </>
    );
}
