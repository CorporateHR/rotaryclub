import { useParams, useNavigate } from 'react-router-dom';
import { getVolunteerEventById } from '../../../utils/dataManager';
import { format } from 'date-fns';
import { FiCheckCircle, FiMail } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import styles from './VolunteerCreated.module.css';

const VolunteerCreated = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getVolunteerEventById(id);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className={styles.successPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <FiCheckCircle />
        </div>
        <h1 className={styles.title}>Volunteer Event Created!</h1>

        <Card className={styles.summaryCard}>
          <h2 className={styles.cardTitle}>Event Summary</h2>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <strong>Event Name:</strong> {event.name}
            </div>
            <div className={styles.summaryItem}>
              <strong>Date:</strong> {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className={styles.summaryItem}>
              <strong>Time:</strong> {event.startTime} - {event.endTime}
            </div>
            <div className={styles.summaryItem}>
              <strong>Location:</strong> {event.location}
            </div>
            <div className={styles.summaryItem}>
              <strong>Capacity:</strong> {event.maxVolunteers} volunteers
            </div>
            <div className={styles.summaryItem}>
              <strong>Roles Defined:</strong> {event.roles?.length || 0}
            </div>
          </div>
        </Card>

        <InfoBox type="info" className={styles.infoBox}>
          <strong>Next Steps:</strong>
          <br />
          • The event is now visible to all members
          <br />
          • Members can sign up for available roles
          <br />
          • QR codes for check-in/check-out will be generated automatically
          <br />
          • Volunteer hours will be tracked when members check in and out
        </InfoBox>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => {}}>
            <FiMail /> Notify Members
          </Button>
          <Button variant="success" onClick={() => navigate('/admin/volunteers/create')}>
            Create Another
          </Button>
        </div>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default VolunteerCreated;

