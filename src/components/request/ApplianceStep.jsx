import { useMemo, useState } from 'react';

export default function ApplianceStep({ categories, models, brands, appliances, setAppliances }) {
  const [categoryId, setCategoryId] = useState('');
  const [modelId, setModelId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [removalRequired, setRemovalRequired] = useState(true);
  const [installationRequired, setInstallationRequired] = useState(true);
  const [specialCondition, setSpecialCondition] = useState('');

  const modelsInCategory = useMemo(
    () => models.filter((m) => m.categoryId === Number(categoryId)),
    [models, categoryId]
  );
  const selected = models.find((m) => m.modelId === Number(modelId));
  const brandName = (id) => brands.find((b) => b.brandId === id)?.brandName ?? '';

  const add = () => {
    if (!selected) return;
    setAppliances((prev) => [...prev, {
      moveApplianceId: Date.now(),
      categoryId: selected.categoryId,
      modelId: selected.modelId,
      brandName: brandName(selected.brandId),
      modelNo: selected.modelNo,
      applianceName: selected.modelName,
      quantity: Number(quantity),
      removalRequired,
      installationRequired,
      specialCondition,
    }]);
    setModelId('');
    setQuantity(1);
    setSpecialCondition('');
  };

  const remove = (id) => setAppliances((prev) => prev.filter((a) => a.moveApplianceId !== id));

  return (
    <>
      <div className="card">
        <h2>가전 추가</h2>
        <div className="grid-2">
          <div className="field">
            <label>카테고리</label>
            <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setModelId(''); }}>
              <option value="">선택하세요</option>
              {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
          </div>
          <div className="field">
            <label>모델</label>
            <select value={modelId} onChange={(e) => setModelId(e.target.value)} disabled={!categoryId}>
              <option value="">선택하세요</option>
              {modelsInCategory.map((m) => (
                <option key={m.modelId} value={m.modelId}>
                  {brandName(m.brandId)} · {m.modelName} ({m.modelNo})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selected && (
          <p className="muted">
            규격 {selected.widthMm}×{selected.heightMm}×{selected.depthMm}mm · 무게 {selected.weightKg}kg ·
            필요 인원 {selected.requiredPersons}명 · 예상 소요 {selected.defaultInstallTime}분 · 난이도 {selected.difficultyLevel}
          </p>
        )}

        <div className="grid-2">
          <div className="field">
            <label>수량</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div className="field">
            <label>특이사항</label>
            <input value={specialCondition} onChange={(e) => setSpecialCondition(e.target.value)} placeholder="예: 배수호스 교체 필요" />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 12 }}>
          <label className="check">
            <input type="checkbox" checked={removalRequired} onChange={(e) => setRemovalRequired(e.target.checked)} />
            기존 가전 철거 필요
          </label>
          <label className="check">
            <input type="checkbox" checked={installationRequired} onChange={(e) => setInstallationRequired(e.target.checked)} />
            신규 설치 필요
          </label>
        </div>
        <button className="btn btn-primary" onClick={add} disabled={!selected}>가전 추가</button>
      </div>

      <div className="card">
        <h2>선택한 가전 ({appliances.length})</h2>
        {appliances.length === 0 ? (
          <p className="muted">아직 추가된 가전이 없습니다.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>가전</th><th>수량</th><th>철거</th><th>설치</th><th></th></tr>
            </thead>
            <tbody>
              {appliances.map((a) => (
                <tr key={a.moveApplianceId}>
                  <td>
                    <strong>{a.applianceName}</strong>
                    <div className="muted">{a.brandName} · {a.modelNo}</div>
                    {a.specialCondition && <div className="muted">특이사항: {a.specialCondition}</div>}
                  </td>
                  <td>{a.quantity}</td>
                  <td>{a.removalRequired ? '예' : '아니오'}</td>
                  <td>{a.installationRequired ? '예' : '아니오'}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(a.moveApplianceId)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
