import { useParams, useNavigate } from 'react-router-dom';
import { getMeetingById } from '../../../utils/dataManager';
import { QRCodeSVG } from 'qrcode.react';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import { FiCheckCircle, FiDownload, FiMail } from 'react-icons/fi';
import styles from './MeetingCreated.module.css';

const MeetingCreated = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meeting = getMeetingById(id);

  if (!meeting) {
    return <div>Meeting not found</div>;
  }

  return (
    <div className={styles.successPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h1 className={styles.title}>Meeting Created!</h1>

        <Card className={styles.qrCard}>
          <h2 className={styles.cardTitle}>QR Code</h2>
          <div className={styles.qrContainer}>
            <QRCodeSVG value={meeting.qrToken || ''} size={200} />
          </div>
          <div className={styles.qrInfo}>
            <p><strong>Token ID:</strong> {meeting.qrToken?.split(':')[2] || 'N/A'}</p>
            <p><strong>Meeting ID:</strong> {meeting.id}</p>
          </div>
        </Card>

        <Card className={styles.summaryCard}>
          <h2 className={styles.cardTitle}>Meeting Summary</h2>
          <div className={styles.summary}>
            <p><strong>Title:</strong> {meeting.title}</p>
            <p><strong>Date:</strong> {new Date(meeting.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {meeting.startTime} - {meeting.endTime}</p>
            <p><strong>Location:</strong> {meeting.location}</p>
          </div>
        </Card>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => {}}>
            <FiDownload /> Download QR Code
          </Button>
          <Button variant="primary" onClick={() => {}}>
            <FiMail /> Email to Members
          </Button>
          <Button variant="success" onClick={() => navigate('/admin/meetings/create')}>
            Create Another
          </Button>
        </div>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default MeetingCreated;

