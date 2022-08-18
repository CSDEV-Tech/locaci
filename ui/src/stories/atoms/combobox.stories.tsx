import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { ComboBox, ComboBoxProps } from '../../components/atoms/combobox';

export default {
    title: 'Composants/Atoms/ComboBox',
    component: ComboBox,
    argTypes: {
        variant: {
            control: 'select'
        }
    }
} as ComponentMeta<typeof ComboBox>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof ComboBox> = args => (
    <ComboBox {...args} />
);

export const Default = Template.bind({});
Default.args = {
    className: 'w-80',
    label: 'Commune',
    value: 'ADJAMÉ',
    options: [
        {
            label: 'Adjamé',
            value: 'ADJAMÉ'
        },
        {
            label: 'Cocody',
            value: 'COCODY'
        },
        {
            label: 'Angré',
            value: 'ANGRÉ'
        }
    ]
} as ComboBoxProps;

export const CommuneSearch = () => {
    type Commune = {
        nom: string;
        codePostal: string;
    };

    const communes: Commune[] = [
        {
            nom: 'SEYSSINET PARISET',
            codePostal: '38170'
        },
        {
            nom: 'DAMPARIS',
            codePostal: '39500'
        },
        {
            nom: 'LE TOUQUET PARIS PLAGE',
            codePostal: '62520'
        },
        {
            nom: 'PARIS L HOPITAL',
            codePostal: '71150'
        },
        {
            nom: 'PARIS 01',
            codePostal: '75001'
        },
        {
            nom: 'PARIS 02',
            codePostal: '75002'
        },
        {
            nom: 'PARIS 03',
            codePostal: '75003'
        },
        {
            nom: 'PARIS 04',
            codePostal: '75004'
        },
        {
            nom: 'PARIS 05',
            codePostal: '75005'
        },
        {
            nom: 'PARIS 06',
            codePostal: '75006'
        },
        {
            nom: 'RENNES LE CHATEAU',
            codePostal: '11190'
        },
        {
            nom: 'RENNES LES BAINS',
            codePostal: '11190'
        },
        {
            nom: 'COURTEMONT VARENNES',
            codePostal: '02850'
        },
        {
            nom: 'VARENNES',
            codePostal: '24150'
        },
        {
            nom: 'RENNES SUR LOUE',
            codePostal: '25440'
        },
        {
            nom: 'GARENNES SUR EURE',
            codePostal: '27780'
        },
        {
            nom: 'VARENNES',
            codePostal: '31450'
        },
        {
            nom: 'VARENNES SUR ALLIER',
            codePostal: '03150'
        },
        {
            nom: 'VARENNES SUR TECHE',
            codePostal: '03220'
        },
        {
            nom: 'RENNES',
            codePostal: '35000'
        },
        {
            nom: 'SENANTES',
            codePostal: '28210'
        },
        {
            nom: 'NANTES EN RATIER',
            codePostal: '38350'
        },
        {
            nom: 'NANTES',
            codePostal: '44000'
        },
        {
            nom: 'NANTES',
            codePostal: '44100'
        },
        {
            nom: 'NANTES',
            codePostal: '44200'
        },
        {
            nom: 'NANTES',
            codePostal: '44300'
        },
        {
            nom: 'VERNANTES',
            codePostal: '49390'
        },
        {
            nom: 'SENANTES',
            codePostal: '60650'
        },
        {
            nom: 'VINANTES',
            codePostal: '77230'
        }
    ];

    const [filteredCommunes, setFilteredCommunes] =
        React.useState<Commune[]>(communes);

    const [selectedCommune, setSelectedCommune] =
        React.useState<Commune | null>(null);

    return (
        <div className={`w-80`}>
            <ComboBox
                label="Ville de votre projet"
                options={filteredCommunes.map(c => ({
                    label: `${c.nom} - ${c.codePostal.substring(0, 2)}`,
                    value: c.codePostal
                }))}
                value={selectedCommune?.codePostal}
                onChange={c => {
                    setSelectedCommune(
                        communes.find(co => co.codePostal === c) ?? null
                    );
                }}
                onSearch={query => {
                    setFilteredCommunes(filtered =>
                        communes.filter(c => {
                            const queryString = query.split(`-`)[0].trim();

                            return (
                                c.nom
                                    .toLocaleLowerCase()
                                    .startsWith(
                                        queryString.toLocaleLowerCase()
                                    ) || c.codePostal.startsWith(queryString)
                            );
                        })
                    );
                }}
            />
        </div>
    );
};

CommuneSearch.storyName = 'Commune search';
