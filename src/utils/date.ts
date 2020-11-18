export const getLastMonth = (date: Date = new Date()) => {
  date.setMonth(date.getMonth() - 1);
  return date;
};
