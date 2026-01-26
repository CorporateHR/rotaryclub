import { useParams, useNavigate } from 'react-router-dom';
import { getMeetingById, getMemberById } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
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

  const openInMaps = (location) => {
    const encodedLocation = encodeURIComponent(location);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMac = /Macintosh/.test(navigator.userAgent);
    
    if (isIOS || isMac) {
      // Try Apple Maps first on iOS/Mac
      window.open(`maps://maps.apple.com/?q=${encodedLocation}`, '_blank');
      // Fallback to Google Maps if Apple Maps doesn't open
      setTimeout(() => {
        window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
      }, 500);
    } else {
      // Use Google Maps for Android and other platforms
      window.open(`https://maps.google.com/?q=${encodedLocation}`, '_blank');
    }
  };

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
              <FiUsers className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Expected Attendance</div>
                <div className={styles.detailValue}>{meeting.expectedAttendance} members</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className={styles.locationCard}>
          <h2 className={styles.cardTitle}>Location</h2>
          <div className={styles.locationWrapper}>
            <div className={styles.locationHeader}>
              <div className={styles.locationText}>
                <FiMapPin className={styles.locationIcon} />
                <span>{meeting.location}</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openInMaps(meeting.location)}
                className={styles.openMapsButton}
              >
                <FiExternalLink /> Open in Maps
              </Button>
            </div>
            <div className={styles.mapContainer}>
              <iframe
                className={styles.mapIframe}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(meeting.location)}&output=embed`}
                title="Location Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
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

        {meeting.meetingRoles && Object.keys(meeting.meetingRoles).length > 0 && (
          <Card className={styles.rolesCard}>
            <h2 className={styles.cardTitle}>Meeting Roles</h2>
            <div className={styles.rolesList}>
              <div className={styles.roleItem}>
                <span className={styles.roleLabel}>President:</span>
                <span className={styles.roleMember}>
                  {meeting.meetingRoles.president ? getMemberById(meeting.meetingRoles.president)?.name : 'Not assigned'}
                </span>
              </div>
              <div className={styles.roleItem}>
                <span className={styles.roleLabel}>Greeter:</span>
                <span className={styles.roleMember}>
                  {meeting.meetingRoles.greeter ? getMemberById(meeting.meetingRoles.greeter)?.name : 'Not assigned'}
                </span>
              </div>
              <div className={styles.roleItem}>
                <span className={styles.roleLabel}>Joke of the Day:</span>
                <span className={styles.roleMember}>
                  {meeting.meetingRoles.jokeOfTheDay ? getMemberById(meeting.meetingRoles.jokeOfTheDay)?.name : 'Not assigned'}
                </span>
              </div>
              <div className={styles.roleItem}>
                <span className={styles.roleLabel}>Thought of the Day:</span>
                <span className={styles.roleMember}>
                  {meeting.meetingRoles.thoughtOfTheDay ? getMemberById(meeting.meetingRoles.thoughtOfTheDay)?.name : 'Not assigned'}
                </span>
              </div>
            </div>
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

