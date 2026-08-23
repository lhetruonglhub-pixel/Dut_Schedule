export const PERIOD_START_MINUTES = {
  1: 7 * 60,
  2: 8 * 60,
  3: 9 * 60,
  4: 10 * 60,
  5: 11 * 60,
  6: 12 * 60 + 30,
};

export const PERIOD_DURATION = 50;
export const BREAK_DURATION = 10;

export const getPeriodStartMinutes = (period) => {
  const number = Number(period);

  if (!Number.isFinite(number) || number < 1) {
    return null;
  }

  if (number <= 5) {
    return PERIOD_START_MINUTES[number] ?? null;
  }

  if (number === 6) {
    return 12 * 60 + 30;
  }

  const period6Start = 12 * 60 + 30;
  return period6Start + (number - 6) * (PERIOD_DURATION + BREAK_DURATION);
};

export const minutesToTime = (minutes) => {
  if (minutes === null || minutes === undefined) {
    return '';
  }

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const getTimeRangeFromPeriods = (startPeriod, endPeriod) => {
  const start = Number(startPeriod);
  const end = Number(endPeriod);

  if (!Number.isFinite(start)) {
    return '';
  }

  const finalEnd = Number.isFinite(end) ? end : start;
  const startMinutes = getPeriodStartMinutes(start);
  const endStartMinutes = getPeriodStartMinutes(finalEnd);

  if (startMinutes === null || endStartMinutes === null) {
    return '';
  }

  const endMinutes = endStartMinutes + PERIOD_DURATION;

  return `${minutesToTime(startMinutes)} - ${minutesToTime(endMinutes)}`;
};