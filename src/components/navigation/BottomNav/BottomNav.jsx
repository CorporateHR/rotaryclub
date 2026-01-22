import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiCamera, 
  FiHeart, 
  FiUser,
  FiBarChart2,
  FiPlus
} from 'react-icons/fi';
import styles from './BottomNav.module.css';

const BottomNav = ({ type = 'member' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const memberTabs = [
    { path: '/member/home', icon: FiHome, label: 'Home' },
    { path: '/member/directory', icon: FiUsers, label: 'Directory' },
    { path: '/member/meetings', icon: FiCalendar, label: 'Meetings' },
    { path: '/member/scan-qr', icon: FiCamera, label: 'Scan QR' },
    { path: '/member/volunteers', icon: FiHeart, label: 'Volunteer' },
    { path: '/member/profile', icon: FiUser, label: 'Profile' },
  ];

  const adminTabs = [
    { path: '/admin/home', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/members', icon: FiUsers, label: 'Members' },
    { path: '/admin/events', icon: FiCalendar, label: 'Events' },
    { path: '/admin/volunteers', icon: FiHeart, label: 'Volunteers' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  const tabs = type === 'member' ? memberTabs : adminTabs;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className={styles.bottomNav}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            className={`${styles.navItem} ${isActive(tab.path) ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon className={styles.icon} />
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

