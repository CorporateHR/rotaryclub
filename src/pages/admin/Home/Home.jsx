import { useNavigate } from 'react-router-dom';
import { getMembers, getMeetings, getVolunteerEvents, getVolunteerHours } from '../../../utils/dataManager';
import { FiUsers, FiCalendar, FiHeart, FiBarChart2, FiPlus } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import StatCard from '../../../components/cards/StatCard/StatCard';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Badge from '../../../components/common/Badge/Badge';
import styles from './Home.module.css';

const AdminHome = () => {
  const navigate = useNavigate();
  const members = getMembers();
  const meetings = getMeetings();
  const events = getVolunteerEvents();
  const hours = getVolunteerHours();

  const totalMembers = members.length;
  const avgAttendance = 85; // Simplified calculation
  const meetingsThisYear = meetings.length;
  const totalVolunteerHours = hours.reduce((sum, h) => sum + (h.hours || 0), 0);

  const pendingApplications = members.filter(m => m.status === 'pending').length;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;

  return (
    <div className={styles.adminPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Dashboard</h1>

        <div className={styles.statsGrid}>
          <StatCard title="Total Members" value={totalMembers} icon={<FiUsers />} />
          <StatCard title="Avg Attendance" value={`${avgAttendance}%`} icon={<FiBarChart2 />} />
          <StatCard title="Meetings This Year" value={meetingsThisYear} icon={<FiCalendar />} />
          <StatCard title="Volunteer Hours" value={totalVolunteerHours.toFixed(0)} icon={<FiHeart />} />
        </div>

        <div className={styles.contentGrid}>
          <Card className={styles.quickActionsCard}>
            <h2 className={styles.cardTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
              <button className={styles.actionButton} onClick={() => navigate('/admin/meetings/create')}>
                <FiPlus /> + Meeting
              </button>
              <button className={styles.actionButton} onClick={() => navigate('/admin/volunteers/create')}>
                <FiPlus /> + Volunteer
              </button>
              <button className={styles.actionButton} onClick={() => navigate('/admin/members')}>
                <FiUsers /> Members
              </button>
              <button className={styles.actionButton} onClick={() => navigate('/admin/events')}>
                <FiCalendar /> All Events
              </button>
              <button className={styles.actionButton} onClick={() => navigate('/admin/volunteers/all')}>
                <FiHeart /> All Volunteers
              </button>
              <button className={styles.actionButton} onClick={() => navigate('/admin/analytics')}>
                <FiBarChart2 /> Analytics
              </button>
            </div>
          </Card>

          <Card className={styles.actionItemsCard}>
            <h2 className={styles.cardTitle}>Action Items</h2>
            <div className={styles.actionItems}>
              <div className={styles.actionItem}>
                <span>Pending member applications</span>
                <Badge variant="warning">{pendingApplications}</Badge>
              </div>
              <div className={styles.actionItem}>
                <span>Events needing volunteers</span>
                <Badge variant="info">{upcomingEvents}</Badge>
              </div>
              <div className={styles.actionItem}>
                <span>Pending approvals</span>
                <Badge variant="warning">2</Badge>
              </div>
            </div>
          </Card>
        </div>

        <Card className={styles.upcomingEventsCard}>
          <h2 className={styles.cardTitle}>Upcoming Events</h2>
          <div className={styles.eventsList}>
            {[...meetings, ...events]
              .filter(e => new Date(e.date) > new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map((event) => (
                <div 
                  key={event.id} 
                  className={styles.eventItem}
                  onClick={() => {
                    if (meetings.find(m => m.id === event.id)) {
                      navigate(`/admin/meetings/qr/${event.id}`);
                    } else {
                      navigate(`/admin/volunteers/${event.id}`);
                    }
                  }}
                >
                  <div className={styles.eventInfo}>
                    <span className={styles.eventName}>
                      {event.title || event.name}
                    </span>
                    <Badge variant={meetings.find(m => m.id === event.id) ? 'purple' : 'success'}>
                      {meetings.find(m => m.id === event.id) ? 'Meeting' : 'Volunteer'}
                    </Badge>
                  </div>
                  <span className={styles.eventDate}>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              ))}
          </div>
          {([...meetings, ...events].filter(e => new Date(e.date) > new Date()).length === 0) && (
            <p className={styles.noEvents}>No upcoming events</p>
          )}
        </Card>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AdminHome;

