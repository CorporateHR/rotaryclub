import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiUserPlus } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import styles from './GuestAdded.module.css';

const GuestAdded = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { guestName, meetingId, meetingTitle } = location.state || {};

  return (
    <div className={styles.successPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h1 className={styles.title}>Guest Added!</h1>
        <p className={styles.subtitle}>
          {guestName} has been successfully registered for the meeting
        </p>

        <Card className={styles.infoCard}>
          <div className={styles.infoItem}>
            <FiUserPlus className={styles.icon} />
            <div>
              <p className={styles.infoLabel}>Guest Name</p>
              <p className={styles.infoValue}>{guestName}</p>
            </div>
          </div>
          {meetingTitle && (
            <div className={styles.infoItem}>
              <div className={styles.infoValue}>{meetingTitle}</div>
            </div>
          )}
        </Card>

        <div className={styles.buttonGroup}>
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/member/add-guest/${meetingId}`)}
          >
            Add Another Guest
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/member/home')}
          >
            Done
          </Button>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default GuestAdded;
