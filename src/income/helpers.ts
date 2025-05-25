export const getWeekDateRange = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();

  const firstDayOfWeek = 0;

  const diffToStartOfWeek = dayOfWeek - firstDayOfWeek;

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - diffToStartOfWeek);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 7);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  return {
    startDate,
    endDate,
  };
};

export const getMonthDateRange = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  return {
    startDate,
    endDate,
  };
};

export const getYearDateRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the beginning of the day

  // Get the first day of the current year (January 1st)
  const startDate = new Date(today.getFullYear(), 0, 1); // Month 0 is January

  // Get the first day of the *next* year (January 1st of next year), then subtract 1 millisecond
  // This gives us the last millisecond of the current year
  const endDate = new Date(today.getFullYear() + 1, 0, 1);
  endDate.setMilliseconds(endDate.getMilliseconds() - 1);

  return {
    startDate,
    endDate,
  };
};
