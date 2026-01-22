import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMeeting } from '../../../utils/dataManager';
import { generateMeetingQR } from '../../../utils/qrCode';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Input from '../../../components/common/Input/Input';
import Textarea from '../../../components/common/Textarea/Textarea';
import Select from '../../../components/common/Select/Select';
import Button from '../../../components/common/Button/Button';
import styles from './CreateMeeting.module.css';

const CreateMeeting = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'club',
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    expectedAttendance: '',
    agenda: '',
  });

  const meetingTypes = [
    { value: 'club', label: 'Club Meeting' },
    { value: 'board', label: 'Board Meeting' },
    { value: 'committee', label: 'Committee Meeting' },
    { value: 'social', label: 'Social Event' },
    { value: 'special', label: 'Special Event' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const qrToken = generateMeetingQR(Date.now().toString());
    const meeting = {
      ...formData,
      expectedAttendance: parseInt(formData.expectedAttendance) || 0,
      agenda: formData.agenda.split('\n').filter(line => line.trim()),
      qrToken,
      checkIns: [],
      date: new Date(formData.date).toISOString(),
    };
    const newMeeting = addMeeting(meeting);
    navigate(`/admin/meetings/created/${newMeeting.id}`);
  };

  return (
    <div className={styles.createPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>Create Meeting</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Select
            label="Meeting Type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            options={meetingTypes}
          />

          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Weekly Club Meeting"
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
            placeholder="Community Center, Main Hall"
            required
          />

          <Input
            type="number"
            label="Expected Attendance"
            value={formData.expectedAttendance}
            onChange={(e) => handleChange('expectedAttendance', e.target.value)}
            placeholder="45"
          />

          <Textarea
            label="Agenda (one item per line)"
            value={formData.agenda}
            onChange={(e) => handleChange('agenda', e.target.value)}
            placeholder="Welcome and introductions&#10;Treasurer report&#10;New business"
            rows={5}
          />

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/meetings')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create & Generate QR
            </Button>
          </div>
        </form>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default CreateMeeting;

