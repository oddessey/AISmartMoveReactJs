import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/StoreContext.jsx';
import AddressForm from '../components/request/AddressForm.jsx';
import ApplianceStep from '../components/request/ApplianceStep.jsx';
import ScheduleStep from '../components/request/ScheduleStep.jsx';
import EstimateSummary from '../components/request/EstimateSummary.jsx';
import { estimateMove } from '../utils/pricing.js';

const STEPS = ['주소 입력', '가전 선택', '희망 일정', '견적 확인'];

const emptyAddress = (addressType) => ({
  addressType, zipCode: '', address: '', addressDetail: '', floorNo: 1, elevatorYn: 'N', parkingYn: 'N', accessMemo: '',
});

export default function NewRequestPage() {
  const { categories, brands, models, priceRules, createRequest } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([emptyAddress('FROM'), emptyAddress('TO')]);
  const [appliances, setAppliances] = useState([]);
  const [schedule, setSchedule] = useState({
    requestedDate: '', requestedStartTime: '09:00', requestedEndTime: '12:00', memo: '',
  });
  const [error, setError] = useState('');

  const estimate = useMemo(
    () => estimateMove({ appliances, addresses, requestedDate: schedule.requestedDate, priceRules, categories }),
    [appliances, addresses, schedule.requestedDate, priceRules, categories]
  );

  const updateAddress = (index, value) =>
    setAddresses((prev) => prev.map((a, i) => (i === index ? value : a)));

  const validate = () => {
    if (step === 0 && addresses.some((a) => !a.address.trim())) return '출발지와 도착지 주소를 입력해 주세요.';
    if (step === 1 && appliances.length === 0) return '이전·설치할 가전을 1개 이상 추가해 주세요.';
    if (step === 2) {
      if (!schedule.requestedDate) return '희망 날짜를 선택해 주세요.';
      if (schedule.requestedStartTime >= schedule.requestedEndTime) return '종료 시간은 시작 시간보다 늦어야 합니다.';
    }
    return '';
  };

  const next = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError('');
    setStep((s) => s + 1);
  };

  const prev = () => {
    setError('');
    setStep((s) => s - 1);
  };

  const submit = () => {
    const id = createRequest({ addresses, appliances, schedule, estimatedAmount: estimate.total });
    navigate(`/requests/${id}`);
  };

  return (
    <>
      <h1>이전설치 신청</h1>
      <div className="steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`step ${i === step ? 'current' : i < step ? 'done' : ''}`}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      {step === 0 && (
        <>
          <AddressForm value={addresses[0]} onChange={(v) => updateAddress(0, v)} />
          <AddressForm value={addresses[1]} onChange={(v) => updateAddress(1, v)} />
        </>
      )}

      {step === 1 && (
        <ApplianceStep
          categories={categories}
          models={models}
          brands={brands}
          appliances={appliances}
          setAppliances={setAppliances}
        />
      )}

      {step === 2 && <ScheduleStep schedule={schedule} setSchedule={setSchedule} />}

      {step === 3 && (
        <EstimateSummary addresses={addresses} appliances={appliances} schedule={schedule} estimate={estimate} />
      )}

      <div className="row spread" style={{ marginTop: 8 }}>
        <button className="btn" onClick={prev} disabled={step === 0}>이전</button>
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" onClick={next}>다음</button>
        ) : (
          <button className="btn btn-primary" onClick={submit}>신청 제출</button>
        )}
      </div>
    </>
  );
}
