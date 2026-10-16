// 백엔드 연동 전까지 사용하는 mock 데이터. 필드명은 스키마 컬럼을 camelCase로 변환한 형태입니다.

export const CURRENT_CUSTOMER = { customerId: 1001, userName: '홍길동' };
export const CURRENT_TECHNICIAN_ID = 9001;

export const categories = [
  { categoryId: 1, categoryCode: 'REFRIGERATOR', categoryName: '냉장고' },
  { categoryId: 2, categoryCode: 'WASHER', categoryName: '세탁기' },
  { categoryId: 3, categoryCode: 'AIRCON', categoryName: '에어컨' },
  { categoryId: 4, categoryCode: 'DRYER', categoryName: '건조기' },
  { categoryId: 5, categoryCode: 'TV', categoryName: 'TV' },
];

export const brands = [
  { brandId: 1, brandCode: 'LG', brandName: 'LG전자' },
  { brandId: 2, brandCode: 'SAMSUNG', brandName: '삼성전자' },
  { brandId: 3, brandCode: 'WINIA', brandName: '위니아' },
  { brandId: 4, brandCode: 'CARRIER', brandName: '캐리어' },
];

export const models = [
  { modelId: 101, categoryId: 1, brandId: 1, modelNo: 'RF-LG-A100', modelName: '디오스 양문형 냉장고 A100', widthMm: 910, heightMm: 1790, depthMm: 730, weightKg: 110, installationType: 'FREESTANDING', requiredPersons: 2, defaultInstallTime: 40, difficultyLevel: 'NORMAL' },
  { modelId: 102, categoryId: 1, brandId: 2, modelNo: 'RF-SS-B200', modelName: '비스포크 냉장고 B200', widthMm: 910, heightMm: 1850, depthMm: 700, weightKg: 120, installationType: 'FREESTANDING', requiredPersons: 2, defaultInstallTime: 45, difficultyLevel: 'HIGH' },
  { modelId: 201, categoryId: 2, brandId: 1, modelNo: 'WM-LG-C300', modelName: '트롬 세탁기 C300', widthMm: 600, heightMm: 1000, depthMm: 650, weightKg: 75, installationType: 'FREESTANDING', requiredPersons: 1, defaultInstallTime: 30, difficultyLevel: 'NORMAL' },
  { modelId: 202, categoryId: 2, brandId: 2, modelNo: 'WM-SS-D100', modelName: '그랑데 세탁기 D100', widthMm: 600, heightMm: 1060, depthMm: 640, weightKg: 80, installationType: 'FREESTANDING', requiredPersons: 1, defaultInstallTime: 30, difficultyLevel: 'NORMAL' },
  { modelId: 301, categoryId: 3, brandId: 4, modelNo: 'AC-CR-E500', modelName: '벽걸이 에어컨 E500', widthMm: 900, heightMm: 300, depthMm: 230, weightKg: 12, installationType: 'WALL_MOUNT', requiredPersons: 2, defaultInstallTime: 120, difficultyLevel: 'HIGH' },
  { modelId: 401, categoryId: 4, brandId: 1, modelNo: 'DR-LG-F100', modelName: '트롬 건조기 F100', widthMm: 600, heightMm: 850, depthMm: 640, weightKg: 50, installationType: 'FREESTANDING', requiredPersons: 1, defaultInstallTime: 25, difficultyLevel: 'NORMAL' },
  { modelId: 501, categoryId: 5, brandId: 2, modelNo: 'TV-SS-G75', modelName: '75형 QLED TV G75', widthMm: 1690, heightMm: 1000, depthMm: 80, weightKg: 30, installationType: 'WALL_MOUNT', requiredPersons: 2, defaultInstallTime: 60, difficultyLevel: 'NORMAL' },
];

export const technicians = [
  { technicianId: 9001, name: '김기사', partnerName: '빠른이전설치', technicianGrade: 'SENIOR', careerYears: 7, rating: 4.8, completedCount: 412, status: 'ACTIVE' },
  { technicianId: 9002, name: '박기사', partnerName: '스마트설치', technicianGrade: 'JUNIOR', careerYears: 2, rating: 4.5, completedCount: 130, status: 'ACTIVE' },
];

export const seedPriceRules = [
  { priceRuleId: 1, ruleCode: 'BASE_REFRIGERATOR', ruleName: '냉장고 기본 설치비', categoryId: 1, ruleType: 'BASE', conditionJson: {}, calculationType: 'PER_UNIT', calculationValue: 120000, priority: 10, useYn: 'Y' },
  { priceRuleId: 2, ruleCode: 'BASE_WASHER', ruleName: '세탁기 기본 설치비', categoryId: 2, ruleType: 'BASE', conditionJson: {}, calculationType: 'PER_UNIT', calculationValue: 90000, priority: 10, useYn: 'Y' },
  { priceRuleId: 3, ruleCode: 'BASE_AIRCON', ruleName: '에어컨 기본 설치비', categoryId: 3, ruleType: 'BASE', conditionJson: {}, calculationType: 'PER_UNIT', calculationValue: 150000, priority: 10, useYn: 'Y' },
  { priceRuleId: 4, ruleCode: 'BASE_DRYER', ruleName: '건조기 기본 설치비', categoryId: 4, ruleType: 'BASE', conditionJson: {}, calculationType: 'PER_UNIT', calculationValue: 80000, priority: 10, useYn: 'Y' },
  { priceRuleId: 5, ruleCode: 'BASE_TV', ruleName: 'TV 기본 설치비', categoryId: 5, ruleType: 'BASE', conditionJson: {}, calculationType: 'PER_UNIT', calculationValue: 60000, priority: 10, useYn: 'Y' },
  { priceRuleId: 6, ruleCode: 'REMOVAL_FEE', ruleName: '기존 가전 철거비', categoryId: null, ruleType: 'ADDITIONAL', conditionJson: { removalRequired: true }, calculationType: 'PER_UNIT', calculationValue: 30000, priority: 20, useYn: 'Y' },
  { priceRuleId: 7, ruleCode: 'NO_ELEVATOR_3F', ruleName: '엘리베이터 없는 3층 이상 할증', categoryId: null, ruleType: 'FLOOR', conditionJson: { minFloor: 3, elevator: 'N' }, calculationType: 'PER_ADDRESS', calculationValue: 20000, priority: 30, useYn: 'Y' },
  { priceRuleId: 8, ruleCode: 'WEEKEND_SURCHARGE', ruleName: '주말 할증', categoryId: null, ruleType: 'TIME', conditionJson: { weekend: true }, calculationType: 'PERCENT', calculationValue: 10, priority: 40, useYn: 'Y' },
];

const addr = (addressType, overrides) => ({
  addressType, zipCode: '', address: '', addressDetail: '', floorNo: 1, elevatorYn: 'N', parkingYn: 'N', accessMemo: '', ...overrides,
});

export const seedRequests = [
  {
    moveRequestId: 1,
    requestNo: 'MR20261016-0001',
    requestStatus: 'QUOTED',
    customerName: CURRENT_CUSTOMER.userName,
    requestedDate: '2026-10-25',
    requestedStartTime: '09:00',
    requestedEndTime: '12:00',
    memo: '오전 방문 가능하면 좋겠습니다.',
    estimatedAmount: 290000,
    finalAmount: 0,
    addresses: [
      addr('FROM', { zipCode: '06236', address: '서울특별시 강남구 테헤란로 000', addressDetail: '101동 1203호', floorNo: 12, elevatorYn: 'Y', parkingYn: 'N', accessMemo: '경비실 경유' }),
      addr('TO', { zipCode: '13494', address: '경기도 성남시 분당구 판교역로 000', addressDetail: '302호', floorNo: 3, elevatorYn: 'N', parkingYn: 'Y' }),
    ],
    appliances: [
      { moveApplianceId: 1, categoryId: 1, modelId: 101, brandName: 'LG전자', modelNo: 'RF-LG-A100', applianceName: '디오스 양문형 냉장고 A100', quantity: 1, removalRequired: true, installationRequired: true, specialCondition: '' },
      { moveApplianceId: 2, categoryId: 2, modelId: 201, brandName: 'LG전자', modelNo: 'WM-LG-C300', applianceName: '트롬 세탁기 C300', quantity: 1, removalRequired: true, installationRequired: true, specialCondition: '배수호스 교체 필요 가능성' },
    ],
    quotes: [
      { quoteId: 11, quoteNo: 'Q-0001', technicianId: 9001, technicianName: '김기사', partnerName: '빠른이전설치', quoteStatus: 'SENT', baseAmount: 260000, additionalAmount: 20000, discountAmount: 10000, totalAmount: 270000, validUntil: '2026-10-20T23:59', technicianMemo: '엘리베이터 사용 가능, 철거 포함' },
      { quoteId: 12, quoteNo: 'Q-0002', technicianId: 9002, technicianName: '박기사', partnerName: '스마트설치', quoteStatus: 'SENT', baseAmount: 240000, additionalAmount: 0, discountAmount: 0, totalAmount: 240000, validUntil: '2026-10-21T23:59', technicianMemo: '배수호스는 현장 확인 후 추가 비용 발생 가능' },
    ],
    reservation: null,
    payment: null,
    installation: null,
  },
  {
    moveRequestId: 2,
    requestNo: 'MR20261016-0002',
    requestStatus: 'RESERVED',
    customerName: CURRENT_CUSTOMER.userName,
    requestedDate: '2026-10-18',
    requestedStartTime: '14:00',
    requestedEndTime: '17:00',
    memo: '',
    estimatedAmount: 200000,
    finalAmount: 210000,
    addresses: [
      addr('FROM', { zipCode: '04528', address: '서울특별시 중구 세종대로 000', addressDetail: '상가 1층', floorNo: 2, elevatorYn: 'Y' }),
      addr('TO', { zipCode: '06236', address: '서울특별시 강남구 테헤란로 000', addressDetail: '1203호', floorNo: 12, elevatorYn: 'Y' }),
    ],
    appliances: [
      { moveApplianceId: 3, categoryId: 3, modelId: 301, brandName: '캐리어', modelNo: 'AC-CR-E500', applianceName: '벽걸이 에어컨 E500', quantity: 1, removalRequired: false, installationRequired: true, specialCondition: '실외기 위치 변경 없음' },
    ],
    quotes: [
      { quoteId: 13, quoteNo: 'Q-0003', technicianId: 9001, technicianName: '김기사', partnerName: '빠른이전설치', quoteStatus: 'ACCEPTED', baseAmount: 200000, additionalAmount: 10000, discountAmount: 0, totalAmount: 210000, validUntil: '2026-10-17T23:59', technicianMemo: '배관 연장 10m 이내 포함' },
    ],
    reservation: { reservationId: 21, reservationNo: 'RS-0001', reservationDate: '2026-10-18', startTime: '14:00', endTime: '17:00', status: 'RESERVED', technicianId: 9001, technicianName: '김기사', partnerName: '빠른이전설치' },
    payment: { paymentNo: 'PM-0001', paymentAmount: 210000, paymentStatus: 'READY', paidAt: null },
    installation: {
      installationId: 31,
      status: 'WAITING',
      customerConfirmedYn: 'N',
      startedAt: null,
      completedAt: null,
      items: [
        { moveApplianceId: 3, applianceName: '벽걸이 에어컨 E500', removalStatus: null, transportStatus: 'PENDING', installationStatus: 'PENDING' },
      ],
    },
  },
  {
    moveRequestId: 3,
    requestNo: 'MR20261016-0003',
    requestStatus: 'REQUESTED',
    customerName: '이영희',
    requestedDate: '2026-10-30',
    requestedStartTime: '10:00',
    requestedEndTime: '13:00',
    memo: '',
    estimatedAmount: 60000,
    finalAmount: 0,
    addresses: [
      addr('FROM', { zipCode: '03997', address: '서울특별시 마포구 월드컵로 000', floorNo: 1, elevatorYn: 'N', parkingYn: 'Y' }),
      addr('TO', { zipCode: '03997', address: '서울특별시 마포구 월드컵로 000', floorNo: 1, elevatorYn: 'N', parkingYn: 'Y' }),
    ],
    appliances: [
      { moveApplianceId: 4, categoryId: 5, modelId: 501, brandName: '삼성전자', modelNo: 'TV-SS-G75', applianceName: '75형 QLED TV G75', quantity: 1, removalRequired: false, installationRequired: true, specialCondition: '벽걸이 브라켓 지참 요청' },
    ],
    quotes: [],
    reservation: null,
    payment: null,
    installation: null,
  },
];
