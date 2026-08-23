import { normalizeText } from './text';

export const getCategoryFromSubject = (subject) => {
  const text = normalizeText(subject);

  if (
    text.includes('english') ||
    text.includes('tieng anh') ||
    text.includes('ngoai ngu')
  ) {
    return 'Language';
  }

  if (
    text.includes('math') ||
    text.includes('toan') ||
    text.includes('giai tich') ||
    text.includes('dai so')
  ) {
    return 'Mathematics';
  }

  if (text.includes('database') || text.includes('co so du lieu')) {
    return 'Database';
  }

  if (
    text.includes('software') ||
    text.includes('lap trinh') ||
    text.includes('web') ||
    text.includes('computer') ||
    text.includes('may tinh') ||
    text.includes('cong nghe') ||
    text.includes('phan mem')
  ) {
    return 'Technology & Software';
  }

  if (
    text.includes('vat ly') ||
    text.includes('co hoc') ||
    text.includes('thiet bi') ||
    text.includes('ky thuat') ||
    text.includes('gia cong') ||
    text.includes('co khi')
  ) {
    return 'Engineering';
  }

  return 'Course';
};