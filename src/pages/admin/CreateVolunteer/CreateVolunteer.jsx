import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addVolunteerEvent, getMembers } from '../../../utils/dataManager';
import { generateVolunteerCheckInQR as genCheckIn, generateVolunteerCheckOutQR as genCheckOut } from '../../../utils/qrCode';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Input from '../../../components/common/Input/Input';
import Textarea from '../../../components/common/Textarea/Textarea';
import Select from '../../../components/common/Select/Select';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import Avatar from '../../../components/common/Avatar/Avatar';
import Badge from '../../../components/common/Badge/Badge';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import styles from './CreateVolunteer.module.css';

const CreateVolunteer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxVolunteers: '',
    champion: '',
    roles: '',
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const allMembers = getMembers();
    setMembers(allMembers);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse roles from textarea (one per line)
    const rolesList = formData.roles
      .split('\n')
      .filter(line => line.trim())
      .map((roleName, index) => ({
        name: roleName.trim(),
        capacity: 5, // Default capacity, can be enhanced
        volunteers: [],
      }));

    const eventId = Date.now().toString();
    
    // Create invitations for selected members
    const invitations = selectedMembers.map(memberId => ({
      memberId,
      status: 'pending',
      invitedAt: new Date().toISOString(),
    }));

    const event = {
      ...formData,
      maxVolunteers: parseInt(formData.maxVolunteers) || 20,
      roles: rolesList,
      qrTokenIn: genCheckIn(eventId),
      qrTokenOut: genCheckOut(eventId),
      date: new Date(formData.date).toISOString(),
      invitations: invitations,
    };

    const newEvent = addVolunteerEvent(event);
    navigate(`/admin/volunteers/created/${newEvent.id}`);
  };

  return (
    <div className={styles.createPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>Create Volunteer Event</h1>

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

          <Select
            label="Event Champion (Leader)"
            value={formData.champion}
            onChange={(e) => handleChange('champion', e.target.value)}
            options={[
              { value: '', label: 'Select Champion' },
              ...members.map(m => ({ value: m.id, label: m.name }))
            ]}
          />

          <Textarea
            label="Available Roles (one per line)"
            value={formData.roles}
            onChange={(e) => handleChange('roles', e.target.value)}
            placeholder="Sorting & Packing&#10;Distribution&#10;Setup & Cleanup&#10;Registration Desk"
            rows={6}
            required
          />

          <Card className={styles.inviteCard}>
            <h2 className={styles.cardTitle}>Invite Members (Optional)</h2>
            <p className={styles.cardSubtitle}>Select members to invite to this event</p>
            
            <SearchBar
              placeholder="Search members to invite..."
              onSearch={setSearchQuery}
            />

            <div className={styles.membersList}>
              {filteredMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className={`${styles.memberItem} ${isSelected ? styles.selected : ''}`}
                    onClick={() => toggleMemberSelection(member.id)}
                  >
                    <Avatar name={member.name} size="sm" />
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.memberEmail}>{member.email}</span>
                    </div>
                    {isSelected && <Badge variant="success">Selected</Badge>}
                  </div>
                );
              })}
            </div>

            {selectedMembers.length > 0 && (
              <div className={styles.selectedCount}>
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </Card>

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/volunteers')}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Create Event
            </Button>
          </div>
        </form>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default CreateVolunteer;

