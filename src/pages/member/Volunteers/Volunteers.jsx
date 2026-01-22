import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVolunteerEvents } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiHeart } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Volunteers.module.css';

const Volunteers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('available');
  const events = getVolunteerEvents();

  const filterOptions = [
    { value: 'available', label: 'Available' },
    { value: 'myEvents', label: 'My Events' },
    { value: 'past', label: 'Past' },
  ];

  const filteredEvents = useMemo(() => {
    let filtered = events;
    const now = new Date();

    if (filter === 'available') {
      filtered = filtered.filter(e => new Date(e.date) >= now);
    } else if (filter === 'myEvents') {
      filtered = filtered.filter(e => {
        const isRegistered = e.roles.some(r => r.volunteers.includes(user?.id || ''));
        return isRegistered && new Date(e.date) >= now;
      });
    } else {
      filtered = filtered.filter(e => new Date(e.date) < now);
    }

    return filtered.sort((a, b) => {
      if (filter === 'past') {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });
  }, [events, filter, user]);

  const getTotalSignups = (event) => {
    return event.roles.reduce((total, role) => total + role.volunteers.length, 0);
  };

  const isRegistered = (event) => {
    return event.roles.some(r => r.volunteers.includes(user?.id || ''));
  };

  const getRegisteredRole = (event) => {
    const role = event.roles.find(r => r.volunteers.includes(user?.id || ''));
    return role?.name;
  };

  return (
    <div className={styles.volunteersPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <h1 className={styles.title}>Volunteer Opportunities</h1>

        <FilterChips options={filterOptions} selected={filter} onChange={setFilter} />

        <div className={styles.eventsList}>
          {filteredEvents.map((event) => {
            const totalSignups = getTotalSignups(event);
            const registered = isRegistered(event);
            const spotsRemaining = event.maxVolunteers - totalSignups;

            return (
              <Card
                key={event.id}
                className={styles.eventCard}
                style={{ borderLeft: '4px solid var(--color-success)' }}
              >
                <div className={styles.eventHeader}>
                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{event.name}</h3>
                    <div className={styles.badges}>
                      {registered && <Badge variant="success">Registered</Badge>}
                      {spotsRemaining > 0 && <Badge variant="info">{spotsRemaining} spots available</Badge>}
                      {spotsRemaining === 0 && <Badge variant="warning">Full</Badge>}
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
                    <span>{totalSignups} / {event.maxVolunteers} volunteers</span>
                  </div>
                  {registered && (
                    <div className={styles.detailItem}>
                      <FiHeart className={styles.icon} />
                      <span>Your role: {getRegisteredRole(event)}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant={registered ? 'secondary' : 'success'}
                  size="sm"
                  onClick={() => navigate(`/member/volunteers/${event.id}`)}
                >
                  {registered ? 'View Details' : 'Sign Up'}
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

export default Volunteers;

