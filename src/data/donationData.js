export const donationFoundations = [
  {
    id: '1',
    name: 'International Rotary Foundation',
    description: 'Support global humanitarian projects and initiatives through The Rotary Foundation.',
    logo: '🌍',
    qrCode: 'DONATION:IRF:PAYMENT123',
    bankDetails: {
      accountName: 'The Rotary Foundation',
      accountNumber: '1234567890',
      bankName: 'Global Bank International',
      ifscCode: 'GLOB0001234',
      swiftCode: 'GLOBUS33',
      branch: 'International Branch',
    },
    upiId: 'rotary.foundation@upi',
    causes: [
      'Disease prevention and treatment',
      'Water and sanitation',
      'Maternal and child health',
      'Basic education and literacy',
      'Economic and community development',
      'Peace and conflict resolution',
    ],
  },
  {
    id: '2',
    name: 'Livermore Rotary Foundation',
    description: 'Support local community projects and scholarships in the Livermore area.',
    logo: '🏘️',
    qrCode: 'DONATION:LRF:PAYMENT456',
    bankDetails: {
      accountName: 'Livermore Rotary Foundation',
      accountNumber: '9876543210',
      bankName: 'Community Bank of Livermore',
      ifscCode: 'LIVE0005678',
      swiftCode: 'LIVEUS44',
      branch: 'Main Street Branch',
    },
    upiId: 'livermore.rotary@upi',
    causes: [
      'Local youth scholarships',
      'Community development projects',
      'Food bank support',
      'Senior citizen programs',
      'Environmental initiatives',
      'Local education support',
    ],
  },
];

export const getDonationFoundations = () => {
  return donationFoundations;
};

export const getDonationFoundationById = (id) => {
  return donationFoundations.find(foundation => foundation.id === id);
};
