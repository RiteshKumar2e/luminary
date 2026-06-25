import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/AppSidebar';
import { AppTopbar } from '../components/AppTopbar';
import '../styles/AppLayout.css';

export function AppLayout() {
  return (
    <div className="app-layout">
      <AppSidebar />
      <div className="app-main">
        <AppTopbar />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
