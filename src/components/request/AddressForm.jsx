import { ADDRESS_TYPE } from '../../constants/codes.js';

export default function AddressForm({ value, onChange }) {
  const set = (key) => (e) => onChange({ ...value, [key]: e.target.value });

  return (
    <div className="card">
      <h2>{ADDRESS_TYPE[value.addressType]}</h2>
      <div className="grid-2">
        <div className="field">
          <label>우편번호</label>
          <input value={value.zipCode} onChange={set('zipCode')} placeholder="예: 06236" />
        </div>
        <div className="field">
          <label>주소 *</label>
          <input value={value.address} onChange={set('address')} placeholder="도로명 주소" />
        </div>
      </div>
      <div className="field">
        <label>상세 주소</label>
        <input value={value.addressDetail} onChange={set('addressDetail')} placeholder="동/호수" />
      </div>
      <div className="grid-3">
        <div className="field">
          <label>층수</label>
          <input type="number" min="1" value={value.floorNo} onChange={set('floorNo')} />
        </div>
        <div className="field">
          <label>엘리베이터</label>
          <select value={value.elevatorYn} onChange={set('elevatorYn')}>
            <option value="Y">있음</option>
            <option value="N">없음</option>
          </select>
        </div>
        <div className="field">
          <label>주차 가능</label>
          <select value={value.parkingYn} onChange={set('parkingYn')}>
            <option value="Y">가능</option>
            <option value="N">불가</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>출입 메모</label>
        <textarea value={value.accessMemo} onChange={set('accessMemo')} placeholder="경비실, 출입 코드 등" />
      </div>
    </div>
  );
}
