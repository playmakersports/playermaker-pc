import {
  addDays,
  endOfMonth,
  getDay,
  getDaysInMonth,
  getWeeksInMonth,
  isSunday,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { useMemo, useState } from 'react';

const DAY_OF_WEEK = 7;
const DAY_LIST = ['일', '월', '화', '수', '목', '금', '토'] as const;

type WeekDateObject = {
  date: Date;
  displayValue: number;
  previousMonth: boolean;
  nextMonth: boolean;
  holiday: {
    isHoliday: boolean;
    holidayName: string | null;
  };
};

export type UseCalendarType = {
  dayList: readonly string[];
  weekCalendarList: WeekDateObject[][];
  currentDate: Date;
  currentDateHoliday: {
    isHoliday: boolean;
    holidayName: string | null;
  };
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
};

// 공휴일 데이터를 훅 외부로 이동하여 성능 최적화
const HOLIDAYS_LIST: Record<string, string> = {
  '01-01': '신정',
  '03-01': '3·1절',
  '05-05': '어린이날',
  '06-06': '현충일',
  '08-15': '광복절',
  '10-03': '개천절',
  '10-09': '한글날',
  '12-25': '성탄절',
};

const SPECIAL_HOLIDAYS_LIST: Record<string, string> = {
  '2024-04-10': '국회의원 선거일',
  '2024-05-06': '어린이날 대체휴일',
  '2024-09-16': '추석 연휴',
  '2024-09-17': '추석',
  '2024-09-18': '추석 연휴',
  '2024-10-01': '국군의날 임시휴일',
  '2025-01-28': '설날 연휴',
  '2025-01-29': '설날',
  '2025-01-30': '설날 연휴',
  '2025-03-03': '3·1절 대체휴일',
  '2025-05-06': '부처님오신날 대체휴일',
  '2025-10-05': '추석 연휴',
  '2025-10-06': '추석',
  '2025-10-07': '추석 연휴',
  '2025-10-08': '추석 대체휴일',
};

// 헬퍼 함수들
const createDayObject = (
  date: Date,
  displayValue: number,
  previousMonth: boolean = false,
  nextMonth: boolean = false,
): WeekDateObject => ({
  date,
  displayValue,
  previousMonth,
  nextMonth,
  holiday: {
    isHoliday: isSunday(date) || !!getKoreanHolidays(date),
    holidayName: getKoreanHolidays(date) ?? null,
  },
});

function useCalendar(defaultDate?: Date): UseCalendarType {
  const [currentDate, setCurrentDate] = useState(defaultDate ?? new Date());

  const weekCalendarList = useMemo(() => {
    const totalMonthDays = getDaysInMonth(currentDate);
    const calendarLength = getWeeksInMonth(currentDate, { weekStartsOn: 0 }) * DAY_OF_WEEK;
    const prevMonthEnd = endOfMonth(subMonths(currentDate, 1));
    const monthStart = startOfMonth(currentDate);
    const prevMonthDayListLength = Math.max(0, getDay(monthStart));

    // 이전 달 날짜들
    const prevDayList = Array.from({ length: prevMonthDayListLength }, (_, index) => {
      const targetDate = subDays(prevMonthEnd, prevMonthDayListLength - index - 1);
      return createDayObject(targetDate, targetDate.getDate(), true);
    });

    // 현재 달 날짜들
    const currentDayList = Array.from({ length: totalMonthDays }, (_, index) => {
      const targetDate = addDays(monthStart, index);
      return createDayObject(targetDate, targetDate.getDate());
    });

    // 다음 달 날짜들
    const nextDayListLength = calendarLength - currentDayList.length - prevDayList.length;
    const nextDayList = Array.from({ length: nextDayListLength }, (_, index) => {
      const targetDate = addDays(endOfMonth(currentDate), index + 1);
      return createDayObject(targetDate, index + 1, false, true);
    });

    // 전체 달력 리스트를 주 단위로 분할
    const allDays = [...prevDayList, ...currentDayList, ...nextDayList];
    return Array.from({ length: Math.ceil(allDays.length / DAY_OF_WEEK) }, (_, weekIndex) =>
      allDays.slice(weekIndex * DAY_OF_WEEK, (weekIndex + 1) * DAY_OF_WEEK),
    );
  }, [currentDate]);

  const currentDateHoliday = useMemo(
    () => ({
      isHoliday: isSunday(currentDate) || !!getKoreanHolidays(currentDate),
      holidayName: getKoreanHolidays(currentDate) ?? null,
    }),
    [currentDate],
  );

  return {
    dayList: DAY_LIST,
    weekCalendarList,
    currentDate,
    currentDateHoliday,
    setCurrentDate,
  };
}

function getKoreanHolidays(target: Date): string | undefined {
  const MMdd = `${(target.getMonth() + 1).toString().padStart(2, '0')}-${target.getDate().toString().padStart(2, '0')}`;
  const yyyyMMdd = `${target.getFullYear()}-${MMdd}`;

  return HOLIDAYS_LIST[MMdd] ?? SPECIAL_HOLIDAYS_LIST[yyyyMMdd];
}

export default useCalendar;
