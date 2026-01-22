import { QR_CODE_TYPES } from './constants';

// Generate QR code token
export const generateQRToken = (type, id) => {
  const randomToken = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `${type}:${id}:${randomToken}`;
};

// Parse QR code string
export const parseQRCode = (qrString) => {
  const parts = qrString.split(':');
  if (parts.length !== 3) {
    return null;
  }

  const [type, id, token] = parts;
  
  if (!Object.values(QR_CODE_TYPES).includes(type)) {
    return null;
  }

  return {
    type,
    id,
    token,
  };
};

// Generate meeting QR code
export const generateMeetingQR = (meetingId) => {
  return generateQRToken(QR_CODE_TYPES.MEETING, meetingId);
};

// Generate volunteer check-in QR code
export const generateVolunteerCheckInQR = (eventId) => {
  return generateQRToken(QR_CODE_TYPES.VOLUNTEER_IN, eventId);
};

// Generate volunteer check-out QR code
export const generateVolunteerCheckOutQR = (eventId) => {
  return generateQRToken(QR_CODE_TYPES.VOLUNTEER_OUT, eventId);
};

