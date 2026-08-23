export const parseLocalDate = (dateString) => {
  const parts = String(dateString).split('-').map(Number);

  if (parts.length !== 3 || parts.some((item) => !Number.isFinite(item))) {
    return new Date(NaN);
  }

  return new Date(parts[0], parts[1] - 1, parts[2]);
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getLocalDateString = () => formatDate(new Date());