import { Link } from 'react-router-dom';

const STEPS = [
  { title: '주소·가전 입력', desc: '출발지와 도착지, 이전·설치할 가전을 입력하세요.' },
  { title: '견적 비교', desc: '검증된 기사들의 견적을 한눈에 비교하세요.' },
  { title: '예약·결제', desc: '원하는 기사와 날짜를 예약하고 결제하세요.' },
  { title: '설치 완료', desc: '철거·운송·설치 진행 상황을 실시간으로 확인하세요.' },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>가전 이전설치, 한 번에 해결하세요</h1>
        <p className="muted">이사·교체 시 필요한 철거, 운송, 설치를 검증된 기사와 연결해 드립니다.</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
          <Link to="/requests/new" className="btn btn-primary">이전설치 신청하기</Link>
          <Link to="/requests" className="btn">내 신청내역 보기</Link>
        </div>
      </section>
      <div className="feature-grid">
        {STEPS.map((s, i) => (
          <div className="feature" key={s.title}>
            <div className="num">STEP {i + 1}</div>
            <h3>{s.title}</h3>
            <p className="muted" style={{ margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
