const GOOD = ['COMPLETED', 'PAID', 'ACCEPTED', 'DONE', 'ACTIVE'];
const BAD = ['REJECTED', 'CANCELLED', 'FAILED', 'EXPIRED', 'LOCKED'];
const PROGRESS = ['RESERVED', 'CONFIRMED', 'IN_PROGRESS', 'WORKING', 'QUOTED', 'SENT'];

export default function StatusBadge({ value, map }) {
  const label = map?.[value] ?? value ?? '-';
  let tone = '';
  if (GOOD.includes(value)) tone = 'badge-good';
  else if (BAD.includes(value)) tone = 'badge-bad';
  else if (PROGRESS.includes(value)) tone = 'badge-progress';
  return <span className={`badge ${tone}`}>{label}</span>;
}
