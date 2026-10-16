import { ADDRESS_TYPE, RULE_TYPE, YN } from '../../constants/codes.js';
import { won, isWeekend } from '../../utils/format.js';

export default function EstimateSummary({ addresses, appliances, schedule, estimate }) {
  return (
    <>
      <div className="card">
        <h2>주소</h2>
        {addresses.map((a) => (
          <div key={a.addressType} style={{ marginBottom: 8 }}>
            <span className="badge">{ADDRESS_TYPE[a.addressType]}</span>{' '}
            {a.address} {a.addressDetail}
            <div className="muted">
              {a.floorNo}층 · 엘리베이터 {YN[a.elevatorYn]} · 주차 {YN[a.parkingYn]}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>가전 · 일정</h2>
        <ul style={{ margin: '0 0 12px', paddingLeft: 18 }}>
          {appliances.map((a) => <li key={a.moveApplianceId}>{a.applianceName} × {a.quantity}</li>)}
        </ul>
        <p className="muted" style={{ margin: 0 }}>
          희망 일시: {schedule.requestedDate} {schedule.requestedStartTime} ~ {schedule.requestedEndTime}
          {isWeekend(schedule.requestedDate) && ' (주말)'}
        </p>
      </div>

      <div className="card">
        <h2>예상 금액</h2>
        <table className="table">
          <tbody>
            {estimate.lines.map((l, i) => (
              <tr key={i}>
                <td>
                  {l.itemName}
                  <div className="muted">{RULE_TYPE[l.itemType]}</div>
                </td>
                <td className="num">{won(l.amount)}</td>
              </tr>
            ))}
            <tr>
              <th>합계</th>
              <td className="num total">{won(estimate.total)}</td>
            </tr>
          </tbody>
        </table>
        <p className="muted">※ 예상 금액이며, 기사가 현장 확인 후 제출한 견적이 최종 금액이 됩니다.</p>
      </div>
    </>
  );
}
