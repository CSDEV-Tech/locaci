import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    AsyncSelectAutocomplete,
    AsyncSelectAutocompleteProps,
    SelectOption
} from '../../components/molecules/async-select-autocomplete';

export default {
    title: 'Composants/Molecules/AsyncAutocomplete',
    component: AsyncSelectAutocomplete,
    argTypes: {
        variant: { control: 'select' }
    }
} as Meta<typeof AsyncSelectAutocomplete>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof AsyncSelectAutocomplete> = args => {
    const [selectedCharacter, setSelectedCharacter] =
        React.useState<SelectOption | null>();

    async function handleSearch(query: string) {
        let res = await fetch(
            `https://swapi.py4e.com/api/people/?search=${query}`
        );

        let json = await res.json();

        // simulate slow request
        await new Promise(resolve => setTimeout(resolve, 1500));
        return (json.results as { name: string }[]).map(r => ({
            value: r.name,
            label: r.name
        }));
    }

    return (
        <div className="w-80">
            <AsyncSelectAutocomplete
                {...args}
                onSearch={handleSearch}
                value={selectedCharacter}
                name="character"
                onSelect={option => setSelectedCharacter(option)}
                placeholderText="Ex: Luke skywalker"
            />
        </div>
    );
};

export const Default = {
    render: Template,

    args: {
        label: 'Character List'
    } as AsyncSelectAutocompleteProps
};

export const WithInitialQuery = {
    render: Template,

    args: {
        label: 'Character List',
        initialQuery: 'Luke Skywalker'
    } as AsyncSelectAutocompleteProps
};
