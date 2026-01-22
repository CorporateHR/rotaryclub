import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVolunteerEvents } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiEdit } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import styles from './Volunteers.module.css';

const AdminVolunteers = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('active');
  const events = getVolunteerEvents();

  const filterOptions = [
    { value: 'active', label: 'Active' },
    { value: 'past', label: 'Past' },
    { value: 'full', label: 'Full' },
  ];

  const filteredEvents = useMemo(() => {
    let filtered = events;
    const now = new Date();

    if (filter === 'active') {
      filtered = filtered.filter(e => new Date(e.date) >= now);
    } else if (filter === 'past') {
      filtered = filtered.filter(e => new Date(e.date) < now);
    } else if (filter === 'full') {
      filtered = filtered.filter(e => {
        const totalSignups = e.roles.reduce((sum, r) => sum + r.volunteers.length, 0);
        return totalSignups >= e.maxVolunteers;
      });
    }

    return filtered;
  }, [events, filter]);

  const getTotalSignups = (event) => {
    return event.roles.reduce((total, role) => total + role.volunteers.length, 0);
  };

  const getRolesSummary = (event) => {
    return event.roles.map(role => ({
      name: role.name,
      filled: role.volunteers.length,
      capacity: role.capacity,
      isFull: role.volunteers.length >= role.capacity
    }));
  };

  return (
    <div className={styles.volunteersPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Volunteer Events</h1>
          <div className={styles.actions}>
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/volunteers/all')}>
              View All Volunteers
            </Button>
            <Button variant="success" onClick={() => navigate('/admin/volunteers/create')}>
              + Create Opportunity
            </Button>
          </div>
        </div>

        <FilterChips options={filterOptions} selected={filter} onChange={setFilter} />

        <div className={styles.eventsList}>
          {filteredEvents.map((event) => {
            const totalSignups = getTotalSignups(event);
            const spotsRemaining = event.maxVolunteers - totalSignups;
            return (
              <Card key={event.id} className={styles.eventCard}>
                <div className={styles.eventHeader}>
                  <h3 className={styles.eventTitle}>{event.name}</h3>
                  <Badge variant={spotsRemaining > 0 ? 'info' : 'warning'}>
                    {spotsRemaining} spots remaining
                  </Badge>
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
                </div>
                <div className={styles.rolesBreakdown}>
                  <h4 className={styles.rolesTitle}>Activities:</h4>
                  <div className={styles.rolesList}>
                    {getRolesSummary(event).map((role) => (
                      <div key={role.name} className={styles.roleItem}>
                        <span className={styles.roleName}>{role.name}</span>
                        <Badge variant={role.isFull ? 'warning' : 'info'}>
                          {role.filled}/{role.capacity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/volunteers/edit/${event.id}`)}>
                    <FiEdit /> Edit
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate(`/admin/volunteers/${event.id}`)}>
                    View Details
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

export default AdminVolunteers;

