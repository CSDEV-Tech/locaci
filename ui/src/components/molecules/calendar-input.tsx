import * as React from 'react';
import {
    AriaButtonProps,
    useButton,
    useDateField,
    useDatePicker,
    useDateSegment,
    useLocale
} from 'react-aria';
import {
    useDatePickerState,
    useDateFieldState,
    type DatePickerStateOptions,
    type DateFieldStateOptions,
    type DateSegment as DateSegmentProps,
    type DateFieldState
} from 'react-stately';
import { Calendar, dateToReactAriaDate } from '../atoms/calendar';
import { Popover } from '../atoms/popover-ra';
import {
    createCalendar,
    getLocalTimeZone,
    type DateValue
} from '@internationalized/date';
import { CalendarBlank, Info } from 'phosphor-react';
import { Button, type ButtonProps } from '../atoms/button';
import { clsx } from '../../lib/functions';

export type CalendarInputProps = {
    label: string;
    className?: string;
    value?: Date;
    minValue?: Date;
    maxValue?: Date;
    onChange?: (newDate: Date) => void;
} & Omit<
    DatePickerStateOptions,
    | 'createCalendar'
    | 'minValue'
    | 'defaultValue'
    | 'maxValue'
    | 'onChange'
    | 'value'
>;

export function CalendarInput({
    label,
    value,
    className,
    minValue,
    maxValue,
    onChange,
    ...restProps
}: CalendarInputProps) {
    const props = {
        ...restProps,
        value: dateToReactAriaDate(value ?? new Date()),
        minValue: dateToReactAriaDate(minValue ?? new Date()),
        maxValue: maxValue ? dateToReactAriaDate(maxValue) : undefined,
        onChange: (date: DateValue) => {
            onChange?.(new Date(date.toDate(getLocalTimeZone())));
        }
    };

    const state = useDatePickerState(props ?? {});
    const ref = React.useRef(null);
    const {
        groupProps,
        labelProps,
        fieldProps,
        buttonProps,
        dialogProps,
        calendarProps
    } = useDatePicker(props, state, ref);

    return (
        <>
            <div
                className={clsx(
                    className,
                    'relative flex w-full flex-col text-left',
                    'rounded-lg border bg-white px-4 py-2',
                    {
                        'bg-white': !fieldProps.isDisabled,
                        'bg-lightgray': !!fieldProps.isDisabled,
                        'border-red-400':
                            fieldProps.validationState === 'invalid',
                        'focus-within:ring-2 focus-within:ring-red-300':
                            fieldProps.validationState === 'invalid',
                        'focus-within:ring-2 focus-within:ring-gray/50':
                            fieldProps.validationState !== 'invalid'
                    }
                )}>
                <label
                    {...labelProps}
                    className={clsx('text-sm font-normal', 'text-gray')}>
                    {label}
                </label>

                <div
                    {...groupProps}
                    ref={ref}
                    className="group relative flex w-full items-center justify-between">
                    <div
                        className={clsx(
                            'relative flex items-center rounded-l-md pr-10'
                        )}>
                        <DateField {...fieldProps} />
                        {state.validationState === 'invalid' && (
                            <Info className="absolute right-1 h-6 w-6 text-red-500" />
                        )}
                    </div>

                    <FieldButton {...buttonProps} isPressed={state.isOpen} />
                </div>

                {state.isOpen && (
                    <Popover
                        {...dialogProps}
                        isOpen={state.isOpen}
                        overflowRight
                        className="px-4 py-6"
                        onClose={() => state.setOpen(false)}>
                        <Calendar
                            {...calendarProps}
                            value={value}
                            minValue={minValue}
                            maxValue={maxValue}
                            onChange={onChange}
                        />
                    </Popover>
                )}
            </div>
        </>
    );
}

function FieldButton({
    ...props
}: AriaButtonProps<'button'> & { isPressed: boolean }) {
    let ref = React.useRef<HTMLButtonElement>(null);
    let { buttonProps, isPressed } = useButton(props, ref);
    return (
        <Button
            {...buttonProps}
            square
            variant="outline"
            ref={ref}
            aria-pressed={isPressed || props.isPressed}
            renderLeadingIcon={cls => (
                <CalendarBlank weight="bold" className={cls} />
            )}
        />
    );
}

export function DateField(
    props: Omit<DateFieldStateOptions, 'locale' | 'createCalendar'>
) {
    const { locale } = useLocale();
    const state = useDateFieldState({
        ...props,
        locale,
        createCalendar
    });

    const ref = React.useRef(null);
    const { fieldProps } = useDateField(props, state, ref);

    return (
        <div {...fieldProps} ref={ref} className="flex">
            {state.segments.map((segment, i) => (
                <DateSegment key={i} segment={segment} state={state} />
            ))}
        </div>
    );
}

function DateSegment({
    segment,
    state
}: {
    segment: DateSegmentProps;
    state: DateFieldState;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const { segmentProps } = useDateSegment(segment, state, ref);

    return (
        <div
            {...segmentProps}
            ref={ref}
            style={{
                ...segmentProps.style,
                minWidth:
                    segment.maxValue != null
                        ? String(segment.maxValue).length + 'ch'
                        : undefined
            }}
            className={clsx(
                `group box-content rounded-sm px-0.5 text-right tabular-nums outline-none`,
                `focus:bg-secondary focus:text-white`,
                `font-semibold`,
                {
                    'text-dark': segment.isEditable,
                    'text-gray/50': !segment.isEditable
                }
            )}>
            {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
            <span
                aria-hidden="true"
                className="block w-full text-center italic text-gray group-focus:text-white"
                style={{
                    visibility: segment.isPlaceholder ? undefined : 'hidden',
                    height: segment.isPlaceholder ? '' : 0,
                    pointerEvents: 'none'
                }}>
                {segment.placeholder}
            </span>
            {segment.isPlaceholder ? '' : segment.text}
        </div>
    );
}
