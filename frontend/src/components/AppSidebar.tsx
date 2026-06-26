import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, BookOpen, Megaphone,
  Palette, Archive, Clock, Settings, LogOut, MessageCircleHeart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/AppSidebar.css';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/muse', icon: MessageCircleHeart, label: 'Creative Muse', badge: 'NEW' },
  { to: '/studio', icon: Sparkles, label: 'Creative Studio' },
  { to: '/story', icon: BookOpen, label: 'Story Generator' },
  { to: '/campaign', icon: Megaphone, label: 'Campaign Planner' },
  { to: '/brand-kit', icon: Palette, label: 'Brand Kit' },
  { to: '/assets', icon: Archive, label: 'Asset Library' },
  { to: '/history', icon: Clock, label: 'History' },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">✦</span>
        <span className="logo-text">Luminary</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-nav__item${isActive ? ' active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {badge && <span className="sidebar-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-nav__item${isActive ? ' active' : ''}`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <div className="sidebar-user">
          <div className="sidebar-user__avatar">
            {user?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user__info">
            <span className="sidebar-user__name">{user?.full_name}</span>
            <span className="sidebar-user__plan">{user?.plan} plan</span>
          </div>
          <button className="sidebar-user__logout" onClick={handleLogout} title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
