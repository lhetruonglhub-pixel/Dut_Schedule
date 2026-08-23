export const parseExamDate = (value) => {
  const text = String(value || '');

  let match = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (match) {
    let year = Number(match[3]);
    if (year < 100) year += 2000;

    return new Date(year, Number(match[2]) - 1, Number(match[1]));
  }

  match = text.match(/(\d{1,2})[\/\-](\d{1,2})/);
  if (match) {
    const now = new Date();
    return new Date(now.getFullYear(), Number(match[2]) - 1, Number(match[1]));
  }

  return null;
};

export const getExamTime = (value) => {
  const text = String(value || '');
  const match = text.match(/(\d{1,2}:\d{2})/);

  return match ? match[1] : 'Time unavailable';
};

export const getExamDateNumber = (date) => {
  if (!date) return '--';
  return String(date.getDate()).padStart(2, '0');
};

export const getExamMonth = (date) => {
  if (!date) return '---';

  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];

  return months[date.getMonth()];
};

export const getDaysUntil = (date) => {
  if (!date) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const examDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const difference = examDay.getTime() - today.getTime();

  return Math.ceil(difference / 86400000);
};