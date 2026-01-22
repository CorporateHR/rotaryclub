import { useParams, useNavigate } from 'react-router-dom';
import { getMeetingById } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowLeft } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import styles from './MeetingDetail.module.css';

const MeetingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meeting = getMeetingById(id);

  if (!meeting) {
    return (
      <div>
        <Header currentView="member" />
        <div className={styles.container}>
          <p>Meeting not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/member/meetings')}>
          <FiArrowLeft /> Back to Meetings
        </button>

        <h1 className={styles.title}>{meeting.title}</h1>

        <Card className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Event Information</h2>
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <FiCalendar className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Date</div>
                <div className={styles.detailValue}>{format(new Date(meeting.date), 'EEEE, MMMM d, yyyy')}</div>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiClock className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Time</div>
                <div className={styles.detailValue}>{meeting.startTime} - {meeting.endTime}</div>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiMapPin className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Location</div>
                <div className={styles.detailValue}>{meeting.location}</div>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiUsers className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Expected Attendance</div>
                <div className={styles.detailValue}>{meeting.expectedAttendance} members</div>
              </div>
            </div>
          </div>
        </Card>

        {meeting.agenda && meeting.agenda.length > 0 && (
          <Card className={styles.agendaCard}>
            <h2 className={styles.cardTitle}>Agenda</h2>
            <ul className={styles.agendaList}>
              {meeting.agenda.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Card>
        )}

        <InfoBox type="info" className={styles.infoBox}>
          <strong>QR Code Check-In:</strong> When you arrive at the meeting, scan the QR code
          displayed at the venue to check in automatically. Your attendance will be recorded
          immediately.
        </InfoBox>

        <Button
          variant="primary"
          className={styles.scanButton}
          onClick={() => navigate('/member/scan-qr')}
        >
          Scan QR to Check In
        </Button>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default MeetingDetail;

