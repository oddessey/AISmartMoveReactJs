import { isWeekend } from './format.js';

// price_rule 테이블 기반 견적 산정 (클라이언트 미리보기용)
// calculation_type
//  - FIXED       : 1회 고정 금액
//  - PER_UNIT    : 가전 수량 × 금액
//  - PER_ADDRESS : 조건에 맞는 주소마다 금액
//  - PERCENT     : 지금까지의 합계 × 비율(%)
export function estimateMove({ appliances, addresses, requestedDate, priceRules, categories }) {
  const rules = priceRules.filter((r) => r.useYn === 'Y');
  const lines = [];

  const catName = (id) => categories.find((c) => c.categoryId === id)?.categoryName ?? '가전';
  const push = (itemType, itemName, quantity, unitPrice, priceRuleId) =>
    lines.push({ itemType, itemName, quantity, unitPrice, amount: unitPrice * quantity, priceRuleId });

  // 1) 가전별 기본요금 + 철거 요금
  appliances.forEach((a) => {
    const base = rules.find((r) => r.ruleType === 'BASE' && r.categoryId === a.categoryId);
    if (base) {
      push('BASE', `${catName(a.categoryId)} 이전설치 기본요금 (${a.applianceName})`, a.quantity, base.calculationValue, base.priceRuleId);
    }
    if (a.removalRequired) {
      const removal = rules.find((r) => r.ruleType === 'ADDITIONAL' && r.conditionJson?.removalRequired);
      if (removal) push('ADDITIONAL', `${a.applianceName} 기존 가전 철거`, a.quantity, removal.calculationValue, removal.priceRuleId);
    }
  });

  // 2) 층수 할증 (조건: minFloor 이상 + 엘리베이터 여부)
  rules.filter((r) => r.ruleType === 'FLOOR').forEach((rule) => {
    const c = rule.conditionJson ?? {};
    addresses.forEach((addr) => {
      const floorOk = Number(addr.floorNo) >= (c.minFloor ?? 0);
      const elevatorOk = !c.elevator || (addr.elevatorYn ?? 'N') === c.elevator;
      if (floorOk && elevatorOk) {
        const label = addr.addressType === 'FROM' ? '출발지' : '도착지';
        push('FLOOR', `${label} 층수 할증`, 1, rule.calculationValue, rule.priceRuleId);
      }
    });
  });

  // 3) 시간 할증 (주말) - 지금까지의 합계 기준 비율
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  rules
    .filter((r) => r.ruleType === 'TIME' && r.conditionJson?.weekend && isWeekend(requestedDate))
    .forEach((rule) => {
      const amount = Math.round((subtotal * rule.calculationValue) / 100);
      lines.push({ itemType: 'TIME', itemName: '주말 할증', quantity: 1, unitPrice: amount, amount, priceRuleId: rule.priceRuleId });
    });

  const total = lines.reduce((s, l) => s + l.amount, 0);
  return { lines, total };
}
