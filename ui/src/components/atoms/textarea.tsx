import { XCircle } from 'phosphor-react';
import * as React from 'react';
import { clsx } from '../../lib/functions';

export type TextAreaProps = {
    rows?: number;
    cols?: number;
    className?: string;
    value?: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    required?: boolean;
    name?: string;
    errorText?: string;
    helpText?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onChangeValue?: (newValue: string) => void;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
    defaultValue?: string;
};

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            className,
            value,
            onChange,
            label,
            errorText,
            helpText,
            onChangeValue,
            onBlur,
            defaultValue,
            name,
            rows = 5,
            cols = 10,
            required = false,
            disabled = false,
            placeholder = ' '
        },
        ref
    ) => {
        const id = React.useId();
        const errorId = React.useId();
        const helpId = React.useId();
        return (
            <div className={clsx('flex w-full flex-col gap-1')}>
                <div
                    className={clsx(
                        className,
                        'rounded-lg border px-4 pt-4 pb-2',
                        {
                            'bg-white': !disabled,
                            'bg-lightgray': disabled,
                            'border-red-400': !!errorText,
                            'focus-within:ring-2 focus-within:ring-red-300':
                                !!errorText
                        }
                    )}>
                    <div className={'group relative flex w-full items-start'}>
                        <textarea
                            name={name}
                            defaultValue={defaultValue}
                            ref={ref}
                            placeholder={placeholder}
                            id={id}
                            onBlur={onBlur}
                            value={value}
                            onChange={e => {
                                onChangeValue?.(e.target.value);
                                onChange?.(e);
                            }}
                            rows={rows}
                            cols={cols}
                            aria-describedby={`${helpId} ${errorId}`}
                            className={clsx(
                                className,
                                'peer w-full font-medium  placeholder-transparent opacity-100',
                                'bg-transparent focus:outline-none',
                                {
                                    'text-gray': disabled,
                                    'text-dark': !disabled
                                }
                            )}
                        />
                        <label
                            htmlFor={id}
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

                        {errorText && (
                            <span
                                className={`absolute right-2 top-2 font-normal text-gray group-focus-within:text-dark`}>
                                {errorText && (
                                    <XCircle
                                        weight="fill"
                                        className="text-red-400"
                                    />
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
