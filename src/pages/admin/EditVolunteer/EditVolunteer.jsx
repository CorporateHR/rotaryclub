import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVolunteerEventById, updateVolunteerEvent } from '../../../utils/dataManager';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Input from '../../../components/common/Input/Input';
import Textarea from '../../../components/common/Textarea/Textarea';
import Button from '../../../components/common/Button/Button';
import styles from './EditVolunteer.module.css';

const EditVolunteer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getVolunteerEventById(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxVolunteers: '',
    roles: '',
  });

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setFormData({
        name: event.name || '',
        description: event.description || '',
        date: eventDate.toISOString().split('T')[0],
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        location: event.location || '',
        maxVolunteers: event.maxVolunteers?.toString() || '',
        roles: event.roles?.map(r => r.name).join('\n') || '',
      });
    }
  }, [event]);

  if (!event) {
    return (
      <div>
        <Header currentView="admin" />
        <div className={styles.container}><p>Event not found</p></div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse roles from textarea (one per line)
    const rolesList = formData.roles
      .split('\n')
      .filter(line => line.trim())
      .map((roleName) => {
        // Try to find existing role to preserve volunteers
        const existingRole = event.roles?.find(r => r.name === roleName.trim());
        return {
          name: roleName.trim(),
          capacity: existingRole?.capacity || 5,
          volunteers: existingRole?.volunteers || [],
        };
      });

    const updatedEvent = {
      ...formData,
      maxVolunteers: parseInt(formData.maxVolunteers) || 20,
      roles: rolesList,
      date: new Date(formData.date).toISOString(),
    };

    updateVolunteerEvent(id, updatedEvent);
    navigate('/admin/volunteers');
  };

  return (
    <div className={styles.editPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Volunteer Event</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Event Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Food Bank Volunteer Day"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Help sort and pack food donations for local families in need."
            rows={4}
            required
          />

          <Input
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />

          <div className={styles.timeRow}>
            <Input
              type="time"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              required
            />
            <Input
              type="time"
              label="End Time"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              required
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Community Food Bank, 123 Food St"
            required
          />

          <Input
            type="number"
            label="Maximum Volunteers"
            value={formData.maxVolunteers}
            onChange={(e) => handleChange('maxVolunteers', e.target.value)}
            placeholder="20"
            required
          />

          <Textarea
            label="Available Roles (one per line)"
            value={formData.roles}
            onChange={(e) => handleChange('roles', e.target.value)}
            placeholder="Sorting & Packing&#10;Distribution&#10;Setup & Cleanup"
            rows={6}
            required
          />

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/volunteers')}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default EditVolunteer;

