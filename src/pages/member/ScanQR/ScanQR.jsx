import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { FiCamera } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Button from '../../../components/common/Button/Button';
import InfoBox from '../../../components/cards/InfoBox/InfoBox';
import { parseQRCode } from '../../../utils/qrCode';
import { QR_CODE_TYPES } from '../../../utils/constants';
import styles from './ScanQR.module.css';

const ScanQR = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState(null);

  useEffect(() => {
    return () => {
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [html5QrCode]);

  const startScanning = async () => {
    try {
      const qrCode = new Html5Qrcode('qr-reader');
      setHtml5QrCode(qrCode);
      setScanning(true);

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleQRCodeScanned(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors
        }
      );
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (html5QrCode) {
      await html5QrCode.stop();
      html5QrCode.clear();
      setHtml5QrCode(null);
      setScanning(false);
    }
  };

  const handleQRCodeScanned = (qrString) => {
    stopScanning();
    const parsed = parseQRCode(qrString);
    
    if (!parsed) {
      alert('Invalid QR code');
      return;
    }

    if (parsed.type === QR_CODE_TYPES.MEETING) {
      navigate(`/member/scan-success/meeting`, { state: { meetingId: parsed.id, token: parsed.token } });
    } else if (parsed.type === QR_CODE_TYPES.VOLUNTEER_IN) {
      navigate(`/member/scan-success/volunteer-in`, { state: { eventId: parsed.id, token: parsed.token } });
    } else if (parsed.type === QR_CODE_TYPES.VOLUNTEER_OUT) {
      navigate(`/member/scan-success/volunteer-out`, { state: { eventId: parsed.id, token: parsed.token } });
    }
  };

  const simulateScan = (type) => {
    if (type === 'meeting') {
      navigate(`/member/scan-success/meeting`, { state: { meetingId: '1', token: 'ABC123' } });
    } else if (type === 'volunteer-in') {
      navigate(`/member/scan-success/volunteer-in`, { state: { eventId: '1', token: 'XYZ789' } });
    }
  };

  return (
    <div className={styles.scanPage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <h1 className={styles.title}>Scan QR Code</h1>

        <div className={styles.cameraContainer}>
          {!scanning ? (
            <div className={styles.cameraPlaceholder}>
              <FiCamera className={styles.cameraIcon} />
              <p className={styles.instructions}>
                Tap the button below to start scanning QR codes
              </p>
            </div>
          ) : (
            <div id="qr-reader" className={styles.qrReader}></div>
          )}
        </div>

        {!scanning ? (
          <Button variant="primary" className={styles.scanButton} onClick={startScanning}>
            Start Scanning
          </Button>
        ) : (
          <Button variant="danger" className={styles.stopButton} onClick={stopScanning}>
            Stop Scanning
          </Button>
        )}

        <InfoBox type="info" className={styles.infoBox}>
          <strong>QR Code Types:</strong>
          <br />
          • Meeting check-in codes - Record your attendance at meetings
          <br />
          • Volunteer check-in codes - Start tracking your volunteer hours
          <br />
          • Volunteer check-out codes - End tracking and record your hours
        </InfoBox>

        <div className={styles.simulateSection}>
          <p className={styles.simulateLabel}>For Testing:</p>
          <div className={styles.simulateButtons}>
            <Button variant="secondary" size="sm" onClick={() => simulateScan('meeting')}>
              Simulate Meeting Check-In
            </Button>
            <Button variant="secondary" size="sm" onClick={() => simulateScan('volunteer-in')}>
              Simulate Volunteer Check-In
            </Button>
          </div>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default ScanQR;

