import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { getVolunteerEventById, addVolunteerCheckIn } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import Button from '../../../components/common/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './ScanSuccessVolunteerIn.module.css';

const ScanSuccessVolunteerIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eventId } = location.state || {};
  const event = eventId ? getVolunteerEventById(eventId) : null;

  // Record check-in
  if (event && user) {
    addVolunteerCheckIn(user.id, eventId, new Date().toISOString());
  }

  return (
    <div className={styles.successPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h1 className={styles.title}>Your time is being tracked</h1>

        {event && (
          <Card className={styles.eventCard}>
            <h2 className={styles.eventName}>{event.name}</h2>
            <div className={styles.eventDetails}>
              <div className={styles.detailItem}>
                <FiClock className={styles.icon} />
                <span>Checked in at {format(new Date(), 'h:mm a')}</span>
              </div>
              <div className={styles.detailItem}>
                <FiCalendar className={styles.icon} />
                <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </Card>
        )}

        <InfoBox type="warning" className={styles.warningBox}>
          <strong>Important:</strong> Don't forget to scan the check-out QR code when you leave
          to record your volunteer hours accurately.
        </InfoBox>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => navigate('/member/home')}>
            Done
          </Button>
          <Button variant="secondary" onClick={() => navigate('/member/scan-qr')}>
            Simulate Check-Out
          </Button>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default ScanSuccessVolunteerIn;

