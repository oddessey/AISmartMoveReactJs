import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  categories, brands, models, technicians, seedRequests, seedPriceRules,
  CURRENT_CUSTOMER, CURRENT_TECHNICIAN_ID,
} from '../mocks/seed.js';
import { yyyymmdd } from '../utils/format.js';

// 실제 백엔드 연동 시 이 파일의 액션들을 REST 호출(fetch)로 교체하면 됩니다.
const StoreContext = createContext(null);
const stamp = () => Date.now();

export function StoreProvider({ children }) {
  const [requests, setRequests] = useState(seedRequests);
  const [priceRules, setPriceRules] = useState(seedPriceRules);

  const getRequest = useCallback((id) => requests.find((r) => r.moveRequestId === id), [requests]);

  const patchRequest = useCallback((id, fn) => {
    setRequests((prev) => prev.map((r) => (r.moveRequestId === id ? fn(r) : r)));
  }, []);

  // move_request + move_address + move_appliance 생성
  const createRequest = useCallback(({ addresses, appliances, schedule, estimatedAmount }) => {
    const newId = requests.reduce((m, r) => Math.max(m, r.moveRequestId), 0) + 1;
    const req = {
      moveRequestId: newId,
      requestNo: `MR${yyyymmdd()}-${String(newId).padStart(4, '0')}`,
      requestStatus: 'REQUESTED',
      customerName: CURRENT_CUSTOMER.userName,
      requestedDate: schedule.requestedDate,
      requestedStartTime: schedule.requestedStartTime,
      requestedEndTime: schedule.requestedEndTime,
      memo: schedule.memo,
      estimatedAmount,
      finalAmount: 0,
      addresses,
      appliances: appliances.map((a, i) => ({ ...a, moveApplianceId: i + 1 })),
      quotes: [],
      reservation: null,
      payment: null,
      installation: null,
    };
    setRequests((prev) => [...prev, req]);
    return newId;
  }, [requests]);

  // quote 생성 (기사 견적 제출)
  const submitQuote = useCallback((requestId, form) => {
    patchRequest(requestId, (r) => {
      const base = Number(form.baseAmount) || 0;
      const add = Number(form.additionalAmount) || 0;
      const disc = Number(form.discountAmount) || 0;
      const quote = {
        quoteId: stamp(),
        quoteNo: `Q-${stamp()}`,
        technicianId: form.technicianId,
        technicianName: form.technicianName,
        partnerName: form.partnerName,
        quoteStatus: 'SENT',
        baseAmount: base,
        additionalAmount: add,
        discountAmount: disc,
        totalAmount: base + add - disc,
        validUntil: form.validUntil,
        technicianMemo: form.memo,
      };
      return {
        ...r,
        requestStatus: r.requestStatus === 'REQUESTED' ? 'QUOTED' : r.requestStatus,
        quotes: [...r.quotes, quote],
      };
    });
  }, [patchRequest]);

  // 견적 수락 → reservation, payment(READY), installation(WAITING) 생성
  const acceptQuote = useCallback((requestId, quoteId) => {
    patchRequest(requestId, (r) => {
      const q = r.quotes.find((x) => x.quoteId === quoteId);
      if (!q) return r;
      const ts = stamp();
      return {
        ...r,
        requestStatus: 'RESERVED',
        finalAmount: q.totalAmount,
        quotes: r.quotes.map((x) => {
          if (x.quoteId === quoteId) return { ...x, quoteStatus: 'ACCEPTED' };
          return x.quoteStatus === 'SENT' ? { ...x, quoteStatus: 'REJECTED' } : x;
        }),
        reservation: {
          reservationId: ts,
          reservationNo: `RS-${ts}`,
          reservationDate: r.requestedDate,
          startTime: r.requestedStartTime,
          endTime: r.requestedEndTime,
          status: 'RESERVED',
          technicianId: q.technicianId,
          technicianName: q.technicianName,
          partnerName: q.partnerName,
        },
        payment: { paymentNo: `PM-${ts}`, paymentAmount: q.totalAmount, paymentStatus: 'READY', paidAt: null },
        installation: {
          installationId: ts,
          status: 'WAITING',
          customerConfirmedYn: 'N',
          startedAt: null,
          completedAt: null,
          items: r.appliances
            .filter((a) => a.installationRequired)
            .map((a) => ({
              moveApplianceId: a.moveApplianceId,
              applianceName: a.applianceName,
              removalStatus: a.removalRequired ? 'PENDING' : null,
              transportStatus: 'PENDING',
              installationStatus: 'PENDING',
            })),
        },
      };
    });
  }, [patchRequest]);

  // payment 결제 완료 (PG 연동 지점)
  const payReservation = useCallback((requestId) => {
    patchRequest(requestId, (r) => (r.payment
      ? { ...r, payment: { ...r.payment, paymentStatus: 'PAID', paidAt: new Date().toISOString() } }
      : r));
  }, [patchRequest]);

  // installation 작업 시작
  const startInstallation = useCallback((requestId) => {
    patchRequest(requestId, (r) => ({
      ...r,
      requestStatus: 'IN_PROGRESS',
      reservation: r.reservation && { ...r.reservation, status: 'CONFIRMED' },
      installation: r.installation && {
        ...r.installation,
        status: 'IN_PROGRESS',
        startedAt: new Date().toISOString(),
      },
    }));
  }, [patchRequest]);

  // installation_item 상태 변경
  const updateInstallationItem = useCallback((requestId, moveApplianceId, field, value) => {
    patchRequest(requestId, (r) => ({
      ...r,
      installation: r.installation && {
        ...r.installation,
        items: r.installation.items.map((it) =>
          (it.moveApplianceId === moveApplianceId ? { ...it, [field]: value } : it)),
      },
    }));
  }, [patchRequest]);

  // 설치 완료
  const completeInstallation = useCallback((requestId) => {
    patchRequest(requestId, (r) => ({
      ...r,
      requestStatus: 'COMPLETED',
      reservation: r.reservation && { ...r.reservation, status: 'COMPLETED' },
      installation: r.installation && {
        ...r.installation,
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
      },
    }));
  }, [patchRequest]);

  const togglePriceRule = useCallback((priceRuleId) => {
    setPriceRules((prev) => prev.map((p) =>
      (p.priceRuleId === priceRuleId ? { ...p, useYn: p.useYn === 'Y' ? 'N' : 'Y' } : p)));
  }, []);

  const value = useMemo(() => ({
    categories, brands, models, technicians, priceRules,
    requests, getRequest,
    createRequest, submitQuote, acceptQuote, payReservation,
    startInstallation, updateInstallationItem, completeInstallation, togglePriceRule,
    currentCustomer: CURRENT_CUSTOMER,
    currentTechnicianId: CURRENT_TECHNICIAN_ID,
  }), [
    priceRules, requests, getRequest, createRequest, submitQuote, acceptQuote, payReservation,
    startInstallation, updateInstallationItem, completeInstallation, togglePriceRule,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
