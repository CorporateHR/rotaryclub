import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getMemberById, getMemberAttendance, getMemberTotalVolunteerHours } from '../../../utils/dataManager';
import { getMemberBadgeProgress, getProgressPercentage } from '../../../data/badgeData';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Avatar from '../../../components/common/Avatar/Avatar';
import ProgressBar from '../../../components/common/ProgressBar/ProgressBar';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const member = user ? getMemberById(user.id) : null;

  if (!member) {
    return <div>Loading...</div>;
  }

  const attendance = getMemberAttendance(member.id);
  const attendancePercent = Math.min(100, (attendance.length / 16) * 100);
  const volunteerHours = getMemberTotalVolunteerHours(member.id);
  const eventsParticipated = 7; // Simplified
  const badgeProgress = getMemberBadgeProgress(member.id);
  const badgePercentage = getProgressPercentage(member.id);

  return (
    <div className={styles.profilePage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <Avatar name={member.name} size="xl" />
          <h1 className={styles.name}>{member.name}</h1>
          <p className={styles.memberNumber}>Member #{member.memberNumber}</p>
          <p className={styles.joinYear}>Joined {member.joinYear}</p>
        </div>

        <Card className={styles.contactCard}>
          <h2 className={styles.cardTitle}>Contact Information</h2>
          <div className={styles.contactDetails}>
            <div className={styles.contactItem}>
              <strong>Email:</strong> {member.email}
            </div>
            <div className={styles.contactItem}>
              <strong>Phone:</strong> {member.phone}
            </div>
            <div className={styles.contactItem}>
              <strong>Address:</strong> {member.address}
            </div>
          </div>
        </Card>

        <Card className={styles.badgeCard}>
          <h2 className={styles.cardTitle}>Badge Status</h2>
          <div className={styles.badgeStatus}>
            <div className={styles.badgeIconWrapper} style={{ backgroundColor: badgeProgress.badgeColor }}>
              <span className={styles.badgeEmoji}>
                {badgeProgress.currentBadge === 'red' ? '🔴' : '🔵'}
              </span>
            </div>
            <div className={styles.badgeInfo}>
              <h3 className={styles.badgeTitle}>
                {badgeProgress.currentBadge === 'red' ? 'Red Badge' : 'Blue Badge'}
              </h3>
              <p className={styles.badgeDescription}>
                {badgeProgress.currentBadge === 'red' 
                  ? `${badgePercentage}% complete - Keep going!`
                  : 'Congratulations! Badge earned'}
              </p>
              {badgeProgress.currentBadge === 'red' && (
                <ProgressBar value={badgePercentage} />
              )}
            </div>
          </div>
          <Button 
            variant="primary" 
            size="sm"
            className={styles.viewBadgeButton}
            onClick={() => navigate('/member/badge-progress')}
          >
            View Progress
          </Button>
        </Card>

        <Card className={styles.activityCard}>
          <h2 className={styles.cardTitle}>2024 Activity Summary</h2>
          <div className={styles.activityStats}>
            <div className={styles.statItem}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Meeting Attendance</span>
                <span className={styles.statValue}>{Math.round(attendancePercent)}%</span>
              </div>
              <ProgressBar value={attendancePercent} />
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Volunteer Hours</span>
              <span className={styles.statValue}>{volunteerHours.toFixed(1)} hrs</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Events Participated</span>
              <span className={styles.statValue}>{eventsParticipated}</span>
            </div>
          </div>
        </Card>

        <Card className={styles.achievementsCard}>
          <h2 className={styles.cardTitle}>Achievements</h2>
          <div className={styles.achievements}>
            {attendancePercent >= 100 && (
              <Badge variant="success">Perfect Attendance</Badge>
            )}
            {volunteerHours >= 30 && (
              <Badge variant="purple">Top 10 Volunteer</Badge>
            )}
            {member.joinYear >= 2023 && (
              <Badge variant="info">Rising Star</Badge>
            )}
          </div>
        </Card>

        <Button 
          variant="secondary" 
          className={styles.editButton}
          onClick={() => navigate('/member/profile/edit')}
        >
          Edit Profile
        </Button>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default Profile;

