import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import Header from '../../../components/navigation/Header/Header';
import styles from './RegisterSuccess.module.css';

const RegisterSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || {
    name: 'New User',
    email: 'user@example.com',
  };

  return (
    <div className={styles.successPage}>
      <Header currentView="login" />
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.iconContainer}>
            <FiCheckCircle className={styles.icon} />
          </div>

          <h1 className={styles.title}>Account Created!</h1>
          <p className={styles.subtitle}>Welcome to ClubTracker, {user.name}!</p>

          <Card className={styles.accountCard}>
            <div className={styles.accountDetails}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Name:</span>
                <span className={styles.value}>{user.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Status:</span>
                <Badge variant="warning">Pending Approval</Badge>
              </div>
            </div>
          </Card>

          <InfoBox type="info" className={styles.infoBox}>
            <strong>What's Next?</strong>
            <br />
            Your account is pending approval from the club administrator. You'll receive an email
            notification once your account has been approved. In the meantime, you can explore
            the public features of ClubTracker.
          </InfoBox>

          <Button
            variant="primary"
            className={styles.button}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;

