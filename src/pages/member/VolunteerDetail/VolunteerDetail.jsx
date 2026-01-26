import { useParams, useNavigate } from 'react-router-dom';
import { getVolunteerEventById, updateVolunteerEvent, updateInvitationStatus, getMembers, getMemberById } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import Badge from '../../../components/common/Badge/Badge';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './VolunteerDetail.module.css';

const VolunteerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = getVolunteerEventById(id);
  const members = getMembers();

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : `Member ${memberId}`;
  };

  if (!event) {
    return (
      <div>
        <Header currentView="member" />
        <div className={styles.container}><p>Event not found</p></div>
      </div>
    );
  }

  const isRegistered = event.roles.some(r => r.volunteers.includes(user?.id || ''));
  const registeredRole = event.roles.find(r => r.volunteers.includes(user?.id || ''));
  
  // Check invitation status
  const invitations = event.invitations || [];
  const userInvitation = invitations.find(inv => inv.memberId === user?.id);
  const isInvited = !!userInvitation;
  const invitationStatus = userInvitation?.status || null;

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      const updatedRoles = event.roles.map(role => ({
        ...role,
        volunteers: role.volunteers.filter(v => v !== user?.id),
      }));
      updateVolunteerEvent(id, { roles: updatedRoles });
      navigate('/member/volunteers');
    }
  };

  const handleAcceptInvitation = () => {
    if (user?.id) {
      updateInvitationStatus(id, user.id, 'accepted');
      // Navigate to signup page to select role
      navigate(`/member/volunteers/signup/${id}`);
    }
  };

  const handleDeclineInvitation = () => {
    if (window.confirm('Are you sure you want to decline this invitation?')) {
      if (user?.id) {
        updateInvitationStatus(id, user.id, 'declined');
        // Refresh page or navigate
        window.location.reload();
      }
    }
  };

  return (
    <div className={styles.detailPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/member/volunteers')}>
          <FiArrowLeft /> Back
        </button>

        <h1 className={styles.title}>{event.name}</h1>

        <Card className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Event Details</h2>
          <div className={styles.details}>
            <div className={styles.detailItem}>
              <FiCalendar className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Date</div>
                <div className={styles.detailValue}>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</div>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiClock className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Time</div>
                <div className={styles.detailValue}>{event.startTime} - {event.endTime}</div>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiMapPin className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Location</div>
                <div className={styles.detailValue}>{event.location}</div>
              </div>
            </div>
            {isRegistered && registeredRole && (
              <div className={styles.detailItem}>
                <div>
                  <div className={styles.detailLabel}>Your Role</div>
                  <div className={styles.detailValue}>{registeredRole.name}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className={styles.descriptionCard}>
          <h2 className={styles.cardTitle}>Description</h2>
          <p>{event.description}</p>
        </Card>

        {event.champion && (
          <Card className={styles.championCard}>
            <h2 className={styles.cardTitle}>Event Champion</h2>
            <div className={styles.championInfo}>
              <div className={styles.championDetails}>
                <span className={styles.championLabel}>Event Leader:</span>
                <span className={styles.championName}>
                  {getMemberById(event.champion)?.name || 'Not assigned'}
                </span>
              </div>
              <p className={styles.championDescription}>
                The Event Champion is the lead organizer for this volunteer event.
              </p>
            </div>
          </Card>
        )}

        {isInvited && invitationStatus === 'pending' && (
          <InfoBox type="info" className={styles.invitationBox}>
            <strong>You've been invited to this event!</strong>
            <br />
            The event organizer has invited you to participate. Would you like to accept?
            <div className={styles.invitationActions}>
              <Button variant="success" size="sm" onClick={handleAcceptInvitation}>
                <FiCheck /> Accept Invitation
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeclineInvitation}>
                <FiX /> Decline
              </Button>
            </div>
          </InfoBox>
        )}

        {isInvited && invitationStatus === 'accepted' && !isRegistered && (
          <InfoBox type="success" className={styles.invitationBox}>
            <strong>Invitation Accepted!</strong>
            <br />
            You've accepted the invitation. Please select a role to complete your registration.
          </InfoBox>
        )}

        {isInvited && invitationStatus === 'declined' && (
          <InfoBox type="warning" className={styles.invitationBox}>
            <strong>Invitation Declined</strong>
            <br />
            You previously declined this invitation. You can still sign up if you change your mind.
          </InfoBox>
        )}

        {event.roles && event.roles.length > 0 && (
          <Card className={styles.volunteersCard}>
            <h2 className={styles.cardTitle}>Volunteer Roles & Sign-ups</h2>
            <div className={styles.volunteersList}>
              {event.roles.map((role) => (
                <div key={role.name} className={styles.roleSection}>
                  <h3 className={styles.roleName}>{role.name}</h3>
                  <div className={styles.volunteers}>
                    {role.volunteers.length > 0 ? (
                      role.volunteers.map((volId) => {
                        return <span key={volId} className={styles.volunteerName}>{getMemberName(volId)}</span>;
                      })
                    ) : (
                      <span className={styles.noVolunteers}>No volunteers yet</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {isRegistered && (
          <InfoBox type="warning" className={styles.warningBox}>
            <strong>Reminder:</strong> Don't forget to check in and check out using the QR codes
            at the event to track your volunteer hours accurately.
          </InfoBox>
        )}

        {isRegistered ? (
          <Button variant="danger" className={styles.cancelButton} onClick={handleCancel}>
            Cancel Registration
          </Button>
        ) : (
          <Button
            variant="success"
            className={styles.signupButton}
            onClick={() => navigate(`/member/volunteers/signup/${id}`)}
          >
            Sign Up for This Event
          </Button>
        )}
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default VolunteerDetail;

