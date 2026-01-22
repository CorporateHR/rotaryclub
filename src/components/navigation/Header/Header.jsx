import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ currentView = 'login' }) => {
  const navigate = useNavigate();

  const handleViewChange = (view) => {
    if (view === 'login') {
      navigate('/login');
    } else if (view === 'member') {
      navigate('/member/home');
    } else if (view === 'admin') {
      navigate('/admin/home');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img src="/riemblem_c_large.gif.jpeg" alt="Rotary International" className={styles.logoImage} />
          <h1 className={styles.logo}>Livermore Valley Rotary Club</h1>
        </div>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${currentView === 'login' ? styles.active : ''}`}
            onClick={() => handleViewChange('login')}
          >
            Login
          </button>
          <button
            className={`${styles.navButton} ${currentView === 'member' ? styles.active : ''}`}
            onClick={() => handleViewChange('member')}
          >
            Member View
          </button>
          <button
            className={`${styles.navButton} ${currentView === 'admin' ? styles.active : ''}`}
            onClick={() => handleViewChange('admin')}
          >
            Admin View
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

