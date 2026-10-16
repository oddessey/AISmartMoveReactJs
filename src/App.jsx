import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import NewRequestPage from './pages/NewRequestPage.jsx';
import RequestListPage from './pages/RequestListPage.jsx';
import RequestDetailPage from './pages/RequestDetailPage.jsx';
import TechnicianPage from './pages/TechnicianPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="requests" element={<RequestListPage />} />
        <Route path="requests/new" element={<NewRequestPage />} />
        <Route path="requests/:id" element={<RequestDetailPage />} />
        <Route path="technician" element={<TechnicianPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<p className="empty">페이지를 찾을 수 없습니다.</p>} />
      </Route>
    </Routes>
  );
}
