import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Header, HeaderProps } from '../../components/organisms/header';

// @ts-ignore
import logoSmall from '../assets/favicon.svg';
// @ts-ignore
import logoFull from '../assets/logo.svg';

import { Link } from '../../components/atoms/link';
import { Avatar } from '../../components/atoms/avatar';
import { SearchButton } from '../../components/atoms/search-button';
import { Button } from '../../components/atoms/button';
import { List, PlusCircle } from 'phosphor-react';
import { Breadcrumb } from '../../components/molecules/breadcrumb';

export default {
    title: 'Composants/Organisms/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen'
    }
} as ComponentMeta<typeof Header>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Header> = args => <Header {...args} />;

export const Default = Template.bind({});
Default.args = {
    logoUrlMobile: logoSmall,
    logoUrlDesktop: logoFull,
    logoAltText: 'Logo LOCACI',
    leadingElement: (
        <>
            <SearchButton className="lg:hidden" onClick={() => {}}>
                Rechercher un logement
            </SearchButton>
        </>
    ),
    trailingElement: (
        <Link href="#">
            <Avatar name="N'Goran germaine" src="https://i.pravatar.cc/300" />
        </Link>
    )
} as HeaderProps;

export const WithBreadcrumb = Template.bind({});
WithBreadcrumb.args = {
    hideLogo: true,
    logoUrlDesktop: logoFull,
    logoAltText: 'Logo LOCACI',
    leadingElement: (
        <>
            <Button
                square
                aria-label="menu"
                className={`shrink-0`}
                renderLeadingIcon={cls => (
                    <List className={cls} weight={`bold`} />
                )}
            />
            <Breadcrumb
                items={[
                    {
                        href: '#',
                        label: 'Tableau de bord'
                    },
                    {
                        href: '#',
                        label: 'Annonces'
                    },
                    {
                        href: '#',
                        label: 'Détails'
                    }
                ]}
                // className={`w-full`}
            />
        </>
    ),
    trailingElement: (
        <Button
            variant="secondary"
            aria-label="Ajouter une annonce"
            renderLeadingIcon={cls => (
                <PlusCircle className={cls} weight={`bold`} />
            )}
        />
    )
} as HeaderProps;
