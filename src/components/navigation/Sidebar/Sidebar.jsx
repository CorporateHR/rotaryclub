import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiHeart, 
  FiBarChart2,
  FiLogOut
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/home', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/members', icon: FiUsers, label: 'Members' },
    { path: '/admin/meetings', icon: FiCalendar, label: 'Meetings' },
    { path: '/admin/volunteers', icon: FiHeart, label: 'Volunteers' },
    { path: '/admin/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menu}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </div>
      <button className={styles.logoutButton} onClick={handleLogout}>
        <FiLogOut className={styles.icon} />
        <span className={styles.label}>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

