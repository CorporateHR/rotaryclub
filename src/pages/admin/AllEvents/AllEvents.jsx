import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeetings, getVolunteerEvents } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiHeart, FiEdit, FiGrid } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import styles from './AllEvents.module.css';

const AllEvents = () => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const meetings = getMeetings();
  const volunteerEvents = getVolunteerEvents();

  const typeOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'meetings', label: 'Meetings' },
    { value: 'volunteer', label: 'Volunteer Events' },
  ];

  const timeOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
  ];

  // Combine meetings and volunteer events
  const allEvents = useMemo(() => {
    const now = new Date();
    let events = [];

    // Add meetings
    if (typeFilter === 'all' || typeFilter === 'meetings') {
      meetings.forEach(meeting => {
        events.push({
          ...meeting,
          eventType: 'meeting',
          displayName: meeting.title,
        });
      });
    }

    // Add volunteer events
    if (typeFilter === 'all' || typeFilter === 'volunteer') {
      volunteerEvents.forEach(event => {
        events.push({
          ...event,
          eventType: 'volunteer',
          displayName: event.name,
        });
      });
    }

    // Filter by time
    if (timeFilter === 'upcoming') {
      events = events.filter(e => new Date(e.date) >= now);
    } else {
      events = events.filter(e => new Date(e.date) < now);
    }

    // Sort by date
    return events.sort((a, b) => {
      if (timeFilter === 'upcoming') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });
  }, [meetings, volunteerEvents, typeFilter, timeFilter]);

  const getEventTypeColor = (eventType) => {
    return eventType === 'meeting' ? 'var(--color-primary)' : 'var(--color-success)';
  };

  const getEventTypeLabel = (eventType) => {
    return eventType === 'meeting' ? 'Meeting' : 'Volunteer Event';
  };

  const handleViewEvent = (event) => {
    if (event.eventType === 'meeting') {
      navigate(`/admin/meetings/qr/${event.id}`);
    } else {
      navigate(`/admin/volunteers/${event.id}`);
    }
  };

  const handleEditEvent = (event) => {
    if (event.eventType === 'meeting') {
      navigate(`/admin/meetings/edit/${event.id}`);
    } else {
      navigate(`/admin/volunteers/edit/${event.id}`);
    }
  };

  return (
    <div className={styles.eventsPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Events</h1>
          <div className={styles.actions}>
            <Button variant="success" size="sm" onClick={() => navigate('/admin/meetings/create')}>
              + Meeting
            </Button>
            <Button variant="success" size="sm" onClick={() => navigate('/admin/volunteers/create')}>
              + Volunteer Event
            </Button>
          </div>
        </div>

        <div className={styles.filters}>
          <FilterChips options={typeOptions} selected={typeFilter} onChange={setTypeFilter} />
          <FilterChips options={timeOptions} selected={timeFilter} onChange={setTimeFilter} />
        </div>

        <div className={styles.eventsList}>
          {allEvents.map((event) => {
            const borderColor = getEventTypeColor(event.eventType);
            const isPast = new Date(event.date) < new Date();
            
            let attendanceInfo = null;
            if (event.eventType === 'meeting') {
              const checkInCount = event.checkIns?.length || 0;
              attendanceInfo = `${checkInCount} / ${event.expectedAttendance || 0} checked in`;
            } else {
              const totalSignups = event.roles?.reduce((sum, r) => sum + r.volunteers.length, 0) || 0;
              attendanceInfo = `${totalSignups} / ${event.maxVolunteers || 0} volunteers`;
            }

            return (
              <Card
                key={`${event.eventType}-${event.id}`}
                className={`${styles.eventCard} ${isPast ? styles.past : ''}`}
                style={{ borderLeft: `4px solid ${borderColor}` }}
              >
                <div className={styles.eventHeader}>
                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{event.displayName}</h3>
                    <div className={styles.badges}>
                      <Badge variant="purple">{getEventTypeLabel(event.eventType)}</Badge>
                      {event.type && event.eventType === 'meeting' && (
                        <Badge variant="info">{event.type}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.eventDetails}>
                  <div className={styles.detailItem}>
                    <FiCalendar className={styles.icon} />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiClock className={styles.icon} />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiMapPin className={styles.icon} />
                    <span>{event.location}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FiUsers className={styles.icon} />
                    <span>{attendanceInfo}</span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditEvent(event)}
                  >
                    <FiEdit /> Edit
                  </Button>
                  {event.eventType === 'meeting' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/admin/meetings/qr/${event.id}`)}
                    >
                      <FiGrid /> View QR
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleViewEvent(event)}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {allEvents.length === 0 && (
          <Card className={styles.emptyCard}>
            <p>No events found matching your criteria.</p>
          </Card>
        )}
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AllEvents;

