import { normalizeText } from './text';
import { getTimeRangeFromPeriods } from './periods';

export const parseTKB = (value) => {
  const original = String(value || '').trim();

  if (!original) {
    return {
      weekday: null,
      startPeriod: null,
      endPeriod: null,
      time: 'Tiết chưa có',
      room: 'Chưa có phòng',
    };
  }

  const parts = original
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  /* ================= THỨ ================= */

  let weekday = null;
  const weekdayPart = parts.find((part) => /thứ|thu|t\d|cn/i.test(part));

  if (weekdayPart) {
    const normalized = normalizeText(weekdayPart);

    if (
      normalized.includes('thu hai') ||
      /\bt2\b/.test(normalized) ||
      /\bthu\s*2\b/.test(normalized)
    ) {
      weekday = 1;
    } else if (
      normalized.includes('thu ba') ||
      /\bt3\b/.test(normalized) ||
      /\bthu\s*3\b/.test(normalized)
    ) {
      weekday = 2;
    } else if (
      normalized.includes('thu tu') ||
      /\bt4\b/.test(normalized) ||
      /\bthu\s*4\b/.test(normalized)
    ) {
      weekday = 3;
    } else if (
      normalized.includes('thu nam') ||
      /\bt5\b/.test(normalized) ||
      /\bthu\s*5\b/.test(normalized)
    ) {
      weekday = 4;
    } else if (
      normalized.includes('thu sau') ||
      /\bt6\b/.test(normalized) ||
      /\bthu\s*6\b/.test(normalized)
    ) {
      weekday = 5;
    } else if (/\bthu\s*7\b/.test(normalized) || /\bt7\b/.test(normalized)) {
      weekday = 6;
    } else if (normalized.includes('chu nhat') || /\bcn\b/.test(normalized)) {
      weekday = 0;
    }
  }

  /* ================= TIẾT ================= */

  let startPeriod = null;
  let endPeriod = null;

  const clockMatch = original.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
  const namedPeriodMatch = original.match(/ti[eế]t\s*(\d+)\s*[-–]\s*(\d+)/i);

  if (namedPeriodMatch) {
    startPeriod = Number(namedPeriodMatch[1]);
    endPeriod = Number(namedPeriodMatch[2]);
  } else {
    if (parts.length >= 2) {
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const looksLikeRoom = /^[A-Za-z]{1,3}\d{2,4}(?:-\d{2,4})?$/.test(part);

        if (looksLikeRoom) continue;

        const range = part.match(/^(\d+)\s*[-–]\s*(\d+)$/);
        if (range) {
          startPeriod = Number(range[1]);
          endPeriod = Number(range[2]);
          break;
        }

        const single = part.match(/^\d+$/);
        if (single) {
          startPeriod = Number(single[0]);
          endPeriod = startPeriod;
          break;
        }
      }
    }

    if (startPeriod === null) {
      const genericPeriodMatch = original.match(/(?:,|\s)(\d+)\s*[-–]\s*(\d+)(?:,|\s|$)/);
      if (genericPeriodMatch) {
        startPeriod = Number(genericPeriodMatch[1]);
        endPeriod = Number(genericPeriodMatch[2]);
      }
    }
  }

  let time = 'Tiết chưa có';

  if (startPeriod !== null) {
    const timeRange = getTimeRangeFromPeriods(startPeriod, endPeriod);
    const periodText =
      startPeriod === endPeriod ? `Tiết ${startPeriod}` : `Tiết ${startPeriod}-${endPeriod}`;

    time = timeRange ? `${periodText} (${timeRange})` : periodText;
  } else if (clockMatch) {
    time = `${clockMatch[1]} - ${clockMatch[2]}`;
  }

  /* ================= PHÒNG ================= */

  let room = 'Chưa có phòng';

  if (parts.length >= 3) {
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart) {
      room = lastPart;
    }
  }

  if (room === 'Chưa có phòng') {
    const roomMatch = original.match(/(?:ph[oò]ng|room)\s*[:\-]?\s*([A-Za-z0-9.-]+)/i);
    if (roomMatch) {
      room = roomMatch[1];
    }
  }

  if (room === 'Chưa có phòng') {
    const roomMatches = original.match(/\b[A-Za-z]{1,3}\d{2,4}(?:-\d{2,4})?\b/g);
    if (roomMatches && roomMatches.length > 0) {
      room = roomMatches[roomMatches.length - 1];
    }
  }

  return { weekday, startPeriod, endPeriod, time, room };
};