import { set, getDate, setDate, addMonths} from 'date-fns';
export const getLastMonth = (date: Date = new Date()) => {
  date.setMonth(date.getMonth() - 1);
  return date;
};


export const getLastDay = (m: number) => {
  return getDate(set(new Date(), { month: m + 1, date: 0 }));
}

export const getNowDate = () => {
  const now = new Date();
  return now.getDate();
}

/*
* day 기준 몇일인지 (오늘 이전의 day는 다음달 날짜 표기 아니면 이달의 날짜 표기)
* */
export const getRemainDate = (day: number) => {
  const now = new Date();
  const nowDate = now.getDate();
  const currentLastDate = getLastDay(now.getMonth());

  // 해당날짜의 최대 날짜를 벗어날 수 없다.
  if (nowDate <= day) {
    return setDate(new Date(), day > currentLastDate ? currentLastDate : day);
  }

  const nextMonth = addMonths(new Date(), 1);
  const nextMonthLastDate = getLastDay(nextMonth.getMonth());
  return setDate(nextMonth, day > nextMonthLastDate ? nextMonthLastDate : day);

}
