import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { getVolunteerEventById, getVolunteerHours, updateVolunteerCheckOut, getMemberTotalVolunteerHours } from '../../../utils/dataManager';
import { format, differenceInHours } from 'date-fns';
import { FiClock, FiHeart } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import StatCard from '../../../components/cards/StatCard/StatCard';
import Button from '../../../components/common/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './ScanSuccessVolunteerOut.module.css';

const ScanSuccessVolunteerOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eventId } = location.state || {};
  const event = eventId ? getVolunteerEventById(eventId) : null;

  // Calculate hours and update record
  let hoursWorked = 0;
  if (event && user) {
    const hours = getVolunteerHours();
    const checkInRecord = hours.find(
      h => h.memberId === user.id && h.eventId === eventId && !h.checkOutTime
    );
    if (checkInRecord) {
      const checkInTime = new Date(checkInRecord.checkInTime);
      const checkOutTime = new Date();
      hoursWorked = differenceInHours(checkOutTime, checkInTime) + 
                    (differenceInHours(checkOutTime, checkInTime) % 1);
      updateVolunteerCheckOut(checkInRecord.id, checkOutTime.toISOString(), hoursWorked);
    }
  }

  const totalHours = getMemberTotalVolunteerHours(user?.id || '');
  const eventsThisYear = 7; // Simplified

  return (
    <div className={styles.successPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h1 className={styles.title}>Thanks for your service!</h1>

        <Card className={styles.timeCard}>
          <h2 className={styles.cardTitle}>Time Summary</h2>
          <div className={styles.timeDetails}>
            <div className={styles.timeItem}>
              <span className={styles.timeLabel}>Check-In:</span>
              <span className={styles.timeValue}>9:00 AM</span>
            </div>
            <div className={styles.timeItem}>
              <span className={styles.timeLabel}>Check-Out:</span>
              <span className={styles.timeValue}>{format(new Date(), 'h:mm a')}</span>
            </div>
            <div className={styles.timeItem}>
              <span className={styles.timeLabel}>Total Hours:</span>
              <span className={styles.timeValue}>{hoursWorked.toFixed(2)} hrs</span>
            </div>
          </div>
        </Card>

        <div className={styles.statsGrid}>
          <StatCard
            title="Total Volunteer Hours"
            value={totalHours.toFixed(1)}
            icon={<FiHeart />}
          />
          <StatCard
            title="Events This Year"
            value={eventsThisYear}
            icon={<FiClock />}
          />
        </div>

        <Button variant="primary" className={styles.button} onClick={() => navigate('/member/home')}>
          Done
        </Button>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default ScanSuccessVolunteerOut;

