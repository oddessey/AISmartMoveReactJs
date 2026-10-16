import { Link, useParams } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import {
  MOVE_STATUS, QUOTE_STATUS, RESERVATION_STATUS, INSTALL_STATUS, ITEM_STATUS, PAYMENT_STATUS, ADDRESS_TYPE, YN,
} from '../constants/codes.js';
import { won, formatDateTime } from '../utils/format.js';

export default function RequestDetailPage() {
  const { id } = useParams();
  const { getRequest, acceptQuote, payReservation, categories } = useStore();
  const req = getRequest(Number(id));

  if (!req) {
    return (
      <div className="card">
        <p>신청내역을 찾을 수 없습니다.</p>
        <Link to="/requests">목록으로 돌아가기</Link>
      </div>
    );
  }

  const catName = (cid) => categories.find((c) => c.categoryId === cid)?.categoryName ?? '-';
  const canAccept = req.requestStatus === 'QUOTED';

  const onAccept = (q) => {
    if (window.confirm(`${q.technicianName}(${q.partnerName}) 견적 ${won(q.totalAmount)}을 수락하시겠습니까?`)) {
      acceptQuote(req.moveRequestId, q.quoteId);
    }
  };

  return (
    <>
      <div className="row spread" style={{ marginBottom: 16 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>{req.requestNo}</h1>
          <div className="muted">
            신청자 {req.customerName} · 희망 {req.requestedDate} {req.requestedStartTime}~{req.requestedEndTime}
          </div>
        </div>
        <StatusBadge value={req.requestStatus} map={MOVE_STATUS} />
      </div>

      {/* move_address */}
      <section className="card">
        <h2>이전 주소</h2>
        <div className="grid-2">
          {req.addresses.map((a) => (
            <div key={a.addressType}>
              <span className="badge">{ADDRESS_TYPE[a.addressType]}</span>
              <div style={{ marginTop: 6 }}>{a.address} {a.addressDetail}</div>
              <div className="muted">{a.floorNo}층 · 엘리베이터 {YN[a.elevatorYn]} · 주차 {YN[a.parkingYn]}</div>
              {a.accessMemo && <div className="muted">메모: {a.accessMemo}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* move_appliance */}
      <section className="card">
        <h2>이전 가전</h2>
        <table className="table">
          <thead>
            <tr><th>가전</th><th>카테고리</th><th>수량</th><th>철거</th><th>설치</th></tr>
          </thead>
          <tbody>
            {req.appliances.map((a) => (
              <tr key={a.moveApplianceId}>
                <td>
                  <strong>{a.applianceName}</strong>
                  <div className="muted">{a.brandName} · {a.modelNo}</div>
                  {a.specialCondition && <div className="muted">특이사항: {a.specialCondition}</div>}
                </td>
                <td>{catName(a.categoryId)}</td>
                <td>{a.quantity}</td>
                <td>{a.removalRequired ? '예' : '아니오'}</td>
                <td>{a.installationRequired ? '예' : '아니오'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* quote */}
      <section className="card">
        <h2>받은 견적</h2>
        {req.quotes.length === 0 && <p className="muted">기사 견적을 기다리는 중입니다.</p>}
        {req.quotes.map((q) => (
          <div key={q.quoteId} className="card" style={{ background: q.quoteStatus === 'ACCEPTED' ? '#f0fdf4' : '#fff' }}>
            <div className="row spread">
              <div>
                <strong>{q.technicianName}</strong> <span className="muted">· {q.partnerName}</span>
                <div className="muted">{q.quoteNo} · 유효기간 {formatDateTime(q.validUntil)}</div>
                {q.technicianMemo && <div className="muted">기사 메모: {q.technicianMemo}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="total">{won(q.totalAmount)}</div>
                <div className="muted">
                  기본 {won(q.baseAmount)} + 추가 {won(q.additionalAmount)} − 할인 {won(q.discountAmount)}
                </div>
                <div style={{ marginTop: 6 }}>
                  <StatusBadge value={q.quoteStatus} map={QUOTE_STATUS} />
                </div>
                {canAccept && q.quoteStatus === 'SENT' && (
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => onAccept(q)}>
                    이 견적 수락
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* reservation */}
      {req.reservation && (
        <section className="card">
          <h2>예약 정보</h2>
          <dl className="kv">
            <dt>예약번호</dt><dd>{req.reservation.reservationNo}</dd>
            <dt>예약일시</dt><dd>{req.reservation.reservationDate} {req.reservation.startTime}~{req.reservation.endTime}</dd>
            <dt>담당 기사</dt><dd>{req.reservation.technicianName} ({req.reservation.partnerName})</dd>
            <dt>상태</dt><dd><StatusBadge value={req.reservation.status} map={RESERVATION_STATUS} /></dd>
          </dl>
        </section>
      )}

      {/* payment */}
      {req.payment && (
        <section className="card">
          <h2>결제</h2>
          <div className="row spread">
            <div>
              <div>결제번호 {req.payment.paymentNo}</div>
              <div className="total">{won(req.payment.paymentAmount)}</div>
              <div className="muted">
                {req.payment.paidAt ? `결제일시 ${formatDateTime(req.payment.paidAt)}` : '결제 전입니다.'}
              </div>
            </div>
            <div className="row">
              <StatusBadge value={req.payment.paymentStatus} map={PAYMENT_STATUS} />
              {req.payment.paymentStatus === 'READY' && (
                <button className="btn btn-primary" onClick={() => payReservation(req.moveRequestId)}>결제하기</button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* installation / installation_item */}
      {req.installation && (
        <section className="card">
          <div className="row spread" style={{ marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>설치 진행 현황</h2>
            <StatusBadge value={req.installation.status} map={INSTALL_STATUS} />
          </div>
          <table className="table">
            <thead>
              <tr><th>가전</th><th>철거</th><th>운송</th><th>설치</th></tr>
            </thead>
            <tbody>
              {req.installation.items.map((it) => (
                <tr key={it.moveApplianceId}>
                  <td>{it.applianceName}</td>
                  <td>{it.removalStatus ? <StatusBadge value={it.removalStatus} map={ITEM_STATUS} /> : '-'}</td>
                  <td><StatusBadge value={it.transportStatus} map={ITEM_STATUS} /></td>
                  <td><StatusBadge value={it.installationStatus} map={ITEM_STATUS} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {req.installation.completedAt && (
            <p className="muted">설치 완료: {formatDateTime(req.installation.completedAt)}</p>
          )}
        </section>
      )}

      {req.memo && <p className="muted">요청 메모: {req.memo}</p>}
    </>
  );
}
