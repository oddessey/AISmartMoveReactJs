import { TIME_OPTIONS, todayISO } from '../../utils/format.js';

export default function ScheduleStep({ schedule, setSchedule }) {
  const set = (key) => (e) => setSchedule({ ...schedule, [key]: e.target.value });

  return (
    <div className="card">
      <h2>희망 일정</h2>
      <div className="field">
        <label>희망 날짜 *</label>
        <input type="date" min={todayISO()} value={schedule.requestedDate} onChange={set('requestedDate')} />
      </div>
      <div className="grid-2">
        <div className="field">
          <label>시작 시간</label>
          <select value={schedule.requestedStartTime} onChange={set('requestedStartTime')}>
            {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label>종료 시간</label>
          <select value={schedule.requestedEndTime} onChange={set('requestedEndTime')}>
            {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label>요청 메모</label>
        <textarea value={schedule.memo} onChange={set('memo')} placeholder="기사에게 전달할 내용" />
      </div>
      <p className="muted">※ 주말 날짜를 선택하면 주말 할증이 적용됩니다.</p>
    </div>
  );
}
