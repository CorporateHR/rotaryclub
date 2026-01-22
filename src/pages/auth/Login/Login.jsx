import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import Header from '../../../components/navigation/Header/Header';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = login(email, password);
    if (result.success) {
      if (result.user.isAdmin) {
        navigate('/admin/home');
      } else {
        navigate('/member/home');
      }
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className={styles.loginPage}>
      <Header currentView="login" />
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your ClubTracker account</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <div className={styles.forgotPassword}>
              <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <Button type="submit" variant="primary" className={styles.submitButton}>
              Sign In
            </Button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <Button
            variant="secondary"
            className={styles.registerButton}
            onClick={() => navigate('/register')}
          >
            Create New Account
          </Button>

          <InfoBox type="info" className={styles.demoInfo}>
            <strong>Demo Credentials:</strong>
            <br />
            Member: john.doe@example.com / password123
            <br />
            Admin: admin@clubtracker.com / admin123
          </InfoBox>
        </div>
      </div>
    </div>
  );
};

export default Login;

