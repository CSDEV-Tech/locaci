import * as React from 'react';
import { debounce } from '~/lib/functions';

/**
 * Hook Wrapper around the debounce function,
 * used to create a delay on a callback
 *
 * @example
 *    const debounced = useDebouncedCallBack(() => { // ... }, 500)
 *
 *    debounced()
 *
 * @param timeout
 */
export function useDebouncedCallBack<T extends Function>(
    callback: T,
    timeout: number = 500
): T {
    return React.useCallback(debounce(callback, timeout), []);
}
