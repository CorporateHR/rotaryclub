import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById, getMemberAttendance, getMemberTotalVolunteerHours } from '../../../utils/dataManager';
import { FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Avatar from '../../../components/common/Avatar/Avatar';
import ProgressBar from '../../../components/common/ProgressBar/ProgressBar';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import styles from './MemberDetail.module.css';

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = getMemberById(id);

  if (!member) {
    return <div>Member not found</div>;
  }

  const attendance = getMemberAttendance(id);
  const attendancePercent = Math.min(100, (attendance.length / 16) * 100);
  const volunteerHours = getMemberTotalVolunteerHours(id);
  const eventsParticipated = 7;

  const getRoleLabel = (role) => {
    const labels = {
      president: 'President',
      secretary: 'Secretary',
      treasurer: 'Treasurer',
      board: 'Board Member',
      active: 'Active Member',
      new: 'New Member',
    };
    return labels[role] || 'Member';
  };

  return (
    <div className={styles.detailPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/member/directory')}>
          Back to Directory
        </button>

        <div className={styles.profileHeader}>
          <Avatar name={member.name} size="xl" />
          <h1 className={styles.name}>{member.name}</h1>
          <Badge variant="purple">{getRoleLabel(member.role)}</Badge>
          <p className={styles.joinDate}>Joined {member.joinYear}</p>
        </div>

        <Card className={styles.contactCard}>
          <h2 className={styles.cardTitle}>Contact Information</h2>
          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <FiPhone className={styles.icon} />
              <a href={`tel:${member.phone}`}>{member.phone}</a>
            </div>
            <div className={styles.contactItem}>
              <FiMail className={styles.icon} />
              <a href={`mailto:${member.email}`}>{member.email}</a>
            </div>
            <div className={styles.contactItem}>
              <span>{member.address}</span>
            </div>
          </div>
        </Card>

        <Card className={styles.statsCard}>
          <h2 className={styles.cardTitle}>2024 Statistics</h2>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Meeting Attendance</span>
                <span className={styles.statValue}>{Math.round(attendancePercent)}%</span>
              </div>
              <ProgressBar value={attendancePercent} />
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Volunteer Hours</span>
              <span className={styles.statValue}>{volunteerHours.toFixed(1)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Events</span>
              <span className={styles.statValue}>{eventsParticipated}</span>
            </div>
          </div>
        </Card>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => window.location.href = `tel:${member.phone}`}>
            <FiPhone /> Call
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = `sms:${member.phone}`}>
            <FiMessageCircle /> Message
          </Button>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default MemberDetail;

