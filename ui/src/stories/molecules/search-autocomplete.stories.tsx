import * as React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import {
    ListBoxOption,
    SearchAutocomplete,
    SearchAutocompleteProps
} from '../../components/molecules/search-autocomplete';

export default {
    title: 'Composants/Molecules/SearchAutocomplete',
    component: SearchAutocomplete,
    argTypes: {
        variant: { control: 'select' }
    }
} as Meta<typeof SearchAutocomplete>;

// 👇 We create a “template” of how args map to rendering
const Template: StoryFn<typeof SearchAutocomplete> = args => {
    const [selectedCharacter, setSelectedCharacter] = React.useState<string>();
    const [isLoading, setIsLoading] = React.useState(false);

    const [characterList, setCharacterList] = React.useState<ListBoxOption[]>(
        []
    );

    async function handleSearch(query: string) {
        setIsLoading(true);
        let res = await fetch(
            `https://swapi.py4e.com/api/people/?search=${query}`
        );

        let json = await res.json();

        // simulate slow request
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCharacterList(_old => {
            return (json.results as { name: string }[]).map(r => ({
                key: r.name,
                label: r.name
            }));
        });
        setIsLoading(false);
    }

    return (
        <div className="w-80">
            <SearchAutocomplete
                {...args}
                onSearch={handleSearch}
                value={selectedCharacter}
                onChange={setSelectedCharacter}
                options={characterList}
                isLoading={isLoading}
            />
        </div>
    );
};

export const Default = {
    render: Template,

    args: {
        label: 'Character List'
    } as SearchAutocompleteProps
};

export const WithInitialQuery = {
    render: Template,

    args: {
        label: 'Character List',
        initialQuery: 'Luke Skywalker'
    } as SearchAutocompleteProps
};
