import * as React from 'react';
import { useId } from 'react';
import { PlusCircleIcon } from './icons/plus-circle';
import { MinusCircleIcon } from './icons/minus-circle';
import { XCircleIcon } from './icons/x-circle';
import { clsx } from '../../lib/functions';
import { Button } from './button';

export type InputProps<T> = {
    value?: T;
    label: string;
    name?: string;
    className?: string;
    rootClassName?: string;
    placeholder?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    required?: boolean;
    errorText?: string;
    helpText?: string;
    autocomplete?: 'on' | 'off';
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
};

export interface TextInputProps extends Omit<InputProps<string>, 'value'> {
    appendix?: React.ReactNode;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onChangeValue?: (newValue: string) => void;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
    id?: string;
    // required for accessibility and to make headlessui ComboBox integration easier
    'data-headlessui-state'?: string;
}

export type ReactAriaProps = React.InputHTMLAttributes<HTMLInputElement> & {
    labelProps?: React.DetailedHTMLProps<
        React.LabelHTMLAttributes<HTMLLabelElement>,
        HTMLLabelElement
    >;
};

export const TextInput = React.forwardRef<
    HTMLInputElement,
    TextInputProps & ReactAriaProps
>(
    (
        {
            appendix,
            value,
            onChange,
            onChangeValue,
            name,
            label,
            className,
            autoFocus,
            errorText,
            onBlur,
            autocomplete,
            helpText,
            rootClassName,
            defaultValue,
            inputMode,
            required = false,
            disabled = false,
            placeholder = ' ',
            type = 'text',
            id: defaultId,
            labelProps,
            ...otherProps
        },
        ref
    ) => {
        const id = useId();
        const errorId = useId();
        const helpId = useId();
        return (
            <div className={clsx(rootClassName, 'flex w-full flex-col gap-1')}>
                <div
                    className={clsx(
                        className,
                        'rounded-lg border px-4 pt-5 pb-2',
                        {
                            'bg-white': !disabled,
                            'bg-lightgray': disabled,
                            'border-red-400': !!errorText,
                            'focus-within:ring-2 focus-within:ring-red-300':
                                !!errorText,
                            'focus-within:ring-2 focus-within:ring-gray/50':
                                !errorText
                        }
                    )}>
                    <div className={'group relative flex w-full items-center'}>
                        <input
                            {...otherProps}
                            ref={ref}
                            aria-describedby={`${errorId} ${helpId}`}
                            id={defaultId ?? id}
                            name={name}
                            inputMode={inputMode}
                            autoFocus={autoFocus}
                            onBlur={onBlur}
                            aria-invalid={!!errorText}
                            autoComplete={autocomplete}
                            type={type}
                            value={value}
                            defaultValue={defaultValue}
                            required={required}
                            disabled={disabled}
                            onChange={e => {
                                onChange?.(e);
                                onChangeValue?.(e.target.value);
                            }}
                            className={clsx(
                                'peer h-10 w-full font-medium  placeholder-transparent opacity-100',
                                'bg-transparent focus:outline-none',
                                {
                                    'text-gray': disabled,
                                    'text-dark': !disabled
                                }
                            )}
                            placeholder={placeholder}
                        />
                        <label
                            {...labelProps}
                            htmlFor={defaultId ?? id}
                            className={clsx(
                                'absolute left-0 -top-3.5 text-sm font-normal transition-all',
                                'peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal',
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
                                className={`font-normal text-gray group-focus-within:text-dark`}>
                                {!!errorText ? (
                                    <XCircleIcon
                                        weight="fill"
                                        className="h-[1em] w-[1em] text-red-400"
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
                        aria-live={`assertive`}
                        role={`alert`}
                        className={`text-red-500`}>
                        {errorText}
                    </small>
                )}

                {helpText && (
                    <small id={helpId} className={`text-gray`}>
                        {helpText}
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
    onChange: (newValue: number) => void;
    labelIncrementButton?: string;
    labelDecrementButton?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    (
        {
            onChange,
            appendix,
            name,
            label,
            className,
            autoFocus,
            errorText,
            helpText,
            rootClassName,
            labelDecrementButton = 'Diminuer',
            labelIncrementButton = 'Augmenter',
            required = false,
            showButtons = false,
            disabled = false,
            min = 0,
            max = Infinity,
            value = 0,
            placeholder = 'placeholder...'
        },
        ref
    ) => {
        const id = useId();
        const errorId = useId();
        const helpId = useId();

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
                    onChange?.(
                        Math.min(max, Math.max(min, parseInt(newValue)))
                    );
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
            <div className={clsx(rootClassName, 'flex w-full flex-col gap-1')}>
                <div
                    className={clsx(
                        className,
                        'rounded-md border px-4 pt-5 pb-2',
                        {
                            'bg-white': !disabled,
                            'bg-lightgray': disabled,
                            'border-red-400': !!errorText,
                            'focus-within:ring-2 focus-within:ring-red-400':
                                !!errorText,
                            'focus-within:ring-2 focus-within:ring-gray/50':
                                !errorText
                        }
                    )}>
                    <div
                        className={
                            'group relative flex w-full items-center gap-1'
                        }>
                        <input
                            id={id}
                            ref={ref}
                            aria-describedby={`${errorId} ${helpId}`}
                            name={name}
                            required={required}
                            type="text"
                            autoFocus={autoFocus}
                            aria-invalid={!!errorText}
                            disabled={disabled}
                            inputMode="numeric"
                            value={valueToDisplay}
                            onChange={e => handleChange(e.target.value)}
                            className={clsx(
                                'peer h-10 w-full font-medium placeholder-transparent',
                                'bg-transparent focus:outline-none',
                                {
                                    'text-gray': disabled,
                                    'text-dark': !disabled
                                }
                            )}
                            placeholder={placeholder}
                        />
                        <label
                            htmlFor={id}
                            className={clsx(
                                'absolute left-0 -top-3.5 text-sm font-normal text-gray transition-all',
                                'peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:text-gray',
                                'peer-focus:-top-3.5 peer-focus:text-sm peer-focus:font-normal peer-focus:text-gray',
                                'text-ellipsis whitespace-nowrap'
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
                                    className={`font-normal text-gray group-focus-within:text-dark`}>
                                    {!!errorText ? (
                                        <XCircleIcon
                                            weight="fill"
                                            className="h-[1em] w-[1em] text-red-400"
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
                                    type="button"
                                    aria-label={labelDecrementButton}
                                    className={clsx({
                                        'pointer-events-none': disabled
                                    })}
                                    renderTrailingIcon={cls => (
                                        <MinusCircleIcon className={cls} />
                                    )}
                                    onClick={decrement}
                                />
                                <Button
                                    variant={`outline`}
                                    square
                                    type="button"
                                    aria-label={labelIncrementButton}
                                    className={clsx({
                                        'pointer-events-none': disabled
                                    })}
                                    renderTrailingIcon={cls => (
                                        <PlusCircleIcon className={cls} />
                                    )}
                                    onClick={increment}
                                />
                            </>
                        )}
                    </div>
                </div>
                {errorText && (
                    <small
                        id={errorId}
                        role={`alert`}
                        className={`text-red-500`}
                        aria-live={`assertive`}>
                        {errorText}
                    </small>
                )}

                {helpText && (
                    <small id={helpId} className={`text-gray`}>
                        {helpText}
                    </small>
                )}
            </div>
        );
    }
);
