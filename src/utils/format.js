const pad = (n) => String(n).padStart(2, '0');

export const won = (n) => `${Number(n || 0).toLocaleString('ko-KR')}원`;

export const yyyymmdd = (d = new Date()) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

export const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const isWeekend = (iso) => {
  if (!iso) return false;
  const day = new Date(`${iso}T00:00:00`).getDay();
  return day === 0 || day === 6;
};

export const formatDateTime = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
};

// 08:00 ~ 18:00 (1시간 단위)
export const TIME_OPTIONS = Array.from({ length: 11 }, (_, i) => `${pad(i + 8)}:00`);
