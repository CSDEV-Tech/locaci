import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    InputGroup,
    InputGroupProps
} from '../../components/molecules/input-group';
import { NumberInput, TextInput } from '../../components/atoms/input';
import { ComboBox } from '../../components/atoms/combobox';
import { Select } from '../../components/atoms/select';
import { Button } from '../../components/atoms/button';
import { MagnifyingGlass } from 'phosphor-react';

export default {
    title: 'Composants/Molecules/InputGroup',
    component: InputGroup
} as ComponentMeta<typeof InputGroup>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof InputGroup> = args => (
    <InputGroup {...args} />
);

export function SearchBar() {
    const [commune, setCommune] = React.useState<string | undefined>(undefined);
    const [rentType, setRentType] = React.useState<string | undefined>(
        undefined
    );
    const [maxPrice, setMaxPrice] = React.useState(50_000);
    return (
        <InputGroup>
            {cls => (
                <Select
                    className={cls}
                    label="Commune"
                    value={commune}
                    onChange={setCommune}
                    options={[
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
                    ]}
                />
            )}
            {cls => (
                <Select
                    className={cls}
                    label="type de logement"
                    value={rentType}
                    onChange={setRentType}
                    options={[
                        {
                            label: 'Colocation',
                            value: 'SHARED_APPARTMENT'
                        },
                        {
                            label: 'Location',
                            value: 'LOCATION'
                        },
                        {
                            label: 'Court Séjour',
                            value: 'SHORT_TERM'
                        }
                    ]}
                />
            )}
            {cls => (
                <NumberInput
                    className={cls}
                    label="Prix maximum"
                    value={maxPrice}
                    onChange={setMaxPrice}
                    appendix={
                        <div className="flex gap-2 items-center">
                            <span>FCFA</span>
                            <Button
                                variant="primary"
                                square
                                renderLeadingIcon={cls => (
                                    <MagnifyingGlass className={cls} />
                                )}
                            />
                        </div>
                    }
                />
            )}
        </InputGroup>
    );
}
