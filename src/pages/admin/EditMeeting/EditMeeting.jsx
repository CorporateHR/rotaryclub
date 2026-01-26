import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMeetingById, updateMeeting, getMembers } from '../../../utils/dataManager';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Input from '../../../components/common/Input/Input';
import Textarea from '../../../components/common/Textarea/Textarea';
import Select from '../../../components/common/Select/Select';
import Button from '../../../components/common/Button/Button';
import styles from './EditMeeting.module.css';

const EditMeeting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meeting = getMeetingById(id);
  const [members, setMembers] = useState([]);
  
  const [formData, setFormData] = useState({
    type: 'club',
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    expectedAttendance: '',
    agenda: '',
    meetingRoles: {
      president: '',
      greeter: '',
      jokeOfTheDay: '',
      thoughtOfTheDay: '',
    },
  });

  useEffect(() => {
    const allMembers = getMembers();
    setMembers(allMembers);

    if (meeting) {
      const meetingDate = new Date(meeting.date);
      setFormData({
        type: meeting.type || 'club',
        title: meeting.title || '',
        date: meetingDate.toISOString().split('T')[0],
        startTime: meeting.startTime || '',
        endTime: meeting.endTime || '',
        location: meeting.location || '',
        expectedAttendance: meeting.expectedAttendance?.toString() || '',
        agenda: meeting.agenda?.join('\n') || '',
        meetingRoles: {
          president: meeting.meetingRoles?.president || '',
          greeter: meeting.meetingRoles?.greeter || '',
          jokeOfTheDay: meeting.meetingRoles?.jokeOfTheDay || '',
          thoughtOfTheDay: meeting.meetingRoles?.thoughtOfTheDay || '',
        },
      });
    }
  }, [meeting]);

  if (!meeting) {
    return (
      <div>
        <Header currentView="admin" />
        <div className={styles.container}><p>Meeting not found</p></div>
      </div>
    );
  }

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

  const handleRoleChange = (role, value) => {
    setFormData(prev => ({
      ...prev,
      meetingRoles: {
        ...prev.meetingRoles,
        [role]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMeeting = {
      ...formData,
      expectedAttendance: parseInt(formData.expectedAttendance) || 0,
      agenda: formData.agenda.split('\n').filter(line => line.trim()),
      date: new Date(formData.date).toISOString(),
    };
    updateMeeting(id, updatedMeeting);
    navigate('/admin/meetings');
  };

  return (
    <div className={styles.editPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>Edit Meeting</h1>

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

          <div className={styles.rolesSection}>
            <h3 className={styles.rolesTitle}>Meeting Roles</h3>
            
            <Select
              label="President"
              value={formData.meetingRoles.president}
              onChange={(e) => handleRoleChange('president', e.target.value)}
              options={[
                { value: '', label: 'Select Member' },
                ...members.map(m => ({ value: m.id, label: m.name }))
              ]}
            />

            <Select
              label="Greeter"
              value={formData.meetingRoles.greeter}
              onChange={(e) => handleRoleChange('greeter', e.target.value)}
              options={[
                { value: '', label: 'Select Member' },
                ...members.map(m => ({ value: m.id, label: m.name }))
              ]}
            />

            <Select
              label="Joke of the Day"
              value={formData.meetingRoles.jokeOfTheDay}
              onChange={(e) => handleRoleChange('jokeOfTheDay', e.target.value)}
              options={[
                { value: '', label: 'Select Member' },
                ...members.map(m => ({ value: m.id, label: m.name }))
              ]}
            />

            <Select
              label="Thought of the Day"
              value={formData.meetingRoles.thoughtOfTheDay}
              onChange={(e) => handleRoleChange('thoughtOfTheDay', e.target.value)}
              options={[
                { value: '', label: 'Select Member' },
                ...members.map(m => ({ value: m.id, label: m.name }))
              ]}
            />
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/meetings')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default EditMeeting;

