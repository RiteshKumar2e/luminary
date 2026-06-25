import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/AppTopbar.css';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/studio': 'Creative Studio',
  '/story': 'Story Generator',
  '/campaign': 'Campaign Planner',
  '/brand-kit': 'Brand Kit Generator',
  '/assets': 'Asset Library',
  '/history': 'Generation History',
  '/settings': 'Settings',
};

export function AppTopbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'Luminary AI';

  return (
    <header className="app-topbar">
      <h2 className="app-topbar__title">{title}</h2>
      <div className="app-topbar__right">
        <button className="app-topbar__icon-btn" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="app-topbar__avatar">
          {user?.full_name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
