import { STORAGE_KEYS } from './constants';

// Generic CRUD operations
export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting data for ${key}:`, error);
    return [];
  }
};

export const setData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting data for ${key}:`, error);
    return false;
  }
};

// Members
export const getMembers = () => getData(STORAGE_KEYS.MEMBERS);
export const setMembers = (members) => setData(STORAGE_KEYS.MEMBERS, members);
export const getMemberById = (id) => {
  const members = getMembers();
  return members.find(m => m.id === id);
};
export const addMember = (member) => {
  const members = getMembers();
  const newMember = { ...member, id: Date.now().toString() };
  members.push(newMember);
  setMembers(members);
  return newMember;
};
export const updateMember = (id, updates) => {
  const members = getMembers();
  const index = members.findIndex(m => m.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...updates };
    setMembers(members);
    return members[index];
  }
  return null;
};

// Meetings
export const getMeetings = () => getData(STORAGE_KEYS.MEETINGS);
export const setMeetings = (meetings) => setData(STORAGE_KEYS.MEETINGS, meetings);
export const getMeetingById = (id) => {
  const meetings = getMeetings();
  return meetings.find(m => m.id === id);
};
export const addMeeting = (meeting) => {
  const meetings = getMeetings();
  const newMeeting = { ...meeting, id: Date.now().toString() };
  meetings.push(newMeeting);
  setMeetings(meetings);
  return newMeeting;
};
export const updateMeeting = (id, updates) => {
  const meetings = getMeetings();
  const index = meetings.findIndex(m => m.id === id);
  if (index !== -1) {
    meetings[index] = { ...meetings[index], ...updates };
    setMeetings(meetings);
    return meetings[index];
  }
  return null;
};

// Volunteer Events
export const getVolunteerEvents = () => getData(STORAGE_KEYS.VOLUNTEER_EVENTS);
export const setVolunteerEvents = (events) => setData(STORAGE_KEYS.VOLUNTEER_EVENTS, events);
export const getVolunteerEventById = (id) => {
  const events = getVolunteerEvents();
  return events.find(e => e.id === id);
};
export const addVolunteerEvent = (event) => {
  const events = getVolunteerEvents();
  const newEvent = { ...event, id: Date.now().toString() };
  events.push(newEvent);
  setVolunteerEvents(events);
  return newEvent;
};
export const updateVolunteerEvent = (id, updates) => {
  const events = getVolunteerEvents();
  const index = events.findIndex(e => e.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...updates };
    setVolunteerEvents(events);
    return events[index];
  }
  return null;
};

// Invitations
export const inviteMemberToEvent = (eventId, memberId) => {
  const events = getVolunteerEvents();
  const event = events.find(e => e.id === eventId);
  if (!event) return null;

  if (!event.invitations) {
    event.invitations = [];
  }

  // Check if already invited
  const existingInvite = event.invitations.find(inv => inv.memberId === memberId);
  if (existingInvite) {
    return event; // Already invited
  }

  event.invitations.push({
    memberId,
    status: 'pending', // pending, accepted, declined
    invitedAt: new Date().toISOString(),
  });

  const index = events.findIndex(e => e.id === eventId);
  events[index] = event;
  setVolunteerEvents(events);
  return event;
};

export const cancelInvitation = (eventId, memberId) => {
  const events = getVolunteerEvents();
  const event = events.find(e => e.id === eventId);
  if (!event || !event.invitations) return null;

  event.invitations = event.invitations.filter(inv => inv.memberId !== memberId);
  
  const index = events.findIndex(e => e.id === eventId);
  events[index] = event;
  setVolunteerEvents(events);
  return event;
};

export const updateInvitationStatus = (eventId, memberId, status) => {
  const events = getVolunteerEvents();
  const event = events.find(e => e.id === eventId);
  if (!event || !event.invitations) return null;

  const invite = event.invitations.find(inv => inv.memberId === memberId);
  if (invite) {
    invite.status = status;
    if (status === 'accepted') {
      invite.acceptedAt = new Date().toISOString();
    }
  }

  const index = events.findIndex(e => e.id === eventId);
  events[index] = event;
  setVolunteerEvents(events);
  return event;
};

// Attendance
export const getAttendance = () => getData(STORAGE_KEYS.ATTENDANCE);
export const setAttendance = (attendance) => setData(STORAGE_KEYS.ATTENDANCE, attendance);
export const addAttendance = (memberId, meetingId, checkInTime) => {
  const attendance = getAttendance();
  const newRecord = {
    id: Date.now().toString(),
    memberId,
    meetingId,
    checkInTime,
    createdAt: new Date().toISOString(),
  };
  attendance.push(newRecord);
  setAttendance(attendance);
  return newRecord;
};
export const getMemberAttendance = (memberId) => {
  const attendance = getAttendance();
  return attendance.filter(a => a.memberId === memberId);
};

// Volunteer Hours
export const getVolunteerHours = () => getData(STORAGE_KEYS.VOLUNTEER_HOURS);
export const setVolunteerHours = (hours) => setData(STORAGE_KEYS.VOLUNTEER_HOURS, hours);
export const addVolunteerCheckIn = (memberId, eventId, checkInTime) => {
  const hours = getVolunteerHours();
  const newRecord = {
    id: Date.now().toString(),
    memberId,
    eventId,
    checkInTime,
    checkOutTime: null,
    hours: 0,
    createdAt: new Date().toISOString(),
  };
  hours.push(newRecord);
  setVolunteerHours(hours);
  return newRecord;
};
export const updateVolunteerCheckOut = (recordId, checkOutTime, hours) => {
  const records = getVolunteerHours();
  const index = records.findIndex(r => r.id === recordId);
  if (index !== -1) {
    records[index].checkOutTime = checkOutTime;
    records[index].hours = hours;
    setVolunteerHours(records);
    return records[index];
  }
  return null;
};
export const getMemberVolunteerHours = (memberId) => {
  const hours = getVolunteerHours();
  return hours.filter(h => h.memberId === memberId && h.checkOutTime !== null);
};
export const getMemberTotalVolunteerHours = (memberId) => {
  const hours = getMemberVolunteerHours(memberId);
  return hours.reduce((total, h) => total + (h.hours || 0), 0);
};

// Guests
export const getGuests = () => getData(STORAGE_KEYS.GUESTS);
export const setGuests = (guests) => setData(STORAGE_KEYS.GUESTS, guests);
export const addGuest = (guestData) => {
  const guests = getGuests();
  const newGuest = {
    id: Date.now().toString(),
    ...guestData,
    createdAt: new Date().toISOString(),
  };
  guests.push(newGuest);
  setGuests(guests);
  return newGuest;
};
export const getGuestsByMeeting = (meetingId) => {
  const guests = getGuests();
  return guests.filter(g => g.meetingId === meetingId);
};
export const getGuestsByMember = (memberId) => {
  const guests = getGuests();
  return guests.filter(g => g.addedBy === memberId);
};

