import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers } from '../../../utils/dataManager';
import { FiPhone } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Avatar from '../../../components/common/Avatar/Avatar';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import styles from './Members.module.css';

const AdminMembers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('active');
  const members = getMembers();

  const filterOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'board', label: 'Board' },
  ];

  const filteredMembers = useMemo(() => {
    let filtered = members;

    if (filter === 'active') {
      filtered = filtered.filter(m => m.status === 'active');
    } else if (filter === 'pending') {
      filtered = filtered.filter(m => m.status === 'pending');
    } else if (filter === 'inactive') {
      filtered = filtered.filter(m => m.status === 'inactive');
    } else if (filter === 'board') {
      filtered = filtered.filter(m => ['president', 'secretary', 'treasurer'].includes(m.role));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.phone.includes(query)
      );
    }

    return filtered;
  }, [members, filter, searchQuery]);

  return (
    <div className={styles.membersPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Members Management</h1>
          <div className={styles.actions}>
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/volunteers/all')}>
              View All Volunteers
            </Button>
            <Button variant="success" size="sm" onClick={() => navigate('/admin/members/add')}>
              Add Member
            </Button>
            <Button variant="secondary" size="sm" onClick={() => {}}>
              Import
            </Button>
          </div>
        </div>

        <SearchBar placeholder="Search members..." onSearch={setSearchQuery} />
        <FilterChips options={filterOptions} selected={filter} onChange={setFilter} />

        <div className={styles.membersList}>
          {filteredMembers.map((member) => {
            const attendancePercent = 85; // Simplified
            return (
              <Card 
                key={member.id} 
                className={styles.memberCard}
                onClick={() => navigate(`/admin/members/${member.id}`)}
              >
                <div className={styles.memberHeader}>
                  <Avatar name={member.name} size="md" />
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <div className={styles.memberDetails}>
                      <span className={styles.phone}>{member.phone}</span>
                      {member.status === 'pending' && <Badge variant="warning">Pending Approval</Badge>}
                    </div>
                  </div>
                  <button
                    className={`${styles.phoneButton} ${attendancePercent < 70 ? styles.lowAttendance : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${member.phone}`;
                    }}
                  >
                    <FiPhone />
                  </button>
                </div>
                <div className={styles.memberStats}>
                  <span>Role: {member.role}</span>
                  <span>Attendance: {attendancePercent}%</span>
                </div>
              </Card>
            );
          })}
        </div>

        <InfoBox type="info" className={styles.tip}>
          <strong>Tip:</strong> Click the phone icon to call a member directly, or search and filter
          to find specific members.
        </InfoBox>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AdminMembers;

