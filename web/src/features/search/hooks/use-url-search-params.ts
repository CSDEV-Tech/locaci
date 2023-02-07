import { useSearchParams } from 'next/navigation';

export function useURLSearchParams() {
    const searchParams = useSearchParams();
    return new URLSearchParams(searchParams);
}
