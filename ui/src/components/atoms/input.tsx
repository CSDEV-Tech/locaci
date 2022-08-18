import * as React from 'react';
import { useId } from 'react';
import { MinusCircle, PlusCircle, XCircle } from 'phosphor-react';
import { clsx } from '../../lib/functions';
import { Button } from '../atoms/button';

export type InputProps<T> = {
    value?: T;
    onChange: (newValue: T) => void;
    label: string;
    name?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    required?: boolean;
    errorText?: string;
    autocomplete?: 'on' | 'off';
    onBlur?: () => void;
};

export interface TextInputProps extends InputProps<string> {
    type?: 'text' | 'tel' | 'email';
    appendix?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    (
        {
            appendix,
            value,
            onChange,
            name,
            label,
            className,
            autoFocus,
            errorText,
            onBlur,
            autocomplete,
            required = false,
            disabled = false,
            type = 'text',
            placeholder = 'placeholder...'
        },
        ref
    ) => {
        const id = useId();
        const errorId = useId();
        return (
            <div className={clsx(className, 'flex flex-col gap-1')}>
                <div
                    className={clsx('px-4 pt-4 pb-2 rounded-lg border', {
                        'bg-white': !disabled,
                        'bg-lightgray': disabled,
                        'border-red-400': !!errorText,
                        'focus-within:ring-2 focus-within:ring-red-300':
                            !!errorText
                    })}>
                    <div className={'relative w-full group flex items-center'}>
                        <input
                            ref={ref}
                            aria-describedby={errorId}
                            id={id}
                            name={name}
                            autoFocus={autoFocus}
                            onBlur={onBlur}
                            autoComplete={autocomplete}
                            type={type}
                            value={value}
                            required={required}
                            disabled={disabled}
                            onChange={e => onChange?.(e.target.value)}
                            className={clsx(
                                'peer h-10 w-full font-semibold placeholder-transparent text-dark',
                                'bg-transparent focus:outline-none'
                            )}
                            placeholder={placeholder}
                        />
                        <label
                            htmlFor={id}
                            className={clsx(
                                'absolute left-0 -top-3.5 text-sm transition-all font-semibold',
                                'peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:font-semibold',
                                'peer-focus:-top-3.5 peer-focus:text-sm',
                                'text-gray peer-placeholder-shown:text-gray peer-focus:text-gray'
                            )}>
                            {label}
                            {required && (
                                <span
                                    aria-label="ce champ est requis"
                                    className="text-red-400">
                                    *
                                </span>
                            )}
                        </label>

                        {(appendix !== undefined || !!errorText) && (
                            <span
                                className={`font-semibold text-gray group-focus-within:text-dark`}>
                                {!!errorText ? (
                                    <XCircle
                                        weight="fill"
                                        className="text-red-400"
                                    />
                                ) : (
                                    appendix
                                )}
                            </span>
                        )}
                    </div>
                </div>

                {errorText && (
                    <small
                        id={errorId}
                        role={`alert`}
                        className={`text-red-500`}>
                        {errorText}
                    </small>
                )}
            </div>
        );
    }
);

export interface NumberInputProps extends InputProps<number> {
    appendix?: React.ReactNode;
    showButtons?: boolean;
    min?: number;
    max?: number;
}

export function NumberInput({
    onChange,
    appendix,
    name,
    label,
    className,
    autoFocus,
    errorText,
    required = false,
    showButtons = false,
    disabled = false,
    min = 0,
    max = Infinity,
    value = 0,
    placeholder = 'placeholder...'
}: NumberInputProps) {
    const id = useId();
    const errorId = useId();

    let valueToDisplay = Intl.NumberFormat('fr-FR').format(
        parseInt(value?.toString() ?? '0')
    );

    function handleChange(newValue: string) {
        // Supprimer tous les caractères d'espacement (espaces) afin de le transformer en un nombre
        //  ex: "1 000" -> 1000
        newValue = newValue.replace(/(\s+)/g, '');

        if (newValue.length === 0 && value !== 0) {
            onChange && onChange(0);
        } else {
            const parsed = parseInt(newValue);
            // nous voulons seulement autoriser les nombres :
            //  - différents de la valeur courante
            //  - compris entre les valeurs min et max
            if (
                !isNaN(parsed) &&
                parsed !== value &&
                parsed >= min &&
                parsed <= max
            ) {
                onChange &&
                    onChange(Math.min(max, Math.max(min, parseInt(newValue))));
            }
        }
    }

    function increment() {
        if (value !== undefined && value < max) {
            onChange && onChange(Math.min(value + 1, max));
        }
    }

    function decrement() {
        if (value !== undefined && value > min) {
            onChange && onChange(Math.max(value - 1, min));
        }
    }

    return (
        <div className={clsx(className, 'flex flex-col gap-1')}>
            <div
                className={clsx(className, 'px-4 pt-5 pb-2 rounded-md border', {
                    'bg-white': !disabled,
                    'bg-lightgray': disabled,
                    'border-red-400': !!errorText,
                    'focus-within:ring-2 focus-within:ring-red-400': !!errorText
                })}>
                <div
                    className={'relative w-full flex items-center gap-1 group'}>
                    <input
                        id={id}
                        aria-describedby={errorId}
                        name={name}
                        required={required}
                        type="text"
                        autoFocus={autoFocus}
                        disabled={disabled}
                        inputMode="numeric"
                        value={valueToDisplay}
                        onChange={e => handleChange(e.target.value)}
                        className={clsx(
                            'peer h-10 w-full text-dark font-semibold placeholder-transparent',
                            'bg-transparent focus:outline-none'
                        )}
                        placeholder={placeholder}
                    />
                    <label
                        htmlFor={id}
                        className={clsx(
                            'absolute left-0 -top-3.5 text-gray text-sm transition-all font-semibold',
                            'peer-placeholder-shown:text-base peer-placeholder-shown:text-gray peer-placeholder-shown:top-2 peer-placeholder-shown:font-semibold',
                            'peer-focus:-top-3.5 peer-focus:text-gray peer-focus:text-sm peer-focus:font-semibold'
                        )}>
                        {label}
                        {required && (
                            <span
                                aria-label="ce champ est requis"
                                className="text-red-400">
                                *
                            </span>
                        )}
                    </label>

                    {!showButtons &&
                        (appendix !== undefined || !!errorText) && (
                            <span
                                className={`font-semibold text-gray group-focus-within:text-dark`}>
                                {!!errorText ? (
                                    <XCircle
                                        weight="fill"
                                        className="text-red-400"
                                    />
                                ) : (
                                    appendix
                                )}
                            </span>
                        )}

                    {showButtons && (
                        <>
                            <Button
                                variant={`outline`}
                                square
                                className={clsx({
                                    'pointer-events-none': disabled
                                })}
                                renderTrailingIcon={cls => (
                                    <MinusCircle className={cls} />
                                )}
                                onClick={decrement}
                            />
                            <Button
                                variant={`outline`}
                                square
                                className={clsx({
                                    'pointer-events-none': disabled
                                })}
                                renderTrailingIcon={cls => (
                                    <PlusCircle className={cls} />
                                )}
                                onClick={increment}
                            />
                        </>
                    )}
                </div>
            </div>
            {errorText && (
                <small id={errorId} role={`alert`} className={`text-red-500`}>
                    {errorText}
                </small>
            )}
        </div>
    );
}
