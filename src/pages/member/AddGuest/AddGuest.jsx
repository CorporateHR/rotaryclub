import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiUsers } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { addGuest, getMeetingById } from '../../../utils/dataManager';
import styles from './AddGuest.module.css';

const AddGuest = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const meeting = getMeetingById(meetingId);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Guest name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addGuest({
        ...formData,
        meetingId,
        addedBy: user.id,
        addedByName: user.name,
        checkInTime: new Date().toISOString(),
      });
      
      navigate('/member/guest-added', { 
        state: { 
          guestName: formData.name,
          meetingId,
          meetingTitle: meeting?.title 
        } 
      });
    } catch (error) {
      console.error('Error adding guest:', error);
      alert('Failed to add guest. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!meeting) {
    return (
      <div className={styles.addGuestPage}>
        <Header currentView="member" />
        <div className={styles.container}>
          <p>Meeting not found</p>
          <Button onClick={() => navigate('/member/home')}>Go Home</Button>
        </div>
        <BottomNav type="member" />
      </div>
    );
  }

  return (
    <div className={styles.addGuestPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <h1 className={styles.title}>Add Guest</h1>
        <p className={styles.subtitle}>Register a guest for {meeting.title}</p>

        <Card className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                <FiUser className={styles.labelIcon} />
                Guest Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Enter guest's full name"
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <FiMail className={styles.labelIcon} />
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="guest@example.com"
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                <FiPhone className={styles.labelIcon} />
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="relationship" className={styles.label}>
                <FiUsers className={styles.labelIcon} />
                Relationship (Optional)
              </label>
              <input
                type="text"
                id="relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., Friend, Colleague, Family"
              />
            </div>

            <div className={styles.buttonGroup}>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => navigate('/member/home')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Guest'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default AddGuest;
