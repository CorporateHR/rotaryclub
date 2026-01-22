import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers, getMemberAttendance } from '../../../utils/dataManager';
import { FiPhone } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Avatar from '../../../components/common/Avatar/Avatar';
import Badge from '../../../components/common/Badge/Badge';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import styles from './Directory.module.css';

const Directory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const members = getMembers();

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'board', label: 'Board' },
    { value: 'new', label: 'New' },
  ];

  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter(m => m.status === 'active' && m.role !== 'president' && m.role !== 'secretary' && m.role !== 'treasurer');
    } else if (filter === 'board') {
      filtered = filtered.filter(m => ['president', 'secretary', 'treasurer', 'board'].includes(m.role));
    } else if (filter === 'new') {
      filtered = filtered.filter(m => m.role === 'new');
    }

    // Apply search
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

  const getRoleLabel = (role) => {
    const labels = {
      president: 'President',
      secretary: 'Secretary',
      treasurer: 'Treasurer',
      board: 'Board Member',
      active: 'Active Member',
      new: 'New Member',
    };
    return labels[role] || 'Member';
  };

  const getAttendancePercentage = (memberId) => {
    const attendance = getMemberAttendance(memberId);
    // Simplified calculation - in real app, would calculate based on total meetings
    return Math.min(100, (attendance.length / 16) * 100);
  };

  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className={styles.directoryPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <h1 className={styles.title}>Member Directory</h1>
        <p className={styles.subtitle}>{filteredMembers.length} active members</p>

        <SearchBar
          placeholder="Search by name, email, or phone..."
          onSearch={setSearchQuery}
        />

        <FilterChips
          options={filterOptions}
          selected={filter}
          onChange={setFilter}
        />

        <div className={styles.memberList}>
          {filteredMembers.map((member) => {
            const attendancePercent = getAttendancePercentage(member.id);
            return (
              <Card key={member.id} className={styles.memberCard}>
                <div className={styles.memberHeader}>
                  <Avatar name={member.name} size="md" />
                  <div className={styles.memberInfo}>
                    <h3
                      className={styles.memberName}
                      onClick={() => navigate(`/member/directory/${member.id}`)}
                    >
                      {member.name}
                    </h3>
                    <div className={styles.memberDetails}>
                      <span className={styles.phone} onClick={() => handlePhoneClick(member.phone)}>
                        {member.phone}
                      </span>
                      <Badge variant="purple">{getRoleLabel(member.role)}</Badge>
                    </div>
                  </div>
                  <button
                    className={styles.phoneButton}
                    onClick={() => handlePhoneClick(member.phone)}
                  >
                    <FiPhone />
                  </button>
                </div>
                <div className={styles.memberStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Joined:</span>
                    <span className={styles.statValue}>{member.joinYear}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Attendance:</span>
                    <span className={styles.statValue}>{Math.round(attendancePercent)}%</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <InfoBox type="info" className={styles.tip}>
          <strong>Tip:</strong> Tap on a member's name to view their full profile, or use the phone
          icon to call them directly.
        </InfoBox>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default Directory;

