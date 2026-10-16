// 스키마의 CHECK 제약/초기 코드(USER_TYPE 등)는 스키마 기준으로 정의하고,
// 스키마에 값 목록이 없는 상태값은 화면 흐름 기준으로 정의했습니다(README 참고).

export const USER_TYPE = { CUSTOMER: '고객', TECHNICIAN: '기사', ADMIN: '관리자', PARTNER: '파트너' };

export const MOVE_STATUS = {
  DRAFT: '작성중',
  REQUESTED: '견적 대기',
  QUOTED: '견적 도착',
  RESERVED: '예약 완료',
  IN_PROGRESS: '설치 진행',
  COMPLETED: '완료',
  CANCELLED: '취소',
};

export const QUOTE_STATUS = { DRAFT: '임시저장', SENT: '견적 제출', ACCEPTED: '수락', REJECTED: '미선택', EXPIRED: '만료' };

export const RESERVATION_STATUS = { RESERVED: '예약', CONFIRMED: '확정', COMPLETED: '완료', CANCELLED: '취소' };

export const INSTALL_STATUS = { WAITING: '대기', IN_PROGRESS: '진행중', COMPLETED: '완료' };

export const ITEM_STATUS = { PENDING: '대기', WORKING: '작업중', DONE: '완료' };

export const PAYMENT_STATUS = { READY: '결제 대기', PAID: '결제 완료', FAILED: '실패', CANCELLED: '취소' };

export const ADDRESS_TYPE = { FROM: '출발지', TO: '도착지' };

export const YN = { Y: '예', N: '아니오' };

export const RULE_TYPE = { BASE: '기본요금', ADDITIONAL: '추가요금', FLOOR: '층수 할증', TIME: '시간 할증' };

export const CALC_TYPE = { FIXED: '고정 금액', PER_UNIT: '가전 수량당', PER_ADDRESS: '주소당', PERCENT: '비율(%)' };
