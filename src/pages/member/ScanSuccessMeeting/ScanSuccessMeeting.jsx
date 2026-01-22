import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { getMeetingById, addAttendance } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import StatCard from '../../../components/cards/StatCard/StatCard';
import Button from '../../../components/common/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './ScanSuccessMeeting.module.css';

const ScanSuccessMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { meetingId } = location.state || {};
  const meeting = meetingId ? getMeetingById(meetingId) : null;

  // Record attendance
  if (meeting && user) {
    const existingAttendance = JSON.parse(localStorage.getItem('clubtracker_attendance') || '[]');
    const alreadyCheckedIn = existingAttendance.some(
      a => a.memberId === user.id && a.meetingId === meetingId
    );
    if (!alreadyCheckedIn) {
      addAttendance(user.id, meetingId, new Date().toISOString());
    }
  }

  const meetingsAttended = 16; // Simplified

  return (
    <div className={styles.successPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h1 className={styles.title}>Checked In!</h1>

        {meeting && (
          <Card className={styles.meetingCard}>
            <h2 className={styles.meetingName}>{meeting.title}</h2>
            <div className={styles.meetingDetails}>
              <div className={styles.detailItem}>
                <FiClock className={styles.icon} />
                <span>Checked in at {format(new Date(), 'h:mm a')}</span>
              </div>
              <div className={styles.detailItem}>
                <FiCalendar className={styles.icon} />
                <span>{format(new Date(meeting.date), 'MMM d, yyyy')}</span>
              </div>
              <div className={styles.detailItem}>
                <FiMapPin className={styles.icon} />
                <span>{meeting.location}</span>
              </div>
            </div>
          </Card>
        )}

        <div className={styles.statsGrid}>
          <StatCard
            title="Members Checked In"
            value="42"
            icon={<FiUsers />}
          />
          <StatCard
            title="Your Meetings This Year"
            value={meetingsAttended}
            icon={<FiCalendar />}
          />
        </div>

        <div className={styles.buttonGroup}>
          <Button variant="secondary" className={styles.button} onClick={() => navigate(`/member/add-guest/${meetingId}`)}>
            Add Guest
          </Button>
          <Button variant="primary" className={styles.button} onClick={() => navigate('/member/home')}>
            Done
          </Button>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default ScanSuccessMeeting;

