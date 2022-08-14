import * as React from 'react';
import { useId } from 'react';
import { MinusCircle, PlusCircle } from 'phosphor-react';
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
};

export interface TextInputProps extends InputProps<string> {
    type?: 'text' | 'tel' | 'email';
}

export function TextInput({
    value,
    onChange,
    name,
    label,
    className,
    autoFocus,
    disabled = false,
    type = 'text',
    placeholder = 'placeholder...'
}: TextInputProps) {
    const id = useId();
    return (
        <div
            className={clsx(className, 'px-4 pt-4 pb-2 rounded-lg border', {
                'bg-white': !disabled,
                'bg-lightgray': disabled
            })}>
            <div className={'relative w-full'}>
                <input
                    id={id}
                    name={name}
                    autoFocus={autoFocus}
                    type={type}
                    value={value}
                    disabled={disabled}
                    onChange={e => onChange?.(e.target.value)}
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
                        'peer-focus:-top-3.5 peer-focus:text-gray peer-focus:text-sm'
                    )}>
                    {label}
                </label>
            </div>
        </div>
    );
}

export interface NumberInputProps extends InputProps<number> {
    appendix?: string;
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
    showButtons = false,
    disabled = false,
    min = 0,
    max = Infinity,
    value = 0,
    placeholder = 'placeholder...'
}: NumberInputProps) {
    const id = useId();

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
        <div
            className={clsx(className, 'px-4 pt-5 pb-2 rounded-md border', {
                'bg-white': !disabled,
                'bg-lightgray': disabled
            })}>
            <div className={'relative w-full flex items-center gap-1'}>
                <input
                    id={id}
                    name={name}
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
                        'peer-focus:-top-3.5 peer-focus:text-gray peer-focus:text-sm peer-focus:font-normal'
                    )}>
                    {label}
                </label>
                {appendix && (
                    <span className={`font-semibold text-gray`}>
                        {appendix}
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
    );
}
