import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormProps } from 'react-hook-form';

export function useZodForm<TSchema extends z.ZodType>(
    props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
        schema: TSchema;
    }
) {
    const form = useForm<TSchema['_input']>({
        ...props,
        // @ts-ignore
        resolver: zodResolver(props.schema, undefined, {
            // This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
            rawValues: true
        })
    });

    return form;
}
