import { useState, useMemo } from 'react';
import { getMembers, getMemberTotalVolunteerHours, getVolunteerHours } from '../../../utils/dataManager';
import { FiPhone } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Avatar from '../../../components/common/Avatar/Avatar';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import styles from './AllVolunteers.module.css';

const AllVolunteers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const members = getMembers();
  const allVolunteerHours = getVolunteerHours();

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active Volunteers' },
    { value: 'top', label: 'Top Volunteers' },
  ];

  // Get all members who have volunteered
  const volunteersWithStats = useMemo(() => {
    return members.map(member => {
      const hours = getMemberTotalVolunteerHours(member.id);
      const events = allVolunteerHours.filter(h => h.memberId === member.id && h.checkOutTime !== null);
      const uniqueEvents = new Set(events.map(e => e.eventId));
      
      return {
        ...member,
        totalHours: hours,
        eventsCount: uniqueEvents.size,
        hasVolunteered: hours > 0,
      };
    }).filter(m => {
      if (filter === 'active') {
        return m.hasVolunteered;
      } else if (filter === 'top') {
        return m.totalHours >= 20; // Top volunteers with 20+ hours
      }
      return true;
    }).filter(m => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return m.name.toLowerCase().includes(query) ||
               m.email.toLowerCase().includes(query);
      }
      return true;
    }).sort((a, b) => {
      if (filter === 'top') {
        return b.totalHours - a.totalHours;
      }
      return b.totalHours - a.totalHours;
    });
  }, [members, filter, searchQuery, allVolunteerHours]);

  return (
    <div className={styles.volunteersPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>All Volunteers</h1>
        <p className={styles.subtitle}>View all members who have volunteered and their contributions</p>

        <SearchBar placeholder="Search volunteers..." onSearch={setSearchQuery} />
        <FilterChips options={filterOptions} selected={filter} onChange={setFilter} />

        <div className={styles.statsSummary}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Volunteers</span>
            <span className={styles.statValue}>{volunteersWithStats.filter(v => v.hasVolunteered).length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Hours</span>
            <span className={styles.statValue}>
              {volunteersWithStats.reduce((sum, v) => sum + v.totalHours, 0).toFixed(1)}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active This Year</span>
            <span className={styles.statValue}>
              {volunteersWithStats.filter(v => v.eventsCount > 0).length}
            </span>
          </div>
        </div>

        <div className={styles.volunteersList}>
          {volunteersWithStats.map((volunteer) => {
            return (
              <Card key={volunteer.id} className={styles.volunteerCard}>
                <div className={styles.volunteerHeader}>
                  <Avatar name={volunteer.name} size="md" />
                  <div className={styles.volunteerInfo}>
                    <h3 className={styles.volunteerName}>{volunteer.name}</h3>
                    <div className={styles.volunteerDetails}>
                      <span className={styles.phone}>{volunteer.phone}</span>
                      <Badge variant="purple">{volunteer.role}</Badge>
                    </div>
                  </div>
                  <button
                    className={styles.phoneButton}
                    onClick={() => window.location.href = `tel:${volunteer.phone}`}
                  >
                    <FiPhone />
                  </button>
                </div>
                <div className={styles.volunteerStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total Hours:</span>
                    <span className={styles.statValue}>{volunteer.totalHours.toFixed(1)} hrs</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Events:</span>
                    <span className={styles.statValue}>{volunteer.eventsCount}</span>
                  </div>
                  {volunteer.totalHours >= 30 && (
                    <Badge variant="success">Top Volunteer</Badge>
                  )}
                  {volunteer.totalHours === 0 && (
                    <Badge variant="info">No hours yet</Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {volunteersWithStats.length === 0 && (
          <Card className={styles.emptyCard}>
            <p>No volunteers found matching your criteria.</p>
          </Card>
        )}
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AllVolunteers;

