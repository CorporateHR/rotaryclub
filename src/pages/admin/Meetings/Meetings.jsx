import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetings, getMemberById } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit, FiGrid } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import styles from './Meetings.module.css';

const AdminMeetings = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [typeFilter, setTypeFilter] = useState('all');
  const meetings = getMeetings();

  const timeOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'club', label: 'Club' },
    { value: 'board', label: 'Board' },
  ];

  const filteredMeetings = useMemo(() => {
    let filtered = meetings;
    const now = new Date();

    if (timeFilter === 'upcoming') {
      filtered = filtered.filter(m => new Date(m.date) >= now);
    } else {
      filtered = filtered.filter(m => new Date(m.date) < now);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(m => m.type === typeFilter);
    }

    return filtered.sort((a, b) => {
      if (timeFilter === 'upcoming') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
  }, [meetings, timeFilter, typeFilter]);

  const getRolesSummary = (meeting) => {
    if (!meeting.roles) return [];
    return meeting.roles.map(role => ({
      name: role.name,
      filled: role.volunteers.length,
      capacity: role.capacity,
      isFull: role.volunteers.length >= role.capacity
    }));
  };

  return (
    <div className={styles.meetingsPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meetings Management</h1>
          <Button variant="success" onClick={() => navigate('/admin/meetings/create')}>
            + Create Meeting
          </Button>
        </div>

        <div className={styles.filters}>
          <FilterChips options={timeOptions} selected={timeFilter} onChange={setTimeFilter} />
          <FilterChips options={typeOptions} selected={typeFilter} onChange={setTypeFilter} />
        </div>

        <div className={styles.meetingsList}>
          {filteredMeetings.map((meeting) => {
            const checkInCount = meeting.checkIns?.length || 0;
            return (
              <Card key={meeting.id} className={styles.meetingCard}>
                <div className={styles.meetingHeader}>
                  <div>
                    <h3 className={styles.meetingTitle}>{meeting.title}</h3>
                    <Badge variant="purple">{meeting.type}</Badge>
                  </div>
                </div>
                <div className={styles.meetingDetails}>
                  <div className={styles.detailItem}>
                    <FiCalendar className={styles.icon} />
                    <span>{format(new Date(meeting.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiClock className={styles.icon} />
                    <span>{meeting.startTime} - {meeting.endTime}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiMapPin className={styles.icon} />
                    <span>{meeting.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiUsers className={styles.icon} />
                    <span>{checkInCount} / {meeting.expectedAttendance} checked in</span>
                  </div>
                </div>
                {meeting.meetingRoles && (
                  <div className={styles.meetingRolesSection}>
                    <h4 className={styles.rolesTitle}>Meeting Roles:</h4>
                    <div className={styles.meetingRolesList}>
                      {meeting.meetingRoles.president && (
                        <div className={styles.meetingRoleItem}>
                          <span className={styles.meetingRoleLabel}>President:</span>
                          <span className={styles.meetingRoleMember}>
                            {getMemberById(meeting.meetingRoles.president)?.name || 'Not assigned'}
                          </span>
                        </div>
                      )}
                      {meeting.meetingRoles.greeter && (
                        <div className={styles.meetingRoleItem}>
                          <span className={styles.meetingRoleLabel}>Greeter:</span>
                          <span className={styles.meetingRoleMember}>
                            {getMemberById(meeting.meetingRoles.greeter)?.name || 'Not assigned'}
                          </span>
                        </div>
                      )}
                      {meeting.meetingRoles.jokeOfTheDay && (
                        <div className={styles.meetingRoleItem}>
                          <span className={styles.meetingRoleLabel}>Joke of the Day:</span>
                          <span className={styles.meetingRoleMember}>
                            {getMemberById(meeting.meetingRoles.jokeOfTheDay)?.name || 'Not assigned'}
                          </span>
                        </div>
                      )}
                      {meeting.meetingRoles.thoughtOfTheDay && (
                        <div className={styles.meetingRoleItem}>
                          <span className={styles.meetingRoleLabel}>Thought of the Day:</span>
                          <span className={styles.meetingRoleMember}>
                            {getMemberById(meeting.meetingRoles.thoughtOfTheDay)?.name || 'Not assigned'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {meeting.roles && meeting.roles.length > 0 && (
                  <div className={styles.rolesBreakdown}>
                    <h4 className={styles.rolesTitle}>Activities:</h4>
                    <div className={styles.rolesList}>
                      {getRolesSummary(meeting).map((role) => (
                        <div key={role.name} className={styles.roleItem}>
                          <span className={styles.roleName}>{role.name}</span>
                          <Badge variant={role.isFull ? 'success' : 'info'}>
                            {role.filled}/{role.capacity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.actions}>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/meetings/edit/${meeting.id}`)}>
                    <FiEdit /> Edit
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate(`/admin/meetings/qr/${meeting.id}`)}>
                    <FiGrid /> View QR
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AdminMeetings;

