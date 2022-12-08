import * as React from 'react';

export function useMediaQuery(query: string): boolean {
    const getMatches = (query: string): boolean => {
        // Prevents SSR issues
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    };

    const [matches, setMatches] = React.useState<boolean>(getMatches(query));

    function handleChange() {
        setMatches(getMatches(query));
    }

    React.useEffect(() => {
        const matchMedia = window.matchMedia(query);

        // Triggered at the first client-side load and if query changes
        handleChange();

        // Listen matchMedia
        matchMedia.addEventListener('change', handleChange);

        return () => {
            matchMedia.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

export default useMediaQuery;
