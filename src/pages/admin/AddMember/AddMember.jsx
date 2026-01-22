import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMember } from '../../../utils/dataManager';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Input from '../../../components/common/Input/Input';
import Select from '../../../components/common/Select/Select';
import Button from '../../../components/common/Button/Button';
import styles from './AddMember.module.css';

const AddMember = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'active',
    memberNumber: '',
    joinYear: new Date().getFullYear().toString(),
    password: 'password123', // Default password
  });

  const roleOptions = [
    { value: 'active', label: 'Active Member' },
    { value: 'president', label: 'President' },
    { value: 'secretary', label: 'Secretary' },
    { value: 'treasurer', label: 'Treasurer' },
    { value: 'board', label: 'Board Member' },
    { value: 'new', label: 'New Member' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateMemberNumber = () => {
    const members = JSON.parse(localStorage.getItem('clubtracker_members') || '[]');
    const nextNumber = members.length + 1;
    return `ROT-${String(nextNumber).padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newMember = {
      ...formData,
      memberNumber: formData.memberNumber || generateMemberNumber(),
      joinYear: parseInt(formData.joinYear) || new Date().getFullYear(),
      status: 'active',
    };

    addMember(newMember);
    navigate('/admin/members');
  };

  return (
    <div className={styles.addPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>Add New Member</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
            required
          />

          <Input
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john.doe@example.com"
            required
          />

          <Input
            type="tel"
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main St, City, State 12345"
            required
          />

          <div className={styles.row}>
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              options={roleOptions}
            />

            <Input
              label="Member Number"
              value={formData.memberNumber}
              onChange={(e) => handleChange('memberNumber', e.target.value)}
              placeholder="Auto-generated if empty"
            />
          </div>

          <Input
            type="number"
            label="Join Year"
            value={formData.joinYear}
            onChange={(e) => handleChange('joinYear', e.target.value)}
            placeholder={new Date().getFullYear().toString()}
            required
          />

          <Input
            type="password"
            label="Default Password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="password123"
            required
          />

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/members')}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Add Member
            </Button>
          </div>
        </form>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AddMember;

