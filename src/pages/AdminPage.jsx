import { useStore } from '../store/StoreContext.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { USER_TYPE, MOVE_STATUS, QUOTE_STATUS, INSTALL_STATUS, PAYMENT_STATUS, RULE_TYPE, CALC_TYPE } from '../constants/codes.js';

const CODE_GROUPS = [
  { name: 'USER_TYPE', label: '사용자 유형', codes: USER_TYPE },
  { name: 'MOVE_STATUS', label: '이전설치 상태', codes: MOVE_STATUS },
  { name: 'QUOTE_STATUS', label: '견적 상태', codes: QUOTE_STATUS },
  { name: 'INSTALL_STATUS', label: '설치 작업 상태', codes: INSTALL_STATUS },
  { name: 'PAYMENT_STATUS', label: '결제 상태', codes: PAYMENT_STATUS },
];

export default function AdminPage() {
  const { requests, priceRules, categories, togglePriceRule } = useStore();
  const countBy = (status) => requests.filter((r) => r.requestStatus === status).length;

  return (
    <>
      <h1>관리자</h1>

      <section className="card">
        <h2>이전설치 현황 (move_request)</h2>
        <div className="grid-3">
          {Object.entries(MOVE_STATUS).map(([k, label]) => (
            <div key={k} className="row spread" style={{ borderBottom: '1px solid var(--border)', padding: '6px 0' }}>
              <span>{label}</span>
              <strong>{countBy(k)}건</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>가격 규칙 (price_rule)</h2>
        <table className="table">
          <thead>
            <tr><th>코드</th><th>규칙명</th><th>유형</th><th>계산 방식</th><th className="num">금액/비율</th><th>사용</th></tr>
          </thead>
          <tbody>
            {priceRules.map((p) => (
              <tr key={p.priceRuleId}>
                <td className="muted">{p.ruleCode}</td>
                <td>
                  {p.ruleName}
                  {p.categoryId && (
                    <div className="muted">{categories.find((c) => c.categoryId === p.categoryId)?.categoryName}</div>
                  )}
                </td>
                <td>{RULE_TYPE[p.ruleType]}</td>
                <td>{CALC_TYPE[p.calculationType]}</td>
                <td className="num">
                  {p.calculationType === 'PERCENT' ? `${p.calculationValue}%` : p.calculationValue.toLocaleString('ko-KR')}
                </td>
                <td>
                  <button className="btn btn-sm" onClick={() => togglePriceRule(p.priceRuleId)}>
                    {p.useYn === 'Y' ? '사용 중' : '중지'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>공통 코드 (code_group / code)</h2>
        {CODE_GROUPS.map((g) => (
          <div key={g.name} style={{ marginBottom: 14 }}>
            <h3>{g.label} <span className="muted">({g.name})</span></h3>
            <div className="row">
              {Object.entries(g.codes).map(([code, name]) => (
                <span key={code} className="row" style={{ gap: 4 }}>
                  <StatusBadge value={code} map={g.codes} />
                  <span className="muted">{code}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
