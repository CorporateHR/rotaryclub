import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getMemberById, updateMember } from '../../../utils/dataManager';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import styles from './EditProfile.module.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const member = user ? getMemberById(user.id) : null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
      });
    }
  }, [member]);

  if (!member) {
    return <div>Loading...</div>;
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMember(member.id, formData);
    navigate('/member/profile');
  };

  return (
    <div className={styles.editPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Profile</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />

          <Input
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />

          <Input
            type="tel"
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            required
          />

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={() => navigate('/member/profile')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default EditProfile;

