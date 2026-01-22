import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVolunteerEventById, getMembers, inviteMemberToEvent, cancelInvitation, updateVolunteerEvent } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiArrowLeft, FiPhone, FiMail, FiDownload, FiUserPlus, FiX, FiCheck, FiXCircle, FiClock as FiClockIcon } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import Avatar from '../../../components/common/Avatar/Avatar';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import styles from './VolunteerDetail.module.css';

const AdminVolunteerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(getVolunteerEventById(id));
  const members = getMembers();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Refresh event data
    setEvent(getVolunteerEventById(id));
  }, [id]);

  if (!event) {
    return <div>Event not found</div>;
  }

  const getTotalSignups = () => {
    return event.roles.reduce((total, role) => total + role.volunteers.length, 0);
  };

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : `Member ${memberId}`;
  };

  const getMemberPhone = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.phone : '';
  };

  const getMemberEmail = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member ? member.email : '';
  };

  const totalSignups = getTotalSignups();
  const spotsRemaining = event.maxVolunteers - totalSignups;
  const fillPercentage = (totalSignups / event.maxVolunteers) * 100;

  // Get invitation status
  const invitations = event.invitations || [];
  const pendingInvites = invitations.filter(inv => inv.status === 'pending');
  const acceptedInvites = invitations.filter(inv => inv.status === 'accepted');
  const declinedInvites = invitations.filter(inv => inv.status === 'declined');

  // Get members not yet invited
  const invitedMemberIds = invitations.map(inv => inv.memberId);
  const registeredMemberIds = event.roles.flatMap(role => role.volunteers);
  const availableMembers = useMemo(() => {
    return members.filter(m => 
      !invitedMemberIds.includes(m.id) && 
      !registeredMemberIds.includes(m.id) &&
      (searchQuery === '' || 
       m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       m.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [members, invitedMemberIds, registeredMemberIds, searchQuery]);

  const handleInvite = (memberId) => {
    inviteMemberToEvent(id, memberId);
    setEvent(getVolunteerEventById(id));
  };

  const handleCancelInvite = (memberId) => {
    cancelInvitation(id, memberId);
    setEvent(getVolunteerEventById(id));
  };

  return (
    <div className={styles.detailPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/admin/volunteers')}>
          <FiArrowLeft /> Back to Events
        </button>

        <h1 className={styles.title}>{event.name}</h1>

        <Card className={styles.infoCard}>
          <h2 className={styles.cardTitle}>Event Information</h2>
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
            <div className={styles.detailItem}>
              <FiUsers className={styles.icon} />
              <div>
                <div className={styles.detailLabel}>Capacity</div>
                <div className={styles.detailValue}>
                  {totalSignups} / {event.maxVolunteers} volunteers
                  {spotsRemaining > 0 && (
                    <Badge variant="info" className={styles.badge}>{spotsRemaining} spots available</Badge>
                  )}
                  {spotsRemaining === 0 && (
                    <Badge variant="warning" className={styles.badge}>Full</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {event.description && (
          <Card className={styles.descriptionCard}>
            <h2 className={styles.cardTitle}>Description</h2>
            <p>{event.description}</p>
          </Card>
        )}

        {fillPercentage < 50 && (
          <InfoBox type="warning" className={styles.warningBox}>
            <strong>Low Sign-Up Alert:</strong> This event is only {Math.round(fillPercentage)}% full.
            Consider sending a reminder to members.
          </InfoBox>
        )}

        <Card className={styles.volunteersCard}>
          <div className={styles.volunteersHeader}>
            <h2 className={styles.cardTitle}>Volunteers by Activity/Role</h2>
            <div className={styles.summaryStats}>
              <span className={styles.summaryItem}>
                <strong>{totalSignups}</strong> Total Volunteers
              </span>
              <span className={styles.summaryItem}>
                <strong>{event.roles.length}</strong> Activities
              </span>
            </div>
          </div>
          <div className={styles.rolesList}>
            {event.roles.map((role) => {
              const spotsAvailable = role.capacity - role.volunteers.length;
              return (
                <div key={role.name} className={styles.roleSection}>
                  <div className={styles.roleHeader}>
                    <div className={styles.roleHeaderLeft}>
                      <h3 className={styles.roleName}>{role.name}</h3>
                      <span className={styles.roleCapacity}>
                        {role.volunteers.length} / {role.capacity} volunteers
                      </span>
                    </div>
                    <div className={styles.roleStats}>
                      {spotsAvailable > 0 ? (
                        <Badge variant="info">{spotsAvailable} spots available</Badge>
                      ) : (
                        <Badge variant="success">Full</Badge>
                      )}
                    </div>
                  </div>
                  <div className={styles.volunteersList}>
                    {role.volunteers.length > 0 ? (
                      role.volunteers.map((volId) => {
                        const memberName = getMemberName(volId);
                        const memberPhone = getMemberPhone(volId);
                        const memberEmail = getMemberEmail(volId);
                        return (
                          <div key={volId} className={styles.volunteerItem}>
                            <Avatar name={memberName} size="md" />
                            <div className={styles.volunteerInfo}>
                              <span className={styles.volunteerName}>{memberName}</span>
                              <div className={styles.volunteerContact}>
                                {memberPhone && (
                                  <a href={`tel:${memberPhone}`} className={styles.contactLink}>
                                    <FiPhone size={12} /> {memberPhone}
                                  </a>
                                )}
                                {memberEmail && (
                                  <a href={`mailto:${memberEmail}`} className={styles.contactLink}>
                                    <FiMail size={12} /> {memberEmail}
                                  </a>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => navigate(`/admin/members/${volId}`)}
                            >
                              View Profile
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <div className={styles.noVolunteers}>
                        <span>No volunteers signed up for this activity yet</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className={styles.invitationsCard}>
          <div className={styles.invitationsHeader}>
            <h2 className={styles.cardTitle}>Invitations</h2>
            <Button 
              variant="success" 
              size="sm"
              onClick={() => setShowInviteModal(!showInviteModal)}
            >
              <FiUserPlus /> {showInviteModal ? 'Close' : 'Invite Members'}
            </Button>
          </div>

          {showInviteModal && (
            <div className={styles.inviteModal}>
              <SearchBar
                placeholder="Search members to invite..."
                onSearch={setSearchQuery}
              />
              <div className={styles.availableMembersList}>
                {availableMembers.length > 0 ? (
                  availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className={styles.memberItem}
                      onClick={() => handleInvite(member.id)}
                    >
                      <Avatar name={member.name} size="sm" />
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.name}</span>
                        <span className={styles.memberEmail}>{member.email}</span>
                      </div>
                      <Button variant="success" size="sm">
                        <FiUserPlus /> Invite
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className={styles.noMembers}>No available members to invite</p>
                )}
              </div>
            </div>
          )}

          <div className={styles.invitationStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Invited:</span>
              <span className={styles.statValue}>{invitations.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Accepted:</span>
              <span className={styles.statValue}>{acceptedInvites.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Pending:</span>
              <span className={styles.statValue}>{pendingInvites.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Declined:</span>
              <span className={styles.statValue}>{declinedInvites.length}</span>
            </div>
          </div>

          {invitations.length > 0 && (
            <div className={styles.invitationsList}>
              <div className={styles.invitationGroup}>
                <h3 className={styles.groupTitle}>
                  <FiCheck className={styles.groupIcon} style={{ color: 'var(--color-success)' }} />
                  Accepted ({acceptedInvites.length})
                </h3>
                {acceptedInvites.map((invite) => {
                  const member = members.find(m => m.id === invite.memberId);
                  if (!member) return null;
                  return (
                    <div key={invite.memberId} className={styles.invitationItem}>
                      <Avatar name={member.name} size="sm" />
                      <div className={styles.invitationInfo}>
                        <span className={styles.invitationName}>{member.name}</span>
                        <span className={styles.invitationEmail}>{member.email}</span>
                      </div>
                      <Badge variant="success">Accepted</Badge>
                    </div>
                  );
                })}
              </div>

              <div className={styles.invitationGroup}>
                <h3 className={styles.groupTitle}>
                  <FiClockIcon className={styles.groupIcon} style={{ color: 'var(--color-warning)' }} />
                  Pending ({pendingInvites.length})
                </h3>
                {pendingInvites.map((invite) => {
                  const member = members.find(m => m.id === invite.memberId);
                  if (!member) return null;
                  return (
                    <div key={invite.memberId} className={styles.invitationItem}>
                      <Avatar name={member.name} size="sm" />
                      <div className={styles.invitationInfo}>
                        <span className={styles.invitationName}>{member.name}</span>
                        <span className={styles.invitationEmail}>{member.email}</span>
                      </div>
                      <div className={styles.invitationActions}>
                        <Badge variant="warning">Pending</Badge>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelInvite(invite.memberId)}
                        >
                          <FiX /> Cancel
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {declinedInvites.length > 0 && (
                <div className={styles.invitationGroup}>
                  <h3 className={styles.groupTitle}>
                    <FiXCircle className={styles.groupIcon} style={{ color: 'var(--color-danger)' }} />
                    Declined ({declinedInvites.length})
                  </h3>
                  {declinedInvites.map((invite) => {
                    const member = members.find(m => m.id === invite.memberId);
                    if (!member) return null;
                    return (
                      <div key={invite.memberId} className={styles.invitationItem}>
                        <Avatar name={member.name} size="sm" />
                        <div className={styles.invitationInfo}>
                          <span className={styles.invitationName}>{member.name}</span>
                          <span className={styles.invitationEmail}>{member.email}</span>
                        </div>
                        <div className={styles.invitationActions}>
                          <Badge variant="danger">Declined</Badge>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCancelInvite(invite.memberId)}
                          >
                            <FiX /> Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {invitations.length === 0 && (
            <p className={styles.noInvitations}>No invitations sent yet. Click "Invite Members" to send invitations.</p>
          )}
        </Card>

        <InfoBox type="info" className={styles.checkInInfo}>
          <strong>Check-In Status:</strong> QR codes for check-in and check-out are automatically
          generated. Volunteers can scan these codes when they arrive and leave to track their hours.
        </InfoBox>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => {}}>
            <FiMail /> Email All Volunteers
          </Button>
          <Button variant="secondary" onClick={() => {}}>
            <FiDownload /> Export List
          </Button>
        </div>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AdminVolunteerDetail;

