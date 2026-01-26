import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  getMeetings, 
  getVolunteerEvents, 
  getMemberAttendance, 
  getMemberTotalVolunteerHours 
} from '../../../utils/dataManager';
import { getMemberBadgeProgress, getProgressPercentage } from '../../../data/badgeData';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiGrid, FiUsers, FiHeart, FiUser, FiDollarSign, FiAward } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import StatCard from '../../../components/cards/StatCard/StatCard';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import styles from './Home.module.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    meetingsAttended: 0,
    volunteerHours: 0,
  });
  const [nextMeeting, setNextMeeting] = useState(null);
  const [upcomingVolunteer, setUpcomingVolunteer] = useState(null);
  const [badgeProgress, setBadgeProgress] = useState(null);
  const [badgePercentage, setBadgePercentage] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Calculate stats
    const attendance = getMemberAttendance(user.id);
    const hours = getMemberTotalVolunteerHours(user.id);

    setStats({
      meetingsAttended: attendance.length,
      volunteerHours: hours,
    });

    // Get next meeting
    const meetings = getMeetings();
    const upcoming = meetings
      .filter(m => new Date(m.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    setNextMeeting(upcoming);

    // Get upcoming volunteer event
    const events = getVolunteerEvents();
    const upcomingEvent = events
      .filter(e => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    setUpcomingVolunteer(upcomingEvent);

    // Get badge progress
    const progress = getMemberBadgeProgress(user.id);
    const percentage = getProgressPercentage(user.id);
    setBadgeProgress(progress);
    setBadgePercentage(percentage);
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.homePage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcome}>Welcome back, {user.name}!</h1>
          {badgeProgress && (
            <div className={styles.badgeBanner} onClick={() => navigate('/member/badge-progress')}>
              <div className={styles.badgeIcon} style={{ backgroundColor: badgeProgress.badgeColor }}>
                {badgeProgress.currentBadge === 'red' ? '🔴' : '🔵'}
              </div>
              <div className={styles.badgeInfo}>
                <span className={styles.badgeTitle}>
                  {badgeProgress.currentBadge === 'red' ? 'Red Badge' : 'Blue Badge'}
                </span>
                <span className={styles.badgeProgress}>
                  {badgeProgress.currentBadge === 'red' 
                    ? `${badgePercentage}% complete`
                    : 'Completed!'}
                </span>
              </div>
              <FiAward className={styles.badgeArrow} />
            </div>
          )}
        </div>

        <div className={styles.statsGrid}>
          <StatCard
            title="Meetings Attended"
            value={stats.meetingsAttended}
            icon={<FiCalendar />}
          />
          <StatCard
            title="Volunteer Hours"
            value={stats.volunteerHours.toFixed(1)}
            icon={<FiHeart />}
          />
        </div>

        {nextMeeting && (
          <Card className={styles.nextMeetingCard}>
            <h2 className={styles.cardTitle}>Next Meeting</h2>
            <h3 className={styles.meetingTitle}>{nextMeeting.title}</h3>
            <div className={styles.meetingDetails}>
              <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span>{format(new Date(nextMeeting.date), 'MMM d, yyyy')}</span>
              </div>
              <div className={styles.detailItem}>
                <FiClock className={styles.detailIcon} />
                <span>{nextMeeting.startTime} - {nextMeeting.endTime}</span>
              </div>
              <div className={styles.detailItem}>
                <FiMapPin className={styles.detailIcon} />
                <span>{nextMeeting.location}</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/member/meetings/${nextMeeting.id}`)}
            >
              View Details
            </Button>
          </Card>
        )}

        {upcomingVolunteer && (
          <Card className={styles.volunteerCard}>
            <h2 className={styles.cardTitle}>Upcoming Volunteer</h2>
            <h3 className={styles.eventTitle}>{upcomingVolunteer.name}</h3>
            <div className={styles.eventDetails}>
              <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span>{format(new Date(upcomingVolunteer.date), 'MMM d, yyyy')}</span>
              </div>
              <div className={styles.detailItem}>
                <FiClock className={styles.detailIcon} />
                <span>{upcomingVolunteer.startTime} - {upcomingVolunteer.endTime}</span>
              </div>
            </div>
            <Button
              variant="success"
              size="sm"
              onClick={() => navigate(`/member/volunteers/${upcomingVolunteer.id}`)}
            >
              View Details
            </Button>
          </Card>
        )}

        <div className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionsGrid}>
            <button
              className={styles.actionButton}
              onClick={() => navigate('/member/scan-qr')}
            >
              <FiGrid className={styles.actionIcon} />
              <span>Scan QR</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate('/member/meetings')}
            >
              <FiCalendar className={styles.actionIcon} />
              <span>View Meetings</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate('/member/volunteers')}
            >
              <FiHeart className={styles.actionIcon} />
              <span>Volunteer Opportunities</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate('/member/directory')}
            >
              <FiUsers className={styles.actionIcon} />
              <span>Member Directory</span>
            </button>
            <button
              className={styles.actionButton}
              onClick={() => navigate('/member/donate')}
            >
              <FiDollarSign className={styles.actionIcon} />
              <span>Donate</span>
            </button>
          </div>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default Home;

