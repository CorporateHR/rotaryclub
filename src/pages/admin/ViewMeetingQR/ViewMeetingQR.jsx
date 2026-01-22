import { useParams, useNavigate } from 'react-router-dom';
import { getMeetingById, getMembers } from '../../../utils/dataManager';
import { QRCodeSVG } from 'qrcode.react';
import { FiArrowLeft, FiDownload, FiMail, FiPhone, FiUsers } from 'react-icons/fi';
import { format } from 'date-fns';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import Badge from '../../../components/common/Badge/Badge';
import Avatar from '../../../components/common/Avatar/Avatar';
import styles from './ViewMeetingQR.module.css';

const ViewMeetingQR = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meeting = getMeetingById(id);
  const members = getMembers();

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

  const getTotalAssignments = () => {
    if (!meeting.roles) return 0;
    return meeting.roles.reduce((total, role) => total + role.volunteers.length, 0);
  };

  if (!meeting) {
    return (
      <div>
        <Header currentView="admin" />
        <div className={styles.container}><p>Meeting not found</p></div>
      </div>
    );
  }

  const handleDownload = () => {
    // Create a canvas element to convert QR to image
    const svg = document.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `meeting-qr-${meeting.id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <div className={styles.qrPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/admin/meetings')}>
          <FiArrowLeft /> Back to Meetings
        </button>

        <h1 className={styles.title}>{meeting.title}</h1>
        <p className={styles.subtitle}>{format(new Date(meeting.date), 'EEEE, MMMM d, yyyy')} at {meeting.startTime}</p>

        <Card className={styles.qrCard}>
          <h2 className={styles.cardTitle}>Check-In QR Code</h2>
          <div className={styles.qrContainer}>
            <QRCodeSVG value={meeting.qrToken || ''} size={300} />
          </div>
          <div className={styles.qrInfo}>
            <p><strong>Token ID:</strong> {meeting.qrToken?.split(':')[2] || 'N/A'}</p>
            <p><strong>Meeting ID:</strong> {meeting.id}</p>
            <p><strong>Meeting Type:</strong> {meeting.type}</p>
          </div>
        </Card>

        {meeting.roles && meeting.roles.length > 0 && (
          <Card className={styles.activitiesCard}>
            <div className={styles.activitiesHeader}>
              <h2 className={styles.cardTitle}>Meeting Activities & Assignments</h2>
              <div className={styles.summaryStats}>
                <span className={styles.summaryItem}>
                  <strong>{getTotalAssignments()}</strong> Members Assigned
                </span>
                <span className={styles.summaryItem}>
                  <strong>{meeting.roles.length}</strong> Activities
                </span>
              </div>
            </div>
            <div className={styles.rolesList}>
              {meeting.roles.map((role) => {
                const spotsAvailable = role.capacity - role.volunteers.length;
                return (
                  <div key={role.name} className={styles.roleSection}>
                    <div className={styles.roleHeader}>
                      <div className={styles.roleHeaderLeft}>
                        <h3 className={styles.roleName}>{role.name}</h3>
                        <span className={styles.roleCapacity}>
                          {role.volunteers.length} / {role.capacity} assigned
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
                          <span>No members assigned to this activity yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        <Card className={styles.instructionsCard}>
          <h2 className={styles.cardTitle}>QR Code Instructions</h2>
          <ul className={styles.instructionsList}>
            <li>Display this QR code at the meeting venue</li>
            <li>Members can scan it using the ClubTracker app</li>
            <li>Check-ins will be automatically recorded</li>
            <li>You can download or email this QR code to share with members</li>
          </ul>
        </Card>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleDownload}>
            <FiDownload /> Download QR Code
          </Button>
          <Button variant="primary" onClick={() => {}}>
            <FiMail /> Email to Members
          </Button>
        </div>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default ViewMeetingQR;

