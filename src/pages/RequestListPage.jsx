import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { MOVE_STATUS } from '../constants/codes.js';
import { won } from '../utils/format.js';

const FILTERS = [
  { value: 'ALL', label: '전체' },
  { value: 'REQUESTED', label: '견적 대기' },
  { value: 'QUOTED', label: '견적 도착' },
  { value: 'RESERVED', label: '예약 완료' },
  { value: 'IN_PROGRESS', label: '설치 진행' },
  { value: 'COMPLETED', label: '완료' },
];

export default function RequestListPage() {
  const { requests } = useStore();
  const [filter, setFilter] = useState('ALL');

  const list = requests
    .filter((r) => filter === 'ALL' || r.requestStatus === filter)
    .sort((a, b) => b.moveRequestId - a.moveRequestId);

  return (
    <>
      <div className="row spread" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>내 신청내역</h1>
        <Link to="/requests/new" className="btn btn-primary">새 신청</Link>
      </div>

      <div className="tabs">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`tab ${filter === f.value ? 'active' : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 && <p className="empty">해당하는 신청내역이 없습니다.</p>}

      {list.map((r) => (
        <Link key={r.moveRequestId} to={`/requests/${r.moveRequestId}`} className="list-item">
          <div className="card">
            <div className="row spread">
              <div>
                <strong>{r.requestNo}</strong>
                <div className="muted">{r.appliances.map((a) => a.applianceName).join(', ')}</div>
                <div className="muted">희망 일시 {r.requestedDate} {r.requestedStartTime}~{r.requestedEndTime}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <StatusBadge value={r.requestStatus} map={MOVE_STATUS} />
                <div className="muted" style={{ marginTop: 6 }}>
                  {r.finalAmount ? `확정 ${won(r.finalAmount)}` : `예상 ${won(r.estimatedAmount)}`}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
