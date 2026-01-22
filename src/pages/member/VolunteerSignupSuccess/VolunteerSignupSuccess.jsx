import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import styles from './VolunteerSignupSuccess.module.css';

const VolunteerSignupSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event, role } = location.state || {};

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className={styles.successPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles.subtitle}>You've successfully signed up for this volunteer event.</p>

        <Card className={styles.summaryCard}>
          <h2 className={styles.cardTitle}>Event Summary</h2>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryItem}>
              <strong>Event:</strong> {event.name}
            </div>
            <div className={styles.summaryItem}>
              <FiCalendar className={styles.icon} />
              <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className={styles.summaryItem}>
              <FiClock className={styles.icon} />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className={styles.summaryItem}>
              <FiMapPin className={styles.icon} />
              <span>{event.location}</span>
            </div>
            {role && (
              <div className={styles.summaryItem}>
                <strong>Your Role:</strong> {role}
              </div>
            )}
          </div>
        </Card>

        <InfoBox type="info" className={styles.infoBox}>
          <strong>What's Next?</strong>
          <br />
          • You'll receive a reminder email 24 hours before the event
          <br />
          • When you arrive, scan the check-in QR code at the venue
          <br />
          • When you leave, scan the check-out QR code to track your hours
          <br />
          • Your volunteer hours will be automatically recorded
        </InfoBox>

        <Button
          variant="primary"
          className={styles.button}
          onClick={() => navigate('/member/volunteers')}
        >
          Back to Opportunities
        </Button>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default VolunteerSignupSuccess;

