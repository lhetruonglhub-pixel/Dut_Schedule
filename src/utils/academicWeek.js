import { parseLocalDate } from './date';
import { normalizeText } from './text';
import { WEEK_1_START_DATE } from '../constants';

export const getAcademicWeekForDate = (dateString) => {
  const date = parseLocalDate(dateString);
  const week1Start = parseLocalDate(WEEK_1_START_DATE);

  if (Number.isNaN(date.getTime()) || Number.isNaN(week1Start.getTime())) {
    return null;
  }

  const difference = date.getTime() - week1Start.getTime();
  const differenceDays = Math.floor(difference / 86400000);

  if (differenceDays < 0) {
    return null;
  }

  return Math.floor(differenceDays / 7) + 1;
};

export const parseWeekList = (weekText) => {
  const text = normalizeText(weekText);

  if (!text || text === 'n/a') {
    return [];
  }

  const weeks = new Set();
  const parts = text.split(/[,;]+/);

  parts.forEach((part) => {
    const clean = part.trim();
    if (!clean) return;

    const rangeMatch = clean.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      const min = Math.min(start, end);
      const max = Math.max(start, end);

      for (let week = min; week <= max; week++) {
        weeks.add(week);
      }
      return;
    }

    const numberMatches = clean.match(/\d+/g);
    if (numberMatches) {
      numberMatches.forEach((number) => weeks.add(Number(number)));
    }
  });

  if (weeks.size === 0) {
    const numbers = text.match(/\d+/g);
    if (numbers) {
      numbers.forEach((number) => weeks.add(Number(number)));
    }
  }

  return Array.from(weeks).sort((a, b) => a - b);
};

export const isCourseActiveInWeek = (tuanHoc, academicWeek) => {
  const weeks = parseWeekList(tuanHoc);

  if (weeks.length === 0) {
    return true;
  }

  return weeks.includes(academicWeek);
};