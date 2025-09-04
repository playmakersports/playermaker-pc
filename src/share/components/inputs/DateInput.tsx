import * as React from 'react';
import { useImperativeHandle, useRef, useState } from 'react';
import { flip, hide, offset, useDismiss, useFloating } from '@floating-ui/react';
import useCalendar from '@/share/hooks/useCalendar.ts';

import BaseInput from '@/share/components/inputs/BaseInput.tsx';
import { datePickerStyle } from '@/share/components/css/date.css.ts';
import { NumberFlowInput } from './NumberFlowInput';
import LeftArrow from '@/assets/icons/arrow/LeftArrow.svg?react';
import RightArrow from '@/assets/icons/arrow/RightArrow.svg?react';
import {
  addMonths,
  format,
  getMonth,
  getYear,
  isFuture,
  isPast,
  isSameDay,
  isSameMonth,
  isToday,
  subMonths,
} from 'date-fns';
import { flexs, fullwidth } from '@/style/container.css.ts';
import clsx from 'clsx';
import { align, fonts } from '@/style/typo.css.ts';
import { theme } from '@/style/theme.css.ts';

interface DateInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'ref' | 'value' | 'defaultValue'> {
  title?: string;
  value?: string;
  defaultValue?: string;
  pickType?: 'ALL' | 'ONLY_PAST' | 'ONLY_FUTURE';
}

const DateInput = (props: DateInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const { title, required, pickType, ref, ...rest } = props;
  const [open, onOpenChange] = useState(false);
  const { dayList, weekCalendarList, currentDate, setCurrentDate } = useCalendar();
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange,
    middleware: [hide(), flip(), offset(8)],
  });
  useDismiss(context);

  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

  const [yearValue, setYearValue] = useState(() =>
    rest.value
      ? +rest.value.split('-')[0]
      : rest.defaultValue
        ? +rest.defaultValue.split('-')[0]
        : +getYear(new Date()),
  );
  const [monthValue, setMonthValue] = useState(() =>
    rest.value
      ? +rest.value.split('-')[1]
      : rest.defaultValue
        ? +rest.defaultValue.split('-')[1]
        : +getMonth(new Date()) + 1,
  );

  React.useEffect(() => {
    const targetValue = rest.value || rest.defaultValue || internalRef.current?.value;
    if (targetValue) {
      const [year, month, day] = targetValue.split('-');
      setCurrentDate(new Date(`${year}/${month}/${day}`));
      setYearValue(+year);
      setMonthValue(+month);
    }
  }, [rest.value, setCurrentDate]);

  const handleMonthMove = (direction: 'PREV' | 'NEXT') => {
    const targetDate = direction === 'PREV' ? subMonths(currentDate, 1) : addMonths(currentDate, 1);

    if (
      (direction === 'NEXT' &&
        pickType === 'ONLY_PAST' &&
        isSameMonth(targetDate, new Date()) &&
        isFuture(targetDate)) ||
      (direction === 'PREV' && pickType === 'ONLY_FUTURE' && isSameMonth(targetDate, new Date()) && isPast(targetDate))
    ) {
      setCurrentDate(new Date());
    } else {
      setCurrentDate(targetDate);
    }
    setYearValue(targetDate.getFullYear());
    setMonthValue(targetDate.getMonth() + 1);
  };

  const onClickUpdateDateValue = (targetDate: Date) => {
    const currentValueFormatted = format(targetDate, 'yyyy-MM-dd');
    if (internalRef.current) {
      internalRef.current.value = currentValueFormatted;
      if (rest.onChange) {
        rest.onChange({ target: { value: currentValueFormatted } } as React.ChangeEvent<HTMLInputElement>);
      }
      onOpenChange(false);
      internalRef.current.focus();
    }
  };

  const setCurrentDateValue = (date?: Date) => {
    const targetDate = date ?? new Date();
    setCurrentDate(targetDate);
    setYearValue(targetDate.getFullYear());
    setMonthValue(targetDate.getMonth() + 1);
  };

  return (
    <div role="button">
      <div ref={refs.setReference} style={{ position: 'relative' }}>
        <BaseInput
          type="text"
          ref={internalRef}
          title={title}
          onButtonClick={() => onOpenChange(true)}
          required={required}
          {...rest}
        />
      </div>
      {open && (
        <div role="dialog" ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 5 }}>
          <div className={datePickerStyle.container}>
            <div className={datePickerStyle.calendarHeader}>
              <div className={flexs({ justify: 'center', gap: '8' })}>
                <div className={clsx(flexs(), fonts.body2.semibold)}>
                  <NumberFlowInput
                    aria-label="연도 입력"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={yearValue}
                    maxLength={4}
                    onFocus={e => e.target.select()}
                    onChange={e => setYearValue(+e.target.value.slice(0, 4))}
                    onBlur={e => {
                      const newYear = Number(e.target.value);
                      if (e.target.value !== '' && newYear > 1900 && newYear < 2999) {
                        const newDate = new Date(newYear, monthValue, currentDate.getDate());
                        if (pickType === 'ONLY_PAST' && isFuture(newDate)) {
                          setCurrentDateValue();
                          // trigger('미래로 날짜를 설정할 수 없어요.', { type: 'error' });
                        } else if (pickType === 'ONLY_FUTURE' && isPast(newDate) && !isToday(newDate)) {
                          setCurrentDateValue();
                          // trigger('과거로 날짜를 설정할 수 없어요.', { type: 'error' });
                        } else {
                          setCurrentDateValue(new Date(newYear, monthValue - 1, currentDate.getDate()));
                        }
                      } else {
                        setCurrentDateValue();
                      }
                    }}
                  />
                  년
                </div>
                <div className={clsx(flexs(), fonts.body2.semibold)}>
                  <NumberFlowInput
                    min={1}
                    max={12}
                    aria-label="월 입력"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    style={{
                      paddingRight: '1px',
                      width: monthValue < 10 ? '12px' : '20px',
                      textAlign: monthValue < 10 ? 'right' : 'left',
                    }}
                    value={monthValue}
                    onFocus={e => e.target.select()}
                    onChange={e => {
                      if (Number(e.target.value) >= 0 && Number(e.target.value) < 13) {
                        setMonthValue(+e.target.value);
                      }
                      return;
                    }}
                    onBlur={e => {
                      const newMonth = Number(e.target.value);
                      if (e.target.value !== '' && newMonth > 0 && newMonth < 13) {
                        const newDate = new Date(yearValue, newMonth, currentDate.getDate());
                        if (pickType === 'ONLY_PAST' && isFuture(newDate)) {
                          setCurrentDateValue();
                          // trigger('미래로 날짜를 설정할 수 없어요.', { type: 'error' });
                        } else if (pickType === 'ONLY_FUTURE' && isPast(newDate) && !isToday(newDate)) {
                          setCurrentDateValue();
                          // trigger('과거로 날짜를 설정할 수 없어요.', { type: 'error' });
                        } else {
                          setCurrentDateValue(new Date(yearValue, newMonth - 1, currentDate.getDate()));
                        }
                      } else {
                        setCurrentDateValue();
                      }
                    }}
                  />
                  월
                </div>
              </div>
              <div className={flexs({ justify: 'center' })}>
                <button
                  type="button"
                  disabled={pickType === 'ONLY_FUTURE' && isSameMonth(currentDate, new Date())}
                  onClick={() => handleMonthMove('PREV')}
                >
                  <LeftArrow />
                </button>
                <button
                  type="button"
                  disabled={pickType === 'ONLY_PAST' && isSameMonth(currentDate, new Date())}
                  onClick={() => handleMonthMove('NEXT')}
                >
                  <RightArrow />
                </button>
              </div>
            </div>

            <div className={flexs({ dir: 'col', justify: 'spb', gap: '8' })}>
              <div className={clsx(fullwidth, flexs({ justify: 'spb' }))}>
                {dayList.map(value => (
                  <p
                    key={value}
                    className={clsx(fullwidth, align.center, fonts.body4.medium)}
                    style={{ color: theme.color.gray['400'] }}
                  >
                    {value}
                  </p>
                ))}
              </div>
              <div className={flexs({ dir: 'col', gap: '16' })}>
                {weekCalendarList.map((week, weekNum) => (
                  <div key={weekNum} className={clsx(flexs({ justify: 'spb' }), fullwidth)}>
                    {week.map(day => (
                      <button
                        key={day.date.toString()}
                        type="button"
                        className={datePickerStyle.date}
                        data-color300={day.nextMonth || day.previousMonth}
                        data-selected={isSameDay(day.date, internalRef.current!.value)}
                        data-holiday={day.holiday.isHoliday}
                        aria-label={`${day.date.getMonth() + 1}월 ${day.displayValue}일`}
                        tabIndex={!(day.nextMonth || day.previousMonth) ? day.displayValue : -1}
                        onClick={() => {
                          const year = day.date.getFullYear();
                          const month = day.date.getMonth() + 1;
                          setCurrentDate(day.date);
                          setYearValue(year);
                          setMonthValue(month);
                          onClickUpdateDateValue(day.date);
                        }}
                      >
                        {day.displayValue}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateInput;
