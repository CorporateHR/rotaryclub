import { STORAGE_KEYS } from '../utils/constants';

// Initialize mock data if not already present
export const initializeMockData = () => {
  // Check if data already exists
  if (localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    return; // Data already initialized
  }

  // Members
  const members = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      role: 'active',
      memberNumber: 'ROT-001',
      joinYear: 2020,
      status: 'active',
      password: 'password123', // In real app, this would be hashed
    },
    {
      id: '2',
      name: 'Sarah Anderson',
      email: 'sarah.anderson@example.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, City, State 12345',
      role: 'president',
      memberNumber: 'ROT-002',
      joinYear: 2018,
      status: 'active',
      password: 'password123',
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine Rd, City, State 12345',
      role: 'secretary',
      memberNumber: 'ROT-003',
      joinYear: 2019,
      status: 'active',
      password: 'password123',
    },
    {
      id: '4',
      name: 'Emily Williams',
      email: 'emily.williams@example.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, City, State 12345',
      role: 'active',
      memberNumber: 'ROT-004',
      joinYear: 2021,
      status: 'active',
      password: 'password123',
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Dr, City, State 12345',
      role: 'new',
      memberNumber: 'ROT-005',
      joinYear: 2024,
      status: 'active',
      password: 'password123',
    },
    {
      id: '6',
      name: 'Lisa Chen',
      email: 'lisa.chen@example.com',
      phone: '+1 (555) 678-9012',
      address: '987 Cedar Ln, City, State 12345',
      role: 'treasurer',
      memberNumber: 'ROT-006',
      joinYear: 2017,
      status: 'active',
      password: 'password123',
    },
  ];

  // Admin user
  const adminUser = {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@clubtracker.com',
    password: 'admin123',
    isAdmin: true,
    role: 'admin',
  };

  // Meetings
  const meetings = [
    {
      id: '1',
      title: 'Weekly Club Meeting',
      type: 'club',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      startTime: '18:00',
      endTime: '19:30',
      location: 'Community Center, Main Hall',
      expectedAttendance: 45,
      agenda: [
        'Welcome and introductions',
        'Treasurer report',
        'Upcoming volunteer opportunities',
        'New business',
        'Adjournment',
      ],
      qrToken: 'MEETING:1:ABC123XYZ',
      checkIns: [],
      roles: [
        { name: 'Speaker/Presenter', capacity: 2, volunteers: ['2', '3'] },
        { name: 'Greeter', capacity: 2, volunteers: ['1'] },
        { name: 'Setup Team', capacity: 3, volunteers: ['4', '5'] },
        { name: 'Refreshments', capacity: 2, volunteers: ['6'] },
      ],
    },
    {
      id: '2',
      title: 'Board Meeting',
      type: 'board',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      startTime: '17:00',
      endTime: '18:30',
      location: 'Club Office, Conference Room',
      expectedAttendance: 12,
      agenda: [
        'Budget review',
        'Strategic planning',
        'Member applications',
      ],
      qrToken: 'MEETING:2:XYZ789ABC',
      checkIns: [],
      roles: [
        { name: 'Chairperson', capacity: 1, volunteers: ['2'] },
        { name: 'Secretary/Minutes', capacity: 1, volunteers: ['3'] },
        { name: 'Treasurer Report', capacity: 1, volunteers: ['6'] },
      ],
    },
    {
      id: '3',
      title: 'Monthly Social Gathering',
      type: 'social',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      startTime: '19:00',
      endTime: '21:00',
      location: 'Local Restaurant',
      expectedAttendance: 30,
      agenda: ['Socializing and networking'],
      qrToken: 'MEETING:3:DEF456GHI',
      checkIns: ['1', '2', '3', '4'],
      roles: [
        { name: 'Event Coordinator', capacity: 1, volunteers: ['2'] },
        { name: 'Venue Liaison', capacity: 1, volunteers: ['1'] },
      ],
    },
  ];

  // Volunteer Events
  const volunteerEvents = [
    {
      id: '1',
      name: 'Food Bank Volunteer Day',
      description: 'Help sort and pack food donations for local families in need.',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      startTime: '09:00',
      endTime: '15:00',
      location: 'Community Food Bank, 123 Food St',
      maxVolunteers: 20,
      roles: [
        { name: 'Sorting & Packing', capacity: 6, volunteers: ['1', '2', '3', '4', '5'] },
        { name: 'Distribution', capacity: 5, volunteers: ['6', '1', '2', '3'] },
        { name: 'Setup & Cleanup', capacity: 2, volunteers: ['4', '5'] },
        { name: 'Registration Desk', capacity: 2, volunteers: ['1'] },
      ],
      qrTokenIn: 'VOLUNTEER-IN:1:TOKEN123',
      qrTokenOut: 'VOLUNTEER-OUT:1:TOKEN456',
    },
    {
      id: '2',
      name: 'Park Cleanup Event',
      description: 'Community park cleanup and trail maintenance.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      startTime: '08:00',
      endTime: '12:00',
      location: 'Riverside Park, Main Entrance',
      maxVolunteers: 20,
      roles: [
        { name: 'Litter Collection', capacity: 8, volunteers: ['1', '2'] },
        { name: 'Trail Trimming', capacity: 6, volunteers: ['3'] },
        { name: 'General Support', capacity: 6, volunteers: ['4', '5'] },
      ],
      qrTokenIn: 'VOLUNTEER-IN:2:TOKEN789',
      qrTokenOut: 'VOLUNTEER-OUT:2:TOKEN012',
    },
  ];

  // Attendance records
  const attendance = [
    { id: '1', memberId: '1', meetingId: '3', checkInTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', memberId: '2', meetingId: '3', checkInTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', memberId: '3', meetingId: '3', checkInTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '4', memberId: '4', meetingId: '3', checkInTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  // Volunteer hours
  const volunteerHours = [
    {
      id: '1',
      memberId: '1',
      eventId: '1',
      checkInTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      checkOutTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      hours: 4.0,
    },
    {
      id: '2',
      memberId: '1',
      eventId: '2',
      checkInTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      checkOutTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000 + 3.5 * 60 * 60 * 1000).toISOString(),
      hours: 3.5,
    },
  ];

  // Store in localStorage
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser]));
  localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(meetings));
  localStorage.setItem(STORAGE_KEYS.VOLUNTEER_EVENTS, JSON.stringify(volunteerEvents));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  localStorage.setItem(STORAGE_KEYS.VOLUNTEER_HOURS, JSON.stringify(volunteerHours));
};

