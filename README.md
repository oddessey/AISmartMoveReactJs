# AI 가전 이전설치 플랫폼 - 프론트엔드

`ai_appliance_platform_postgresql_ddl.sql` 스키마를 기준으로 만든 React(Vite) 프론트엔드입니다.
현재는 백엔드가 없으므로 `src/mocks/seed.js`의 mock 데이터로 동작하며, 모든 데이터 변경은 `src/store/StoreContext.jsx`를 통해 이루어집니다.

## 실행 방법

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 프로덕션 빌드
```

Node.js 18 이상을 권장합니다.

## 화면 구성

| 경로 | 화면 | 주요 테이블 |
|---|---|---|
| `/` | 랜딩 | - |
| `/requests/new` | 이전설치 신청 (4단계 마법사: 주소 → 가전 → 일정 → 견적 확인) | move_request, move_address, move_appliance, appliance_model, price_rule |
| `/requests` | 내 신청내역 (상태 필터) | move_request |
| `/requests/:id` | 신청 상세: 주소·가전, 받은 견적 수락, 예약, 결제, 설치 진행 | move_address, move_appliance, quote, reservation, payment, installation, installation_item |
| `/technician` | 기사 페이지: 견적 제출, 예정 작업 진행(작업 시작/항목 상태/설치 완료) | quote, reservation, installation, installation_item |
| `/admin` | 관리자: 신청 현황, 가격 규칙 on/off, 공통 코드 | price_rule, code_group, code |

## 업무 흐름 (상태 전이)

```
REQUESTED(견적 대기) → QUOTED(견적 도착) → RESERVED(예약 완료) → IN_PROGRESS(설치 진행) → COMPLETED(완료)
```

1. 고객이 신청 제출 → `move_request.request_status = REQUESTED`
2. 기사가 견적 제출 → `quote` 생성, 신청 상태 `QUOTED`
3. 고객이 견적 수락 → 다른 견적은 `REJECTED`, `reservation`·`payment(READY)`·`installation(WAITING)` 생성
4. 고객 결제 → `payment.payment_status = PAID`
5. 기사 작업 시작 → `installation.IN_PROGRESS`, 항목별 철거/운송/설치 상태 변경
6. 모든 항목 완료 후 설치 완료 처리 → `COMPLETED`

## 스키마 ↔ 화면 매핑

- **app_user / customer / technician / partner**: 로그인 역할은 데모 데이터(`CURRENT_CUSTOMER`, `CURRENT_TECHNICIAN_ID`)로 고정. 실제로는 인증 후 `user_type`으로 메뉴 분기 필요.
- **appliance_category / appliance_brand / appliance_model**: 신청 화면의 카테고리 → 모델 선택에 사용. 규격·필요 인원·예상 소요시간을 표시.
- **move_address**: `FROM`/`TO` 주소 (층수, 엘리베이터, 주차, 출입 메모).
- **move_appliance**: 이전 대상 가전 (수량, 철거/설치 여부, 특이사항).
- **price_rule**: `BASE`(카테고리별 기본요금), `ADDITIONAL`(철거), `FLOOR`(엘리베이터 없는 고층 할증), `TIME`(주말 할증) 규칙으로 예상 금액 계산. `calculation_type`은 `FIXED / PER_UNIT / PER_ADDRESS / PERCENT` 4종으로 해석.
- **quote / quote_item**: 기사 견적. 현재 화면은 기본·추가·할인 금액 단위이며 `quote_item` 상세는 미표시.
- **reservation / installation / installation_item**: 견적 수락 시 생성.
- **payment**: 결제 대기 → 결제 완료. PG 연동 지점은 `payReservation`.
- **code_group / code**: 관리자 화면에 상수로 표시. 실제로는 API에서 로드.

### 스키마에 값 목록이 없는 상태값 (화면 기준으로 정의한 값)

스키마에는 `DEFAULT`만 있고 허용값이 없는 컬럼이 많아, 아래 값은 화면 흐름에 맞춰 정했습니다. 백엔드와 합의 후 `src/constants/codes.js`만 수정하면 됩니다.

- `move_request.request_status`: DRAFT, REQUESTED, QUOTED, RESERVED, IN_PROGRESS, COMPLETED, CANCELLED
- `installation_item.*_status`: PENDING, WORKING, DONE
- `installation.status`: WAITING, IN_PROGRESS, COMPLETED
- `reservation.status`: RESERVED, CONFIRMED, COMPLETED, CANCELLED

## 백엔드 연동 방법

1. `vite.config.js`의 proxy(`/api` → `http://localhost:8080`)를 실제 서버 주소로 맞춥니다.
2. `StoreContext.jsx`의 각 액션(`createRequest`, `submitQuote`, `acceptQuote`, `payReservation`, `startInstallation`, `updateInstallationItem`, `completeInstallation`, `togglePriceRule`)을 `fetch('/api/...')` 호출로 바꾸고, 응답을 상태에 반영합니다.
3. 초기 데이터는 `useEffect`에서 `GET /api/requests`, `GET /api/categories`, `GET /api/models` 등으로 로드합니다.
4. `estimateMove`(`src/utils/pricing.js`)는 화면 미리보기용입니다. 최종 금액은 서버 계산 결과를 사용하는 것을 권장합니다.

## 아직 구현하지 않은 항목 (다음 단계 제안)

- 로그인/회원가입 및 역할별 라우팅 (`app_user.user_type`)
- 주소 검색 (다음/카카오 우편번호 서비스 연동)
- AI 가전 인식 및 분석 결과 화면 (`ai_analysis`, `ai_analysis_item`)
- 리뷰 작성, 문의(`cs_inquiry`, `cs_answer`), 알림(`notification`)
- 정산 화면(`settlement`), 환불(`refund`)
- 기사 서비스 지역/업무 가능 시간(`technician_service_area`, `business_hours`) 설정
