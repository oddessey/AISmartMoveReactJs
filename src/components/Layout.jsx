import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand">🔧 AI 가전 이전설치</NavLink>
        <nav>
          <NavLink to="/requests/new">이전설치 신청</NavLink>
          <NavLink to="/requests">내 신청내역</NavLink>
          <NavLink to="/technician">기사 페이지</NavLink>
          <NavLink to="/admin">관리자</NavLink>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">© AI 가전 이전설치 플랫폼 · 프론트엔드 데모</footer>
    </div>
  );
}
