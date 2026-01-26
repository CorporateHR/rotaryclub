export const badgeRequirements = {
  redToBlueBadge: [
    {
      id: 1,
      title: 'Attend one Rotary Club of Livermore Valley board meeting',
      description: 'Second Tuesday of month immediately following regular meeting',
      category: 'meetings',
      required: true,
    },
    {
      id: 2,
      title: 'Attend one District event or RI Foundation session',
      description: 'District 5170 monthly meeting at https://livermorevalleyrotary.org/',
      category: 'events',
      required: true,
    },
    {
      id: 3,
      title: 'Meet with a board chairperson',
      description: 'Arrange to meet one on one with at least one board chairperson (Fundraising Chair, Community Service Chair, Youth Services Chair or International Service Chair) to gain a better understanding of what the club does.',
      category: 'orientation',
      required: true,
    },
    {
      id: 4,
      title: 'Complete New Member Orientation',
      description: 'Meet with Membership Chair to go through New Member Orientation, get oriented with ClubRunner, update club roster with your info & picture. Your username= first name.last name (note period between names).',
      category: 'orientation',
      required: true,
    },
    {
      id: 5,
      title: 'Participate in a RCLV social event/fundraiser/service project',
      description: 'Join and actively participate in a club social event, fundraiser, or service project',
      category: 'participation',
      required: true,
    },
    {
      id: 6,
      title: 'Perform Room Assignments',
      description: 'Duties include back table, greeter, ticket sales and set up and tear down within first 90 days of joining. Be there at 7:45am for greeter, set-up.',
      category: 'duties',
      required: true,
    },
    {
      id: 7,
      title: 'Serve on a Committee',
      description: 'Join and actively serve on at least one club committee',
      category: 'participation',
      required: true,
    },
    {
      id: 8,
      title: 'Properly introduce a visiting Rotarian two times',
      description: 'It is Rotary custom to introduce visiting Rotarians in the following format: Address President and Members > Indicate Club Name > Indicate Classification > Indicate Rotary Honors > Indicate Member Name.',
      category: 'protocol',
      required: true,
    },
    {
      id: 9,
      title: 'Attend 1 other Rotary Club meeting',
      description: 'Visit another local Rotary club. Local club websites: livermore-rotary.org, pleasantonrotary.org, pnr-rotary.org, rotarydublin.org',
      category: 'meetings',
      required: true,
    },
    {
      id: 10,
      title: 'Complete a new member talk',
      description: 'New member talks provide a great opportunity for the membership to learn more about you, your background, your profession, your hobbies, your interests, and any additional items you would like to share. Length should be around 5 minutes.',
      category: 'participation',
      required: true,
    },
    {
      id: 11,
      title: 'Talk with treasurer about payment methods',
      description: 'Meet with treasurer (Richard Fields) about different methods to pay dues',
      category: 'administrative',
      required: true,
    },
    {
      id: 12,
      title: 'Meet with Rotarian Foundation Board director',
      description: 'Educational overview and/or attend a RFL Meeting',
      category: 'orientation',
      required: true,
    },
    {
      id: 13,
      title: 'Bring a guest to a rotary meeting',
      description: 'Invite and bring a guest to experience a Rotary meeting',
      category: 'participation',
      required: true,
    },
    {
      id: 14,
      title: 'Complete District 5170 Online Youth Protection course',
      description: 'Email Lauren at lfranzella@bortonpetrini.com and she will send you the online course',
      category: 'training',
      required: true,
    },
    {
      id: 15,
      title: 'Blue Badge Awarded',
      description: 'Awarded at a formal induction meeting',
      category: 'completion',
      required: true,
    },
  ],
};

// Member badge progress data
export const memberBadgeProgress = {
  '1': {
    currentBadge: 'red',
    badgeColor: '#E74C3C',
    completedRequirements: [1, 2, 4, 5, 8, 10, 11],
    dateCompleted: null,
  },
  '2': {
    currentBadge: 'blue',
    badgeColor: '#4A90E2',
    completedRequirements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    dateCompleted: '2023-08-20',
  },
  '3': {
    currentBadge: 'red',
    badgeColor: '#E74C3C',
    completedRequirements: [1, 2, 4, 5, 8, 10, 11, 13],
    dateCompleted: null,
  },
  '4': {
    currentBadge: 'red',
    badgeColor: '#E74C3C',
    completedRequirements: [1, 4, 5, 11],
    dateCompleted: null,
  },
  '5': {
    currentBadge: 'blue',
    badgeColor: '#4A90E2',
    completedRequirements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    dateCompleted: '2023-09-10',
  },
  '6': {
    currentBadge: 'red',
    badgeColor: '#E74C3C',
    completedRequirements: [2, 4, 5, 8, 11, 13],
    dateCompleted: null,
  },
};

export const getBadgeRequirements = () => {
  return badgeRequirements.redToBlueBadge;
};

export const getMemberBadgeProgress = (memberId) => {
  return memberBadgeProgress[memberId] || {
    currentBadge: 'red',
    badgeColor: '#E74C3C',
    completedRequirements: [],
    dateCompleted: null,
  };
};

export const getProgressPercentage = (memberId) => {
  const progress = getMemberBadgeProgress(memberId);
  const totalRequirements = badgeRequirements.redToBlueBadge.length;
  return Math.round((progress.completedRequirements.length / totalRequirements) * 100);
};

export const updateRequirementStatus = (memberId, requirementId, completed) => {
  if (!memberBadgeProgress[memberId]) {
    memberBadgeProgress[memberId] = {
      currentBadge: 'red',
      badgeColor: '#E74C3C',
      completedRequirements: [],
      dateCompleted: null,
    };
  }

  const progress = memberBadgeProgress[memberId];
  
  if (completed && !progress.completedRequirements.includes(requirementId)) {
    progress.completedRequirements.push(requirementId);
  } else if (!completed) {
    progress.completedRequirements = progress.completedRequirements.filter(id => id !== requirementId);
  }

  // Check if all requirements are completed
  const totalRequirements = badgeRequirements.redToBlueBadge.length;
  if (progress.completedRequirements.length === totalRequirements) {
    progress.currentBadge = 'blue';
    progress.badgeColor = '#4A90E2';
    progress.dateCompleted = new Date().toISOString().split('T')[0];
  } else {
    progress.currentBadge = 'red';
    progress.badgeColor = '#E74C3C';
    progress.dateCompleted = null;
  }

  return progress;
};
