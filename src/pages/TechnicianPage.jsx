import { useMemo, useState } from 'react';
import { useStore } from '../store/StoreContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { ITEM_STATUS, INSTALL_STATUS, RESERVATION_STATUS } from '../constants/codes.js';
import { won, formatDateTime } from '../utils/format.js';
import { estimateMove } from '../utils/pricing.js';

export default function TechnicianPage() {
  const { requests, technicians, categories, priceRules, currentTechnicianId } = useStore();
  const tech = technicians.find((t) => t.technicianId === currentTechnicianId);

  const quoteTargets = requests.filter((r) =>
    ['REQUESTED', 'QUOTED'].includes(r.requestStatus) &&
    !r.quotes.some((q) => q.technicianId === currentTechnicianId));

  const myJobs = requests.filter((r) =>
    r.reservation && r.reservation.technicianId === currentTechnicianId && r.reservation.status !== 'COMPLETED');

  return (
    <>
      <h1>기사 페이지</h1>
      <p className="muted">
        {tech?.name} · {tech?.partnerName} · 평점 {tech?.rating} · 완료 {tech?.completedCount}건
      </p>

      <section style={{ marginTop: 16 }}>
        <h2>견적 요청 ({quoteTargets.length})</h2>
        {quoteTargets.length === 0 && <p className="empty">새로운 견적 요청이 없습니다.</p>}
        {quoteTargets.map((r) => (
          <QuoteForm key={r.moveRequestId} request={r} tech={tech} categories={categories} priceRules={priceRules} />
        ))}
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>예정된 작업 ({myJobs.length})</h2>
        {myJobs.length === 0 && <p className="empty">예정된 작업이 없습니다.</p>}
        {myJobs.map((r) => <JobCard key={r.moveRequestId} request={r} />)}
      </section>
    </>
  );
}

function QuoteForm({ request, tech, categories, priceRules }) {
  const { submitQuote } = useStore();
  const estimate = useMemo(
    () => estimateMove({
      appliances: request.appliances,
      addresses: request.addresses,
      requestedDate: request.requestedDate,
      priceRules,
      categories,
    }),
    [request, priceRules, categories]
  );

  const [form, setForm] = useState({
    baseAmount: estimate.total, additionalAmount: 0, discountAmount: 0, validUntil: '', memo: '',
  });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const total = Number(form.baseAmount) + Number(form.additionalAmount) - Number(form.discountAmount);

  const submit = () => {
    if (!form.validUntil) {
      setError('견적 유효기간을 입력해 주세요.');
      return;
    }
    submitQuote(request.moveRequestId, {
      ...form,
      technicianId: tech.technicianId,
      technicianName: tech.name,
      partnerName: tech.partnerName,
    });
  };

  return (
    <div className="card">
      <div className="row spread" style={{ marginBottom: 8 }}>
        <strong>{request.requestNo}</strong>
        <span className="muted">희망 {request.requestedDate} {request.requestedStartTime}~{request.requestedEndTime}</span>
      </div>
      <p className="muted">
        가전: {request.appliances.map((a) => `${a.applianceName} ×${a.quantity}`).join(', ')}
      </p>
      {request.appliances.some((a) => a.specialCondition) && (
        <p className="muted">
          특이사항: {request.appliances.map((a) => a.specialCondition).filter(Boolean).join(', ')}
        </p>
      )}
      <p className="muted">시스템 추천 금액: {won(estimate.total)}</p>

      {error && <div className="error">{error}</div>}
      <div className="grid-3">
        <div className="field">
          <label>기본 금액</label>
          <input type="number" value={form.baseAmount} onChange={set('baseAmount')} />
        </div>
        <div className="field">
          <label>추가 금액</label>
          <input type="number" value={form.additionalAmount} onChange={set('additionalAmount')} />
        </div>
        <div className="field">
          <label>할인 금액</label>
          <input type="number" value={form.discountAmount} onChange={set('discountAmount')} />
        </div>
      </div>
      <div className="grid-2">
        <div className="field">
          <label>견적 유효기간 *</label>
          <input type="datetime-local" value={form.validUntil} onChange={set('validUntil')} />
        </div>
        <div className="field">
          <label>기사 메모</label>
          <input value={form.memo} onChange={set('memo')} placeholder="예: 배관 연장 필요 시 추가 비용" />
        </div>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={submit}>견적 제출 (합계 {won(total)})</button>
      </div>
    </div>
  );
}

function JobCard({ request }) {
  const { startInstallation, updateInstallationItem, completeInstallation } = useStore();
  const inst = request.installation;
  if (!inst) return null;

  const allDone = inst.items.every((it) => it.installationStatus === 'DONE');
  const fields = ['removalStatus', 'transportStatus', 'installationStatus'];

  return (
    <div className="card">
      <div className="row spread" style={{ marginBottom: 8 }}>
        <div>
          <strong>{request.requestNo}</strong>
          <div className="muted">
            {request.reservation.reservationDate} {request.reservation.startTime}~{request.reservation.endTime}
          </div>
        </div>
        <div className="row">
          <StatusBadge value={request.reservation.status} map={RESERVATION_STATUS} />
          <StatusBadge value={inst.status} map={INSTALL_STATUS} />
        </div>
      </div>

      {request.addresses.map((a) => (
        <div key={a.addressType} className="muted">
          {a.addressType === 'FROM' ? '출발' : '도착'}: {a.address} {a.addressDetail}
          ({a.floorNo}층, 엘리베이터 {a.elevatorYn === 'Y' ? '있음' : '없음'})
        </div>
      ))}

      <table className="table" style={{ marginTop: 12 }}>
        <thead>
          <tr><th>가전</th><th>철거</th><th>운송</th><th>설치</th></tr>
        </thead>
        <tbody>
          {inst.items.map((it) => (
            <tr key={it.moveApplianceId}>
              <td>{it.applianceName}</td>
              {fields.map((field) => (
                <td key={field}>
                  {it[field] === null ? (
                    '-'
                  ) : (
                    <select
                      value={it[field]}
                      disabled={inst.status !== 'IN_PROGRESS'}
                      onChange={(e) => updateInstallationItem(request.moveRequestId, it.moveApplianceId, field, e.target.value)}
                    >
                      {Object.entries(ITEM_STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
        {inst.status === 'WAITING' && (
          <button className="btn btn-primary" onClick={() => startInstallation(request.moveRequestId)}>작업 시작</button>
        )}
        {inst.status === 'IN_PROGRESS' && (
          <button className="btn btn-primary" disabled={!allDone} onClick={() => completeInstallation(request.moveRequestId)}>
            설치 완료 처리
          </button>
        )}
      </div>
      {inst.startedAt && <p className="muted" style={{ margin: '8px 0 0' }}>작업 시작: {formatDateTime(inst.startedAt)}</p>}
    </div>
  );
}
