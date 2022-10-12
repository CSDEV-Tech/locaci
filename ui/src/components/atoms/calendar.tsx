import * as React from 'react';

import { Button, ButtonProps } from './button';
import { CaretLeft, CaretRight } from 'phosphor-react';

import {
    useCalendarState,
    type CalendarStateOptions,
    type CalendarState
} from '@react-stately/calendar';
import {
    useCalendar,
    useCalendarCell,
    type AriaCalendarGridProps,
    type AriaCalendarCellProps
} from '@react-aria/calendar';

import { useLocale } from '@react-aria/i18n';
import {
    CalendarDate,
    createCalendar,
    getLocalTimeZone,
    getWeeksInMonth,
    isSameMonth,
    type DateValue
} from '@internationalized/date';
import { type AriaButtonProps, useButton, useCalendarGrid } from 'react-aria';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { clsx } from '../../lib/functions';

export type CalendarProps = {
    value?: Date;
    minValue?: Date;
    maxValue?: Date;
    onChange?: (newDate: Date) => void;
} & Omit<
    CalendarStateOptions,
    | 'locale'
    | 'createCalendar'
    | 'minValue'
    | 'defaultValue'
    | 'maxValue'
    | 'onChange'
    | 'value'
>;

export function dateToReactAriaDate(date: Date) {
    return new CalendarDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
    );
}

export function Calendar({
    value,
    minValue,
    maxValue,
    onChange,
    ...restProps
}: CalendarProps) {
    const { locale } = useLocale();

    const props = {
        ...restProps,
        value: dateToReactAriaDate(value ?? new Date()),
        minValue: dateToReactAriaDate(minValue ?? new Date()),
        maxValue: maxValue ? dateToReactAriaDate(maxValue) : undefined,
        locale,
        createCalendar,
        onChange: (date: DateValue) => {
            onChange?.(new Date(date.toDate(getLocalTimeZone())));
        }
    };

    const state = useCalendarState(props);

    const ref = React.useRef(null);
    const { calendarProps, prevButtonProps, nextButtonProps, title } =
        useCalendar(props, state);

    return (
        <div {...calendarProps} ref={ref} className="inline-block text-dark">
            <div className="flex items-center gap-2 pb-4">
                <h2 className="ml-2 flex-1 text-xl font-bold">{title}</h2>
                <CalendarButton
                    {...prevButtonProps}
                    renderLeadingIcon={cls => <CaretLeft className={cls} />}
                />
                <CalendarButton
                    {...nextButtonProps}
                    renderLeadingIcon={cls => <CaretRight className={cls} />}
                />
            </div>
            <CalendarGrid state={state} />
        </div>
    );
}

export function CalendarButton({
    renderLeadingIcon,
    ...props
}: AriaButtonProps<'button'> & Pick<ButtonProps, 'renderLeadingIcon'>) {
    let ref = React.useRef<HTMLButtonElement>(null);
    let { buttonProps } = useButton(props, ref);
    let { focusProps } = useFocusRing();
    return (
        <Button
            circle
            renderLeadingIcon={renderLeadingIcon}
            {...mergeProps(buttonProps, focusProps)}
            ref={ref}
            className={clsx({
                'text-gray-400': !!props.isDisabled
            })}>
            {props.children}
        </Button>
    );
}

function CalendarGrid({
    state,
    ...props
}: { state: CalendarState } & AriaCalendarGridProps) {
    const { locale } = useLocale();
    const { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

    // Get the number of weeks in the month so we can render the proper number of rows.
    const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

    return (
        <table {...gridProps} cellPadding="0" className="flex-1">
            <thead {...headerProps} className="text-dark">
                <tr>
                    {weekDays.map((day, index) => (
                        <th className="text-center" key={index}>
                            {day}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[...new Array(weeksInMonth).keys()].map(weekIndex => (
                    <tr key={weekIndex}>
                        {state
                            .getDatesInWeek(weekIndex)
                            .map((date, i) =>
                                date ? (
                                    <CalendarCell
                                        key={i}
                                        state={state}
                                        date={date}
                                    />
                                ) : (
                                    <td key={i} />
                                )
                            )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function CalendarCell({
    state,
    date
}: {
    state: CalendarState;
} & Pick<AriaCalendarCellProps, 'date'>) {
    const ref = React.useRef(null);
    const {
        cellProps,
        buttonProps,
        isSelected,
        isOutsideVisibleRange,
        isDisabled,
        isFocused,
        formattedDate,
        isInvalid
    } = useCalendarCell({ date }, state, ref);

    const { focusProps, isFocusVisible } = useFocusRing();

    return (
        <td
            {...cellProps}
            className={clsx(`relative py-0.5`, {
                'z-10': isFocusVisible,
                'z-0': !isFocusVisible
            })}>
            <div
                {...mergeProps(buttonProps, focusProps)}
                ref={ref}
                hidden={isOutsideVisibleRange}
                className={clsx(
                    `group flex h-14 w-14 flex-col items-center gap-2 outline-none [&[hidden]]:opacity-0`,
                    {
                        'rounded-full': isSelected,
                        disabled: isDisabled
                    }
                )}>
                <div
                    className={clsx(
                        `flex h-full w-full flex-col items-center justify-center gap-1 `,
                        {
                            'cursor-pointer': !isDisabled,
                            'cursor-default': isDisabled
                        }
                    )}>
                    <div
                        className={clsx(
                            `flex h-10 w-10 items-center justify-center rounded-full p-2`,
                            {
                                'text-gray-400': isDisabled && !isInvalid,
                                'group-focus:z-2 ring-2 ring-secondary ring-offset-2':
                                    isFocusVisible && isFocused,
                                'bg-danger text-white hover:bg-danger':
                                    isSelected && isInvalid,
                                'bg-secondary text-white hover:bg-secondary-75':
                                    isSelected && !isInvalid,
                                'hover:bg-red-400':
                                    isSelected && !isDisabled && isInvalid,
                                'hover:bg-secondary-75':
                                    isSelected && !isDisabled && !isInvalid,
                                'hover:bg-secondary-15':
                                    !isSelected && !isDisabled
                            }
                        )}>
                        {formattedDate}
                    </div>
                </div>

                <div
                    className={clsx(
                        'block h-2 min-h-[0.5rem] w-2 min-w-[0.5rem] rounded-full',
                        {
                            'bg-lightgray': isDisabled,
                            'bg-secondary': !isDisabled
                        }
                    )}
                />
            </div>
        </td>
    );
}
