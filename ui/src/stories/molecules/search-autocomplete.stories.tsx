import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import {
    AutocompleteOptionValue,
    SearchAutocomplete,
    SearchAutocompleteProps
} from '../../components/molecules/search-autocomplete';

export default {
    title: 'Composants/Molecules/SearchAutocomplete',
    component: SearchAutocomplete
} as ComponentMeta<typeof SearchAutocomplete>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SearchAutocomplete> = args => {
    const [selectedCharacter, setSelectedCharacter] = React.useState<string>();
    const [isLoading, setIsLoading] = React.useState(false);

    const [characterList, setCharacterList] = React.useState<
        AutocompleteOptionValue[]
    >([]);

    async function handleSearch(query: string) {
        setIsLoading(true);
        let res = await fetch(
            `https://swapi.py4e.com/api/people/?search=${query}`
        );

        let json = await res.json();

        setCharacterList(_old => {
            return (json.results as { name: string }[]).map(r => ({
                key: r.name,
                label: r.name
            }));
        });
        setIsLoading(false);
    }

    return (
        <SearchAutocomplete
            label="Character List"
            onSearch={handleSearch}
            value={selectedCharacter}
            onChange={setSelectedCharacter}
            options={characterList}
            isLoading={isLoading}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    label: 'Testing'
} as SearchAutocompleteProps;
