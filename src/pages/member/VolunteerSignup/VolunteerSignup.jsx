import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVolunteerEventById, updateVolunteerEvent } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './VolunteerSignup.module.css';

const VolunteerSignup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = getVolunteerEventById(id);
  const [selectedRole, setSelectedRole] = useState(null);

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleConfirm = () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    const roleIndex = event.roles.findIndex(r => r.name === selectedRole);
    if (roleIndex === -1) return;

    const updatedRoles = [...event.roles];
    if (!updatedRoles[roleIndex].volunteers.includes(user?.id || '')) {
      updatedRoles[roleIndex].volunteers.push(user?.id || '');
      updateVolunteerEvent(id, { roles: updatedRoles });
      navigate(`/member/volunteers/signup-success`, { state: { event, role: selectedRole } });
    }
  };

  return (
    <div className={styles.signupPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <h1 className={styles.title}>Sign Up for Volunteer Event</h1>

        <Card className={styles.eventCard}>
          <h2 className={styles.eventName}>{event.name}</h2>
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
          </div>
        </Card>

        <Card className={styles.rolesCard}>
          <h2 className={styles.cardTitle}>Select Your Role</h2>
          <div className={styles.rolesList}>
            {event.roles.map((role) => {
              const spotsAvailable = role.capacity - role.volunteers.length;
              const isSelected = selectedRole === role.name;
              const isFull = spotsAvailable === 0;

              return (
                <button
                  key={role.name}
                  className={`${styles.roleCard} ${isSelected ? styles.selected : ''} ${isFull ? styles.full : ''}`}
                  onClick={() => !isFull && setSelectedRole(role.name)}
                  disabled={isFull}
                >
                  <div className={styles.roleHeader}>
                    <h3 className={styles.roleName}>{role.name}</h3>
                    {isFull ? (
                      <span className={styles.fullBadge}>Full</span>
                    ) : (
                      <span className={styles.spotsBadge}>{spotsAvailable} spots available</span>
                    )}
                  </div>
                  {role.description && <p className={styles.roleDescription}>{role.description}</p>}
                </button>
              );
            })}
          </div>
        </Card>

        <InfoBox type="info" className={styles.infoBox}>
          <strong>QR Code Check-In:</strong> When you arrive at the event, scan the check-in QR code.
          When you leave, scan the check-out QR code to track your volunteer hours automatically.
        </InfoBox>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate(`/member/volunteers/${id}`)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirm}>
            Confirm Sign Up
          </Button>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default VolunteerSignup;

