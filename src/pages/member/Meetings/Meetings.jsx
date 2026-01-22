import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetings, getMemberAttendance } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Meetings.module.css';

const Meetings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [typeFilter, setTypeFilter] = useState('all');
  const meetings = getMeetings();
  const attendance = getMemberAttendance(user?.id || '');

  const timeOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'club', label: 'Club' },
    { value: 'board', label: 'Board' },
    { value: 'volunteer', label: 'Volunteer' },
  ];

  const filteredMeetings = useMemo(() => {
    let filtered = meetings;

    // Time filter
    const now = new Date();
    if (timeFilter === 'upcoming') {
      filtered = filtered.filter(m => new Date(m.date) >= now);
    } else {
      filtered = filtered.filter(m => new Date(m.date) < now);
    }

    // Type filter
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

  const getMeetingTypeColor = (type) => {
    const colors = {
      club: 'var(--color-primary)',
      board: 'var(--color-primary-dark)',
      volunteer: 'var(--color-success)',
      social: 'var(--color-info)',
      special: 'var(--color-warning)',
    };
    return colors[type] || 'var(--color-gray-500)';
  };

  const getMeetingTypeLabel = (type) => {
    const labels = {
      club: 'Club Meeting',
      board: 'Board Meeting',
      committee: 'Committee Meeting',
      social: 'Social Event',
      special: 'Special Event',
      volunteer: 'Volunteer Event',
    };
    return labels[type] || type;
  };

  const isAttended = (meetingId) => {
    return attendance.some(a => a.meetingId === meetingId);
  };

  return (
    <div className={styles.meetingsPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <h1 className={styles.title}>Meetings</h1>

        <div className={styles.filters}>
          <FilterChips options={timeOptions} selected={timeFilter} onChange={setTimeFilter} />
          <FilterChips options={typeOptions} selected={typeFilter} onChange={setTypeFilter} />
        </div>

        <div className={styles.meetingsList}>
          {filteredMeetings.map((meeting) => {
            const borderColor = getMeetingTypeColor(meeting.type);
            const attended = isAttended(meeting.id);
            const isPast = new Date(meeting.date) < new Date();

            return (
              <Card
                key={meeting.id}
                className={`${styles.meetingCard} ${isPast ? styles.past : ''}`}
                style={{ borderLeft: `4px solid ${borderColor}` }}
              >
                <div className={styles.meetingHeader}>
                  <div className={styles.meetingInfo}>
                    <h3 className={styles.meetingTitle}>{meeting.title}</h3>
                    <Badge variant="purple">{getMeetingTypeLabel(meeting.type)}</Badge>
                    {attended && <Badge variant="success">Attended</Badge>}
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
                  {meeting.expectedAttendance && (
                    <div className={styles.detailItem}>
                      <FiUsers className={styles.icon} />
                      <span>{meeting.expectedAttendance} expected</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/member/meetings/${meeting.id}`)}
                >
                  View Details
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default Meetings;

